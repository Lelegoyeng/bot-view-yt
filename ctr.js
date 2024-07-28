const puppeteer = require('puppeteer-extra');
const pluginStealth = require('puppeteer-extra-plugin-stealth');

puppeteer.use(pluginStealth());

const start = async () => {
    return new Promise(async (resolve, reject) => {
        try {
            console.log('Starting..');
            const browser = await puppeteer.launch({
                headless: true,
                args: ['--no-sandbox', '--disable-setuid-sandbox'],
            });
            const page = await browser.newPage();
            await page.goto('https://youtube.com/results?search_query=douyin+ncs+beautiful+chinese+sexy+girl');
            await page.keyboard.press('Tab');
            await page.keyboard.press('Tab');
            await page.keyboard.press('Tab');
            await page.keyboard.press('Tab');
            await page.keyboard.press('Tab');
            await page.keyboard.press('Tab');
            await page.keyboard.press('Tab');
            await page.keyboard.press('Tab');
            await page.keyboard.press('Tab');
            await page.keyboard.press('Tab');
            await page.keyboard.press('Tab');
            await page.keyboard.press('Enter');
            await new Promise(r => setTimeout(r, 15000)); // Wait for 30 seconds
            await page.close();
            await browser.close();

            // await page.close(); // Menutup halaman setelah selesai
            // await browser.close(); // Menutup browser setelah halaman ditutup
            resolve();
        } catch (error) {
            reject(error);
        }
    });
}

const runContinuously = () => {
    start()
        .then(() => {
            console.log("Finished opening URLs");
            runContinuously();
        })
        .catch((err) => {
            console.error("Error: ", err);
            setTimeout(runContinuously, 30000);
        });
}

runContinuously();
