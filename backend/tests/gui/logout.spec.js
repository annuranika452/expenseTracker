// backend/tests/gui/logout.spec.js
const { test, expect } = require('@playwright/test');

test('Logout clears token and redirects', async ({ page }) => {
  // Simulate logged-in state
  await page.goto('http://127.0.0.1:8080/index.html');
  await page.evaluate(() => localStorage.setItem('token', 'fake-token'));

  // Reload and click logout
  await page.reload();
  await page.click('#logout-btn');

  // Wait for redirect
  await expect(page).toHaveURL(/login\.html/);
});
