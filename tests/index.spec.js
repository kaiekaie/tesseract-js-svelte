import { test, expect } from '@playwright/test';

test('basic test', async ({ page }) => {
	await page.goto('localhost:9999');
	const title = page.locator('h1');
	await expect(title).toHaveText('Svelte tesseract.js');
});

test('find data', async ({ page }) => {
	// Go to http://localhost:9999/
	await page.goto('http://localhost:9999/');

	// Click [placeholder="Select file"]
	await page.locator('[placeholder="Select file"]').click();
	// Upload PNG-bilde 2.png
	await page.locator('[placeholder="Select file"]').setInputFiles('./tests/PNG-bilde 2.png');
	// Click text=Get Text
	await page.locator('text=Get All Text').click();
	// Click text=Tilbake
	await page.locator('text=Tilbake');
	await page.locator('text=Electric');
	await page.locator('text=Version');
});
