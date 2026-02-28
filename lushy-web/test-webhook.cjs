// To test the Webhook locally, ensure your Next.js server is running (npm run dev)
// Then run this script: node test-webhook.cjs
// It mimics the raw XML Payload DPO Group's servers will shoot at your Webhook API Route!

const MOCK_COMPANY_REF = "11111111-2222-3333-4444-555555555555"; // Your desired Professional's UUID here

const mockXmlPayload = `<?xml version="1.0" encoding="utf-8"?>
<API3G>
  <Response>OK</Response>
  <Result>000</Result>
  <ResultExplanation>Transaction approved</ResultExplanation>
  <TransactionToken>12345678-ABCD-1234-WXYZ-987654321000</TransactionToken>
  <TransactionRef>ABC123XYZ</TransactionRef>
  <CustomerName>John Doe</CustomerName>
  <CustomerCredit>200.00</CustomerCredit>
  <CustomerCreditType>BWP</CustomerCreditType>
  <CompanyRef>${MOCK_COMPANY_REF}</CompanyRef>
</API3G>`;

async function testWebhook() {
    try {
        console.log("🔥 Firing Mock DPO XML Webhook Event...");

        // In production, this URL will be exactly: https://lushyapp.com/api/webhooks/dpo
        const response = await fetch('http://localhost:3000/api/webhooks/dpo', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/xml',
            },
            body: mockXmlPayload
        });

        const status = response.status;
        const text = await response.text();

        console.log(`\n📬 Webhook Server Responded [HTTP ${status}]:`);
        console.log(text);

        if (status === 200) {
            console.log("\n✅ SUCCESS: The webhook successfully parsed the XML and escalated the permissions.");
        } else {
            console.log("\n❌ FAILED: The webhook rejected the payload or the Database rejected the Service Key.");
        }

    } catch (error) {
        console.error("Test failed utterly:", error);
    }
}

testWebhook();
