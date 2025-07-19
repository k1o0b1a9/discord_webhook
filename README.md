# Discord Webhook Utilities

This repository contains Node.js scripts that send notifications to Discord using webhooks.

## Scripts
- `scripts/access_rakuten.js`: Monitors a Rakuten page and notifies when a specific button appears.
- `scripts/weather_notifier.js`: Sends the current weather for a specified location.

## Setup

1. Install dependencies:

```bash
npm install
```

2. Create a `.env` file:

```env
WEBHOOK_URL=https://discord.com/api/webhooks/xxxxxxxxx/xxxxxxxxx
MONITOR_URL=https://example.com
MONITOR_LABEL=Example
WEATHER_LAT=35.68
WEATHER_LON=139.76
WEATHER_CITY=Tokyo
```

3. Install Chrome for Puppeteer:

```bash
npx puppeteer browsers install chrome
```

## Usage

### Monitor Rakuten page

```bash
node scripts/access_rakuten.js
```

Run in background:

```bash
nohup node scripts/access_rakuten.js > monitor.log 2>&1 &
```

### Send weather notification

```bash
node scripts/weather_notifier.js
```

You can schedule this with cron for daily updates.

## Troubleshooting

- On ARM environments like Raspberry Pi, the Puppeteer Chrome binary may not be available.
- If `chrome` fails to start, install a compatible Chrome manually or consider using an x86 environment.
