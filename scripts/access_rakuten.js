import fetch from 'node-fetch';
import puppeteer from 'puppeteer';

const url = process.env.MONITOR_URL;
if (!url) {
  console.error('MONITOR_URL 環境変数が設定されていません。');
  process.exit(1);
}
const webhookUrl = process.env.DISCORD_WEBHOOK;
if (!webhookUrl) {
  console.error('DISCORD_WEBHOOK 環境変数が設定されていません。');
  process.exit(1);
}

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