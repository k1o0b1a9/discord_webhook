

# Discord Webhook Monitor

Rakutenサイトの特定ページを監視し、条件を満たすとDiscord Webhookに通知するスクリプトです。

## 使用技術

- Node.js
- Puppeteer
- dotenv

## セットアップ手順

1. 依存パッケージのインストール：

```bash
npm install
```

2. `.env` ファイルの作成：

```env
MONITOR_URL=https://対象のURL
WEBHOOK_URL=https://discord.com/api/webhooks/xxxxxxxxx/xxxxxxxxx
```

3. Chromeのインストール（Puppeteer用）：

```bash
npx puppeteer browsers install chrome
```

## 実行方法

### 通常実行

```bash
node scripts/access_rakuten.js
```

### バックグラウンドで実行（ログは monitor.log に出力）

```bash
nohup node scripts/access_rakuten.js > monitor.log 2>&1 &
```

## トラブルシューティング

- Raspberry PiなどARM環境では、Puppeteer用Chromeのバイナリが対応していない可能性があります。
- `chrome` 実行時のエラーが出る場合は、対応するChromeバイナリを手動でインストールするか、x86環境での実行を検討してください。