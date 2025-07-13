import fetch from 'node-fetch';
import puppeteer from 'puppeteer';

const inputUrl = process.argv[2];
if (!inputUrl) {
  console.error('監視するURLを指定してください。');
  process.exit(1);
}


const url = inputUrl;
const webhookUrl = 'https://discord.com/api/webhooks/1393877281960890528/ufoPpN4_y_8E57IuCWFw5C3HLqPLV4gGOghvhDviFNyfkBEphmCtjU6XDBAWj7Ma3Tc0';

async function checkAndNotify() {
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();

  await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 60000 });

  const exists = await page.$('form[action$="/rms/mall/book/bs/Cart"]');

  if (exists) {
    const timestamp = new Date().toLocaleString('ja-JP', { timeZone: 'Asia/Tokyo' });
    await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content: `ボタンが表示されました (${timestamp})` })
    });
  }

  await browser.close();
}

setInterval(checkAndNotify, 5 * 60 * 1000); // 5分ごとに実行
checkAndNotify(); // 起動時にも一度実行∂