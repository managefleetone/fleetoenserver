#!/usr/bin/env bash

# Установка npm-зависимостей
npm install

# Загрузка браузеров Playwright в кэш Render без использования root-доступа
echo "Installing Playwright browsers in user space..."
npx playwright install chromium

