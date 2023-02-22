import puppeteer from 'puppeteer-core';
import playwright from 'playwright-core';
import chromium from 'chrome-aws-lambda';

export default defineEventHandler(async (event) => {
	try {
		const browser = await playwright.chromium.launch();

		const page = await browser.newPage();
		await page.goto('https://www.google.com');

		await browser.close();
		return {
			error: null,
			data: 'success',
		};
	} catch (error) {
		console.log(error);

		return {
			error: { error, message: 'Error ocurred trying to run puppeteer' },
			data: null,
		};
	}
});
