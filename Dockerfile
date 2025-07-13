# ベースイメージの指定（すでにあるはず）
FROM node:19.7.0-slim

# 作業ディレクトリ
WORKDIR /app

# パッケージファイルのコピー
COPY package*.json ./
RUN npm ci

# ソースコードのコピー
COPY . .

# Puppeteer用依存パッケージ
RUN apt-get update -qq && \
    apt-get install --no-install-recommends -y chromium chromium-sandbox && \
    rm -rf /var/lib/apt/lists/*

# 環境変数をDockerfileで直接設定するのは避ける（fly secretsなどで設定）
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium

# 実行コマンドをaccess_rakuten.jsに設定
CMD [ "sh", "-c", "node scripts/access_rakuten.js" ]