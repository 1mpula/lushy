// Edge Function: Complete Booking & Request Review
// Called when a booking is marked as completed

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import {
    corsHeaders,
    getPushToken,
    sendPushNotification,
    supabaseAdmin,
} from '../_shared/utils.ts'

interface CompletePayload {
    booking_id: string
}

serve(async (req) => {
    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: corsHeaders })
    }

    try {
        const { booking_id }: CompletePayload = await req.json()

        if (!booking_id) {
            return new Response(
                JSON.stringify({ error: 'booking_id is required' }),
                { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
            )
        }

        // Update booking status to completed
        const { data: booking, error } = await supabaseAdmin
            .from('bookings')
            .update({ status: 'completed' })
            .eq('id', booking_id)
            .select('*')
            .single()

        if (error) throw error

        // Get client's push token and request review
        const clientPushToken = await getPushToken(booking.client_id)

        if (clientPushToken) {
            await sendPushNotification(
                clientPushToken,
                '⭐ How was your experience?',
                `Your ${booking.service_name} with ${booking.professional_name} is complete. Leave a review!`,
                {
                    type: 'review_request',
                    bookingId: booking.id,
                    professionalId: booking.professional_id,
                }
            )
        }

        return new Response(
            JSON.stringify({ success: true, message: 'Booking completed, review requested', booking_id }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )

    } catch (error) {
        return new Response(
            JSON.stringify({ error: String(error) }),
            { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
    }
})
