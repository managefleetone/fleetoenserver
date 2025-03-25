#!/usr/bin/env bash

# Установка зависимостей и ручная установка Chromium в нужное место
apt-get update && apt-get install -y libnss3 libatk1.0 libatk-bridge2.0 libgtk-3-0 libasound2 libxcomposite1 libxdamage1 libxrandr2 libgbm1

# Установка Playwright браузеров в кастомный путь
npx playwright install --with-deps chromium

