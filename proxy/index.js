const puppeteer = require('puppeteer-extra');
const cheerio = require('cheerio');
const pluginStealth = require('puppeteer-extra-plugin-stealth');

puppeteer.use(pluginStealth());

const proxy = async () => {
    return new Promise(async (resolve, reject) => {
        try {
            const browser = await puppeteer.launch({ headless: false });
            const page = await browser.newPage();
            await page.goto('https://proxyscrape.com/free-proxy-list', { waitUntil: 'networkidle2' });

            const content = await page.content();
            const $ = cheerio.load(content);
            const data = [];

            $('table tbody tr').each((index, element) => {
                const cells = $(element).find('td');
                const type = $(cells[0]).text().trim();
                const ip = $(cells[1]).text().trim();
                const port = $(cells[2]).text().trim();
                if (type.toLowerCase() === 'http') {
                    data.push({ ip, port });
                }
            });

            console.log('Daftar Proxy:', data);
            let allProxiesValid = true;
            for (const proxy of data) {
                const proxyPage = await browser.newPage();
                let proxyValid = false;

                try {
                    // Menggunakan proxy
                    await proxyPage.goto('https://httpbin.org/ip', {
                        waitUntil: 'networkidle2',
                        timeout: 10000
                    });
                    const content = await proxyPage.content();
                    console.log(`Proxy ${proxy.ip}:${proxy.port} berhasil digunakan.`);
                    proxyValid = true;
                } catch (error) {
                    console.log(`Proxy ${proxy.ip}:${proxy.port} gagal digunakan.`, error);
                    proxyValid = false;
                } finally {
                    await proxyPage.close();
                }

                if (!proxyValid) {
                    allProxiesValid = false;
                }
            }

            await browser.close();

            if (allProxiesValid) {
                resolve(data);
            } else {
                reject('Beberapa proxy gagal digunakan.');
            }

        } catch (error) {
            console.error('Error:', error);
            reject(error);
        }
    });
}

module.exports = proxy;
