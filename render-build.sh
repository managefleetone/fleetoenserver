#!/bin/bash

# Установка всех зависимостей проекта
npm install

# Просто проверка наличия папки с браузером, специфичной для @sparticuz/chromium
ls -l /opt/render/project/node_modules/@sparticuz/chromium/
