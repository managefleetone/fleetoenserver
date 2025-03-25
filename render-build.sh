#!/bin/bash

# Устанавливаем браузер с зависимостями, используя Playwright
npx playwright install chromium --with-deps

# Проверка на наличие установленного браузера
ls -l /opt/render/project/.cache/ms-playwright/chromium/chrome-linux/
