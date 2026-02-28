// Edge Function: Notify Professional of New Booking
// Triggered when a new booking is created

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import {
    corsHeaders,
    getProUserIdFromProfessional,
    getPushToken,
    sendPushNotification,
    supabaseAdmin,
} from '../_shared/utils.ts'

interface BookingPayload {
    booking_id?: string
    record?: {
        id: string
        client_name: string
        professional_id: string
        professional_name: string
        service_name: string
        booking_date: string
        booking_time: string
        price: number
    }
}

serve(async (req) => {
    // Handle CORS preflight
    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: corsHeaders })
    }

    try {
        const payload: BookingPayload = await req.json()

        // Support both webhook and database trigger formats
        const bookingId = payload.booking_id || payload.record?.id

        let booking = payload.record

        // If only booking_id provided, fetch booking details
        if (!booking && bookingId) {
            const { data, error } = await supabaseAdmin
                .from('bookings')
                .select('*')
                .eq('id', bookingId)
                .single()

            if (error) throw error
            booking = data
        }

        if (!booking) {
            return new Response(
                JSON.stringify({ error: 'No booking data provided' }),
                { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
            )
        }

        // Get professional's user_id to find their push token
        const proUserId = await getProUserIdFromProfessional(booking.professional_id)

        if (!proUserId) {
            return new Response(
                JSON.stringify({ success: false, error: 'Professional not found' }),
                { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
            )
        }

        // Get push token
        const pushToken = await getPushToken(proUserId)

        if (!pushToken) {
            return new Response(
                JSON.stringify({ success: true, message: 'No push token, notification skipped' }),
                { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
            )
        }

        // Send push notification
        const result = await sendPushNotification(
            pushToken,
            '🌿 New Booking Request!',
            `${booking.client_name} wants to book ${booking.service_name} on ${booking.booking_date} at ${booking.booking_time}`,
            {
                type: 'new_booking',
                bookingId: booking.id,
            }
        )

        return new Response(
            JSON.stringify({ success: true, booking_id: booking.id, push_result: result }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )

    } catch (error) {
        return new Response(
            JSON.stringify({ error: String(error) }),
            { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
    }
})
