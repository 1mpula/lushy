const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

const docs = [
    {
        name: 'Certificate_of_Incorporation.pdf',
        title: 'Certificate of Incorporation',
        content: 'This is a placeholder for your official Certificate of Incorporation or Certificate of Registration.\n\nPlease replace this file with the scanned copy of your actual certificate issued by the relevant regulatory body.'
    },
    {
        name: 'Tax_Registration_Certificate.pdf',
        title: 'Tax Registration Certificate',
        content: 'This is a placeholder for your Tax Registration Certificate or Tax Clearance Certificate.\n\nPlease replace this file with the scanned copy of your actual tax document showing your company\'s Tax Identification Number (TIN).'
    },
    {
        name: 'Directors_National_ID_or_Passport.pdf',
        title: "Director's National ID / Passport",
        content: 'This is a placeholder for the National ID or Passport of the Director(s) or Business Owner(s).\n\nPlease replace this file with a full-color, high-resolution scanned copy of the ID (both front and back) or Passport.'
    },
    {
        name: 'Refund_and_Cancellation_Policy.pdf',
        title: 'Refund & Cancellation Policy',
        content: 'This is a template for your Refund and Cancellation Policy.\n\n[Company Name] Refund Policy:\n1. Refunds must be requested within X days of the transaction.\n2. Services fully rendered are non-refundable.\n3. Cancellations must be made at least Y hours in advance.\n\nPlease update this document with your actual business policies as required by DPO Group.'
    },
    {
        name: 'Bank_Statement.pdf',
        title: 'Company Bank Statement',
        content: 'This is a placeholder for your Company Bank Statement.\n\nPlease replace this file with a recent bank statement (usually within the last 3 months) that clearly shows the business account name, account number, and bank details for settlement purposes.'
    },
    {
        name: 'Memorandum_and_Articles_of_Association.pdf',
        title: 'Memorandum & Articles of Association',
        content: 'This is a placeholder for your Memorandum and Articles of Association (or latest CR 12 in some jurisdictions).\n\nPlease replace this file with the official documents detailing your company structure, shareholding, and rules of governance.'
    }
];

docs.forEach(docInfo => {
    const doc = new PDFDocument();
    const filePath = path.join(__dirname, docInfo.name);
    doc.pipe(fs.createWriteStream(filePath));

    doc.fontSize(20).text(docInfo.title, { underline: true, align: 'center' });
    doc.moveDown(2);
    doc.fontSize(12).text(docInfo.content, { align: 'left' });
    doc.end();

    console.log(`Created: ${docInfo.name}`);
});

console.log('\nAll DPO placeholder documents have been generated successfully.');
