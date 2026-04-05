const puppeteer = require('puppeteer');
const path = require('path');

const DOCS_DIR = path.join(__dirname);

const files = [
    {
        html: 'lushy-cancellation-refund-policy.html',
        pdf: 'lushy-cancellation-refund-policy.pdf',
    },
    {
        html: 'lushy-privacy-policy.html',
        pdf: 'lushy-privacy-policy.pdf',
    },
];

(async () => {
    const browser = await puppeteer.launch({ headless: true });

    for (const file of files) {
        const htmlPath = `file://${path.join(DOCS_DIR, file.html)}`;
        const pdfPath = path.join(DOCS_DIR, file.pdf);

        console.log(`Generating: ${file.pdf}`);
        const page = await browser.newPage();

        await page.goto(htmlPath, { waitUntil: 'networkidle0', timeout: 30000 });

        // Wait a bit for fonts to load
        await new Promise(r => setTimeout(r, 2000));

        await page.pdf({
            path: pdfPath,
            format: 'A4',
            printBackground: true,
            margin: { top: '0mm', right: '0mm', bottom: '0mm', left: '0mm' },
        });

        await page.close();
        console.log(`✅ Saved: ${file.pdf}`);
    }

    await browser.close();
    console.log('\n🎉 Both PDFs generated successfully!');
})();
