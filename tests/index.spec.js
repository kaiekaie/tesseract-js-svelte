import { test, expect } from '@playwright/test';

test('basic test', async ({ page }) => {
	await page.goto('localhost:3000');
	const title = page.locator('h1');
	await expect(title).toHaveText('Svelte tesseract.js');
});
