import fetch from 'node-fetch';
import puppeteer from 'puppeteer';

const urls = Object.entries(process.env)
  .filter(([key]) => key.startsWith('MONITOR_URL_'))
  .map(([key, value]) => {
    const index = key.split('_').pop();
    return {
      url: value,
      label: process.env[`URL_LABEL_${index}`] || `未指定${index}`
    };
  });

if (urls.length === 0) {
  console.error('MONITOR_URL_* 環境変数が設定されていません。');
  process.exit(1);
}

const webhookUrl = process.env.DISCORD_WEBHOOK;
if (!webhookUrl) {
  console.error('DISCORD_WEBHOOK 環境変数が設定されていません。');
  process.exit(1);
}

async function checkAndNotify(url, label) {
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox']
  });
  const page = await browser.newPage();

  await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 60000 });

  const exists = await page.$('form[action$="/rms/mall/book/bs/Cart"]');

  if (exists) {
    const timestamp = new Date().toLocaleString('ja-JP', { timeZone: 'Asia/Tokyo' });
    await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content: `[${label}] ボタンが表示されました (${timestamp})` })
    });
  }

  await browser.close();
}

for (const { url, label } of urls) {
  await checkAndNotify(url, label);
  await new Promise(res => setTimeout(res, 5000));
}