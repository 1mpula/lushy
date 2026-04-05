const puppeteer = require('puppeteer');
const path = require('path');

(async () => {
    try {
        const browser = await puppeteer.launch({ headless: true });
        const page = await browser.newPage();
        
        const htmlPath = `file://${path.join(__dirname, 'index.html')}`;
        console.log('Loading:', htmlPath);

        // Set viewport to the poster size (1080x1920)
        await page.setViewport({ width: 1080, height: 1920, deviceScaleFactor: 2 });

        // Use domcontentloaded for local files
        await page.goto(htmlPath, { waitUntil: 'domcontentloaded', timeout: 60000 });

        // Wait specifically for images to load
        await new Promise(r => setTimeout(r, 5000));

        const posters = [
            { id: '#poster7', name: 'discovery_poster_final.png' },
            { id: '#poster8', name: 'general_poster_final.png' }
        ];

        for (const poster of posters) {
            const element = await page.$(poster.id);
            if (element) {
                console.log(`Capturing ${poster.id}...`);
                await element.screenshot({
                    path: path.join(__dirname, poster.name),
                    omitBackground: false
                });
                console.log(`✅ Poster saved as ${poster.name}`);
            } else {
                console.log(`❌ Error: Could not find ${poster.id} element`);
            }
        }

        await browser.close();
    } catch (err) {
        console.error('FAILED:', err);
        process.exit(1);
    }
})();
