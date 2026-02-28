// Edge Function: Cancel Booking
// Called when either party cancels a booking

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import {
    corsHeaders,
    getProUserIdFromProfessional,
    getPushToken,
    sendPushNotification,
    supabaseAdmin,
} from '../_shared/utils.ts'

interface CancelPayload {
    booking_id: string
    cancelled_by?: 'client' | 'professional'
}

serve(async (req) => {
    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: corsHeaders })
    }

    try {
        const { booking_id, cancelled_by }: CancelPayload = await req.json()

        if (!booking_id) {
            return new Response(
                JSON.stringify({ error: 'booking_id is required' }),
                { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
            )
        }

        // Update booking status to cancelled
        const { data: booking, error } = await supabaseAdmin
            .from('bookings')
            .update({ status: 'cancelled' })
            .eq('id', booking_id)
            .select('*')
            .single()

        if (error) throw error

        // Notify client
        const clientPushToken = await getPushToken(booking.client_id)
        if (clientPushToken) {
            await sendPushNotification(
                clientPushToken,
                '📅 Booking Cancelled',
                `Your ${booking.service_name} appointment on ${booking.booking_date} has been cancelled.`,
                { type: 'booking_cancelled', bookingId: booking.id }
            )
        }

        // Notify professional
        const proUserId = await getProUserIdFromProfessional(booking.professional_id)
        if (proUserId) {
            const proPushToken = await getPushToken(proUserId)
            if (proPushToken) {
                await sendPushNotification(
                    proPushToken,
                    '📅 Booking Cancelled',
                    `${booking.client_name}'s ${booking.service_name} appointment on ${booking.booking_date} has been cancelled.`,
                    { type: 'booking_cancelled', bookingId: booking.id }
                )
            }
        }

        return new Response(
            JSON.stringify({ success: true, message: 'Booking cancelled', booking_id }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )

    } catch (error) {
        return new Response(
            JSON.stringify({ error: String(error) }),
            { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
    }
})
