#!/bin/bash

# Установка пути для хранения браузеров
export PLAYWRIGHT_BROWSERS_PATH=/opt/render/project/.cache/ms-playwright

# Установка браузеров Playwright с зависимостями
npx playwright install chromium --with-deps

# Проверка на наличие браузера
ls -l /opt/render/project/.cache/ms-playwright/chromium/chrome-linux/
