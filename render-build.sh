#!/bin/bash

# Установка только браузера с помощью playwright
npx playwright install chromium --with-deps

# Проверка на наличие браузера
ls -l /opt/render/project/.cache/ms-playwright/chromium/chrome-linux/
