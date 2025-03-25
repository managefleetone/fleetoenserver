#!/bin/bash

# Установка всех зависимостей проекта
npm install

# Установка браузеров Playwright с зависимостями
npx playwright install chromium --with-deps

# Проверка наличия установленного браузера
ls -l /opt/render/project/.cache/ms-playwright/chromium/chrome-linux/
