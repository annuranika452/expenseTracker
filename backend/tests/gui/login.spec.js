// backend/tests/gui/login.spec.js
const { test, expect } = require('@playwright/test');

test('Login page - successful login', async ({ page }) => {
  await page.goto('/login.html');

  await page.fill('#email', 'tester@example.com');
  await page.fill('#password', 'testpass123');
  await page.click('#login-button');

  await expect(page).toHaveURL(/.*index\.html/); // expect redirect
});
