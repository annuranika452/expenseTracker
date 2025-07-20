/// playwright.config.js
const { defineConfig } = require('@playwright/test');

module.exports = defineConfig({
  testDir: './backend/tests/gui',
  timeout: 10000,
  use: {
    headless: true,
    baseURL: 'http://127.0.0.1:8080', // live-server port
    viewport: { width: 1280, height: 720 }
  },
});

