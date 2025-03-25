#!/bin/bash
npx playwright install chromium --with-deps  # Устанавливаем Chromium с зависимостями через npx

# Проверь, установился ли Chromium
ls -l /opt/render/project/.cache/ms-playwright/chromium/chrome-linux/


