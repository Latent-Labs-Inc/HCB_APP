import puppeteer from 'puppeteer-core';
import chromium from 'chrome-aws-lambda';

export default defineEventHandler(async (event) => {
	try {
		const browser = await puppeteer.launch({
			executablePath: (await chromium.executablePath) || '/usr/bin/chromium',
			args: chromium.args,
			defaultViewport: chromium.defaultViewport,
			headless: chromium.headless,
		});

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
			error: error,
			data: null,
		};
	}
});
