import puppeteer from 'puppeteer-core';
import chromium from 'chrome-aws-lambda';

export default defineEventHandler(async (event) => {
	try {
		const browser = await puppeteer.launch({
			executablePath: process.env.PUPPETEER_EXECUTABLE_PATH,
			headless: true,
		});

		const page = await browser.newPage();
		await page.goto('https://www.google.com');

		// Take a screenshot to verify that the page was loaded correctly
		await page.screenshot({ path: 'screenshot.png' });

		await browser.close();
	} catch (error) {
		console.log(error);
	}
});
