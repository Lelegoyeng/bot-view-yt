const puppeteer = require('puppeteer-extra');
const cheerio = require('cheerio');
const pluginStealth = require('puppeteer-extra-plugin-stealth');
const urls = require('./url.json');
const proxy = require('./proxy');

puppeteer.use(pluginStealth());

const start = async () => {
    try {
        const proxies = await proxy();
        console.log('Daftar Proxy:', proxies);

        for (const proxy of proxies) {
            console.log(`Menggunakan proxy ${proxy.ip}:${proxy.port}`);

            const browser = await puppeteer.launch({
                headless: false,
                args: [
                    `--proxy-server=http://${proxy.ip}:${proxy.port}`
                ]
            });
            const pages = await browser.pages();
            pages[0].close();

            for (const urlObj of urls) {
                const page = await browser.newPage();
                try {
                    await page.goto(urlObj.data, { waitUntil: 'networkidle2', timeout: 30000 });
                    console.log(`Berhasil membuka ${urlObj.data} dengan proxy ${proxy.ip}:${proxy.port}`);
                } catch (error) {
                    console.log(`Gagal membuka ${urlObj.data} dengan proxy ${proxy.ip}:${proxy.port}`);
                } finally {
                    await page.close();
                }
            }

            await browser.close();
        }

        console.log("Selesai membuka semua URL dengan semua proxy");
    } catch (error) {
        console.error('Terjadi kesalahan:', error);
    }
}

start();
