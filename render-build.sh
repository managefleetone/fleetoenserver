#!/usr/bin/env bash

# Установка недостающих библиотек для Playwright
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

# Установка Node.js зависимостей и браузеров Playwright
npm install
npx playwright install chromium
