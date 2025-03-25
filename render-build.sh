#!/usr/bin/env bash

# Установка необходимых системных библиотек
apt-get update && apt-get install -y \
  libnss3 \
  libatk1.0 \
  libatk-bridge2.0 \
  libgtk-3-0 \
  libasound2 \
  libxcomposite1 \
  libxdamage1 \
  libxrandr2 \
  libgbm1

# Установка Node.js-зависимостей и браузеров Playwright
echo "Installing dependencies..."
npm install
echo "Installing Playwright browsers..."
npx playwright install --with-deps chromium
