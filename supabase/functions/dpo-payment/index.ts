import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { v4 as uuidv4 } from 'https://esm.sh/uuid@9'

const DPO_ENDPOINT = 'https://secure.3gdirectpay.com/API/v6/'

serve(async (req) => {
    // CORS Headers
    if (req.method === 'OPTIONS') {
        return new Response('ok', {
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST',
                'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
            }
        })
    }

    try {
        const { action, professionalId, email, amount, transactionToken, companyRef } = await req.json()
        const DPO_COMPANY_TOKEN = Deno.env.get('DPO_COMPANY_TOKEN') || '68B90B5E-25F6-4146-8AB1-C7A3A0C41A7F' // Sandbox token
        const supabase = createClient(
            Deno.env.get('SUPABASE_URL') ?? '',
            Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
        )

        if (action === 'createToken') {
            const ref = uuidv4()
            // DPO Create Token XML
            const xmlRequest = `<?xml version="1.0" encoding="utf-8"?>
<API3G>
  <CompanyToken>${DPO_COMPANY_TOKEN}</CompanyToken>
  <Request>createToken</Request>
  <Transaction>
    <PaymentAmount>${amount}</PaymentAmount>
    <PaymentCurrency>USD</PaymentCurrency>
    <CompanyRef>${ref}</CompanyRef>
    <RedirectURL>https://lushy.app/subscription/success?ref=${ref}</RedirectURL>
    <BackURL>https://lushy.app/subscription/cancel</BackURL>
    <CompanyRefUnique>1</CompanyRefUnique>
    <PTL>30</PTL>
  </Transaction>
  <Services>
    <Service>
      <ServiceType>3854</ServiceType>
      <ServiceDescription>Lushy Pro Subscription - ${professionalId}</ServiceDescription>
      <ServiceDate>${new Date().toISOString().replace('T', ' ').substring(0, 16)}</ServiceDate>
    </Service>
  </Services>
</API3G>`

            const response = await fetch(DPO_ENDPOINT, {
                method: 'POST',
                headers: { 'Content-Type': 'application/xml' },
                body: xmlRequest
            })
            const xmlResponse = await response.text()

            // Basic regex parsing for XML since Deno doesn't have a built-in DOM parser easily accessible here
            const resultMatch = xmlResponse.match(/<Result>(.*?)<\/Result>/)
            const transTokenMatch = xmlResponse.match(/<TransToken>(.*?)<\/TransToken>/)
            const explanationMatch = xmlResponse.match(/<ResultExplanation>(.*?)<\/ResultExplanation>/)

            return new Response(JSON.stringify({
                result: resultMatch ? resultMatch[1] : null,
                explanation: explanationMatch ? explanationMatch[1] : null,
                transToken: transTokenMatch ? transTokenMatch[1] : null,
                companyRef: ref
            }), {
                headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
            })
        }

        if (action === 'verifyToken') {
            const xmlRequest = `<?xml version="1.0" encoding="utf-8"?>
<API3G>
  <CompanyToken>${DPO_COMPANY_TOKEN}</CompanyToken>
  <Request>verifyToken</Request>
  <TransactionToken>${transactionToken}</TransactionToken>
  <CompanyRef>${companyRef}</CompanyRef>
</API3G>`

            const response = await fetch(DPO_ENDPOINT, {
                method: 'POST',
                headers: { 'Content-Type': 'application/xml' },
                body: xmlRequest
            })
            const xmlResponse = await response.text()

            const resultMatch = xmlResponse.match(/<Result>(.*?)<\/Result>/)
            const explanationMatch = xmlResponse.match(/<ResultExplanation>(.*?)<\/ResultExplanation>/)
            const result = resultMatch ? resultMatch[1] : null

            // Result '000' means Transaction Paid
            if (result === '000') {
                const { error } = await supabase
                    .from('professionals')
                    .update({
                        subscription_status: 'active',
                        // Extending due date by 30 days securely on the backend
                        subscription_due_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
                    })
                    .eq('id', professionalId)

                if (error) throw error
            }

            return new Response(JSON.stringify({
                result,
                explanation: explanationMatch ? explanationMatch[1] : null,
                isPaid: result === '000'
            }), {
                headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
            })
        }

        return new Response(JSON.stringify({ error: 'Invalid action' }), { status: 400, headers: { 'Access-Control-Allow-Origin': '*' } })

    } catch (error) {
        return new Response(JSON.stringify({ error: error.message }), { status: 500, headers: { 'Access-Control-Allow-Origin': '*' } })
    }
})
