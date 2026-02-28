// Edge Function: Notify on New Message
// Sends push notification when a message is received

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import {
    corsHeaders,
    getPushToken,
    sendPushNotification,
    supabaseAdmin
} from '../_shared/utils.ts'

interface MessagePayload {
    record?: {
        id: string
        conversation_id: string
        sender_id: string
        content: string
        message_type: string
        created_at: string
    }
}

serve(async (req) => {
    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: corsHeaders })
    }

    try {
        const payload: MessagePayload = await req.json()
        const message = payload.record

        if (!message) {
            return new Response(
                JSON.stringify({ error: 'No message data' }),
                { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
            )
        }

        // Get conversation details to find recipient
        const { data: conversation, error: convError } = await supabaseAdmin
            .from('conversations')
            .select(`
        *,
        client:client_id(id, full_name, push_token),
        professional:professional_id(id, business_name, user_id)
      `)
            .eq('id', message.conversation_id)
            .single()

        if (convError || !conversation) {
            return new Response(
                JSON.stringify({ error: 'Conversation not found' }),
                { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
            )
        }

        // Determine who should receive the notification (the other party)
        let recipientUserId: string | null = null
        let senderName = 'Someone'

        if (message.sender_id === conversation.client_id) {
            // Sender is client, notify professional
            recipientUserId = conversation.professional?.user_id || null
            senderName = conversation.client?.full_name || 'Client'
        } else {
            // Sender is professional, notify client
            recipientUserId = conversation.client_id
            senderName = conversation.professional?.business_name || 'Professional'
        }

        if (!recipientUserId) {
            return new Response(
                JSON.stringify({ success: false, message: 'No recipient found' }),
                { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
            )
        }

        // Get recipient's push token
        const pushToken = await getPushToken(recipientUserId)

        if (!pushToken) {
            return new Response(
                JSON.stringify({ success: true, message: 'No push token, notification skipped' }),
                { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
            )
        }

        // Send push notification
        const result = await sendPushNotification(
            pushToken,
            `💬 ${senderName}`,
            message.content.length > 100 ? message.content.slice(0, 100) + '...' : message.content,
            {
                type: 'new_message',
                conversationId: message.conversation_id,
                messageId: message.id,
            }
        )

        return new Response(
            JSON.stringify({ success: true, push_result: result }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )

    } catch (error) {
        return new Response(
            JSON.stringify({ error: String(error) }),
            { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
    }
})
