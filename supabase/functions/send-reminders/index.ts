// Edge Function: Send Booking Reminders
// Scheduled via Supabase pg_cron or called hourly
// Sends reminders at 24hr and 3hr before appointments

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import {
    corsHeaders,
    getProUserIdFromProfessional,
    getPushToken,
    sendPushNotification,
    supabaseAdmin,
} from '../_shared/utils.ts'

serve(async (req) => {
    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: corsHeaders })
    }

    try {
        // Get all accepted bookings
        const { data: bookings, error } = await supabaseAdmin
            .from('bookings')
            .select('*')
            .eq('status', 'accepted')

        if (error) throw error

        const now = new Date()
        const remindersSent: string[] = []

        for (const booking of bookings || []) {
            // Calculate hours until appointment
            const appointmentDateTime = new Date(`${booking.booking_date}T${booking.booking_time}`)
            const hoursUntil = (appointmentDateTime.getTime() - now.getTime()) / (1000 * 60 * 60)

            // Check if we should send a reminder (24hr or 3hr window)
            let reminderType: '24hr' | '3hr' | null = null
            if (hoursUntil >= 23 && hoursUntil <= 25) {
                reminderType = '24hr'
            } else if (hoursUntil >= 2.5 && hoursUntil <= 3.5) {
                reminderType = '3hr'
            }

            if (!reminderType) continue

            const timeDescription = reminderType === '24hr' ? 'Tomorrow' : 'In 3 hours'

            // Notify client
            const clientPushToken = await getPushToken(booking.client_id)
            if (clientPushToken) {
                await sendPushNotification(
                    clientPushToken,
                    '⏰ Appointment Reminder',
                    `${timeDescription}: ${booking.service_name} with ${booking.professional_name} at ${booking.booking_time}`,
                    { type: 'reminder', bookingId: booking.id }
                )
            }

            // Notify professional
            const proUserId = await getProUserIdFromProfessional(booking.professional_id)
            if (proUserId) {
                const proPushToken = await getPushToken(proUserId)
                if (proPushToken) {
                    await sendPushNotification(
                        proPushToken,
                        '⏰ Appointment Reminder',
                        `${timeDescription}: ${booking.service_name} with ${booking.client_name} at ${booking.booking_time}`,
                        { type: 'reminder', bookingId: booking.id }
                    )
                }
            }

            remindersSent.push(booking.id)
        }

        return new Response(
            JSON.stringify({
                success: true,
                reminders_sent: remindersSent.length,
                booking_ids: remindersSent
            }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )

    } catch (error) {
        return new Response(
            JSON.stringify({ error: String(error) }),
            { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
    }
})
