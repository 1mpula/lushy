import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';
import { parseStringPromise } from 'xml2js';

// Requires a Service Role Key to bypass RLS and update the professionals table securely
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

// Native Error throwing if the server isn't properly configured yet
if (!supabaseUrl || !supabaseServiceKey) {
    console.warn("⚠️ Webhook is inactive: SUPABASE_SERVICE_ROLE_KEY or NEXT_PUBLIC_SUPABASE_URL is missing in Vercel.");
}

const supabaseAdmin = createClient(supabaseUrl || 'https://placeholder.supabase.co', supabaseServiceKey || 'placeholder-key');

export async function POST(req: Request) {
    try {
        // DPO authentically utilizes raw XML payloads for its server-to-server Webhooks
        const xmlBody = await req.text();

        // Parse the raw XML directly into JSON syntax
        const parsed = await parseStringPromise(xmlBody, { explicitArray: false });

        // DPO object structural mapping (V6 API Standard)
        const responseData = parsed?.API3G || parsed?.Response || parsed;
        const transactionToken = responseData?.TransToken || responseData?.TransactionToken;
        const result = responseData?.Result;

        // CompanyRef is mapped to the Professional's Supabase Auth user_id during your DPO Token Creation Stage
        const companyRef = responseData?.CompanyRef;

        if (!transactionToken || !companyRef) {
            return new NextResponse('Missing vital transaction token or CompanyRef (Professional ID)', { status: 400 });
        }

        if (result === '000') {
            // Payment success ('000' is the standard DPO success code)

            // Bypass RLS Security using the Administrator Key
            const { error } = await supabaseAdmin
                .from('professionals')
                .update({
                    subscription_status: 'active',
                    subscription_due_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() // Now + 30 Days precisely
                })
                .eq('user_id', companyRef);

            if (error) {
                console.error("Webook Database Escalation Error:", error);
                return new NextResponse('Database Integrity Error', { status: 500 });
            }

            return new NextResponse('Webhook processed and Pro account unlocked successfully', { status: 200 });
        } else {
            // Payment failed, expired, or was cancelled via DPO Modal
            console.warn(`DPO Webhook reported failure code: ${result}`);
            return new NextResponse(`Payment pipeline aborted with code ${result}`, { status: 200 });
        }
    } catch (error) {
        console.error("Critical XML Webhook Parsing Error:", error);
        return new NextResponse('Internal Webhook Server Error', { status: 500 });
    }
}
