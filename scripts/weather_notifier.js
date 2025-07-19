import dotenv from 'dotenv';
dotenv.config();

import fetch from 'node-fetch';

const webhookUrl = process.env.WEBHOOK_URL;
const latitude = process.env.WEATHER_LAT;
const longitude = process.env.WEATHER_LON;
const city = process.env.WEATHER_CITY || 'Your location';

if (!webhookUrl) {
  console.error('Discord Webhook URL is not defined in .env');
  process.exit(1);
}
if (!latitude || !longitude) {
  console.error('WEATHER_LAT and WEATHER_LON must be defined in .env');
  process.exit(1);
}

async function sendWeather() {
  const apiUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true&timezone=Asia%2FTokyo`;
  const res = await fetch(apiUrl);
  if (!res.ok) {
    throw new Error(`Weather API request failed with status ${res.status}`);
  }
  const data = await res.json();
  const weather = data.current_weather;
  const message = `${city}の現在の気温は${weather.temperature}°C、風速は${weather.windspeed}m/sです。`;

  await fetch(webhookUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ content: message })
  });
}

sendWeather().catch(err => {
  console.error('Error sending weather:', err);
  process.exit(1);
});
