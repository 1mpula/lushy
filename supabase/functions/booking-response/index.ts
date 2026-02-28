// Edge Function: Handle Professional's Response to Booking
// Called when professional accepts or rejects a booking

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import {
    corsHeaders,
    getPushToken,
    sendPushNotification,
    supabaseAdmin,
} from '../_shared/utils.ts'

interface ResponsePayload {
    booking_id: string
    status: 'accepted' | 'rejected'
}

serve(async (req) => {
    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: corsHeaders })
    }

    try {
        const { booking_id, status }: ResponsePayload = await req.json()

        if (!booking_id || !status) {
            return new Response(
                JSON.stringify({ error: 'booking_id and status are required' }),
                { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
            )
        }

        // Update booking status in database
        const { data: booking, error } = await supabaseAdmin
            .from('bookings')
            .update({ status })
            .eq('id', booking_id)
            .select('*')
            .single()

        if (error) throw error

        // Get client's push token
        const clientPushToken = await getPushToken(booking.client_id)

        if (clientPushToken) {
            if (status === 'accepted') {
                await sendPushNotification(
                    clientPushToken,
                    '✅ Booking Confirmed!',
                    `${booking.professional_name} accepted your ${booking.service_name} booking for ${booking.booking_date} at ${booking.booking_time}`,
                    {
                        type: 'booking_accepted',
                        bookingId: booking.id,
                    }
                )
            } else {
                await sendPushNotification(
                    clientPushToken,
                    '❌ Booking Declined',
                    `Unfortunately, ${booking.professional_name} couldn't accept your ${booking.service_name} request. Try another time or professional!`,
                    {
                        type: 'booking_rejected',
                        bookingId: booking.id,
                    }
                )
            }
        }

        return new Response(
            JSON.stringify({ success: true, status, booking_id }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )

    } catch (error) {
        return new Response(
            JSON.stringify({ error: String(error) }),
            { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
    }
})
