const puppeteer = require('puppeteer-extra');
const pluginStealth = require('puppeteer-extra-plugin-stealth');
const urls = require('./url.json');

puppeteer.use(pluginStealth());


const start = async () => {
    return new Promise(async (resolve, reject) => {
        console.log('Starting..');
        const browser = await puppeteer.launch({ headless: true });
        const pages = await browser.pages();
        pages[0].close();

        for (const urlObj of urls) {
            const page = await browser.newPage();
            await page.goto(urlObj.data);
            await page.keyboard.press('Tab');
            await page.keyboard.press('Enter');
            await new Promise(r => setTimeout(r, 30000));
            await page.close();
        }

        await browser.close();
        resolve();
    });
}

start().then(() => console.log("Finished opening all URLs"));
