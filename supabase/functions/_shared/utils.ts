// Shared utilities for Lushy Supabase Edge Functions
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

// Supabase client with service role for full access
export const supabaseAdmin = createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
)

// Expo Push Notification helper
export async function sendPushNotification(
    pushToken: string,
    title: string,
    body: string,
    data?: Record<string, unknown>
): Promise<{ success: boolean; error?: string }> {
    if (!pushToken || !pushToken.startsWith('ExponentPushToken')) {
        return { success: false, error: 'Invalid push token' }
    }

    try {
        const response = await fetch('https://exp.host/--/api/v2/push/send', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                to: pushToken,
                title,
                body,
                data,
                sound: 'default',
                priority: 'high',
            }),
        })

        const result = await response.json()
        return { success: true, ...result }
    } catch (error) {
        return { success: false, error: String(error) }
    }
}

// Get user's push token from profiles table
export async function getPushToken(userId: string): Promise<string | null> {
    const { data } = await supabaseAdmin
        .from('profiles')
        .select('push_token')
        .eq('id', userId)
        .single()

    return data?.push_token ?? null
}

// Get professional's user_id from professionals table
export async function getProUserIdFromProfessional(professionalId: string): Promise<string | null> {
    const { data } = await supabaseAdmin
        .from('professionals')
        .select('user_id')
        .eq('id', professionalId)
        .single()

    return data?.user_id ?? null
}

// Standard CORS headers for Edge Functions
export const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}
