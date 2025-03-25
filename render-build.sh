#!/bin/bash

# Установка браузеров Playwright с зависимостями
npx playwright install chromium --with-deps

# Проверка на наличие установленного браузера
ls -l /opt/render/project/.cache/ms-playwright/chromium/chrome-linux/
