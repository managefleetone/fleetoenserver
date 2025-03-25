#!/usr/bin/env bash

# Установка npm-зависимостей
npm install

# Установка Playwright браузеров локально (вместо глобального пути)
npx playwright install chromium
