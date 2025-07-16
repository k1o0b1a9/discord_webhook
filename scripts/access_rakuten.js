import dotenv from 'dotenv';
dotenv.config();

import fetch from 'node-fetch';
import puppeteer from 'puppeteer';

// .envファイルに MONITOR_URL と MONITOR_LABEL を定義してください

const webhookUrl = process.env.WEBHOOK_URL;
const monitorUrl = process.env.MONITOR_URL;
const label = process.env.MONITOR_LABEL || '未指定';

if (!monitorUrl) {
  console.error('監視対象のURLが .env に設定されていません。');
  process.exit(1);
}

if (!webhookUrl) {
  console.error('DiscordのWebhook URLが .env に設定されていません。');
  process.exit(1);
}

async function checkAndNotify(monitorUrl, label) {
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox']
  });
  const page = await browser.newPage();

  await page.goto(monitorUrl, { waitUntil: 'domcontentloaded', timeout: 60000 });

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

const intervalMinutes = 5;

(async () => {
  while (true) {
    try {
      await checkAndNotify(monitorUrl, label);
    } catch (error) {
      console.error('エラーが発生しました:', error);
    }
    await new Promise(resolve => setTimeout(resolve, intervalMinutes * 60 * 1000));
  }
})();