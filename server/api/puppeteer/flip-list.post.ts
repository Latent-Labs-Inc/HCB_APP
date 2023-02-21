import { serverSupabaseServiceRole } from '#supabase/server';
import puppeteer from 'puppeteer-core';
import chromium from 'chrome-aws-lambda';
import { Property } from '~~/types/types';
import { Database } from '~~/types/supabase';

export default defineEventHandler(async (event) => {
	const { apiKey } = (await readBody(event)) as { apiKey: string };
	const { CRON_API_KEY, CHROME_EXECUTABLE_PATH } = useRuntimeConfig().private;
	if (apiKey !== CRON_API_KEY) return { error: 'Unauthorized', data: null };

	const { twilioClient, twilioNumber } = useTwilio();

	let error: any = null;
	let browser = null;

	try {
		browser = await puppeteer.launch({
			args: chromium.args,
			executablePath: (await chromium.executablePath) || CHROME_EXECUTABLE_PATH,
			headless: true,
			ignoreHTTPSErrors: true,
		});

		const page = await browser.newPage();
		const client = serverSupabaseServiceRole<Database>(event);

		await page.goto('https://www.fliplist.com/');

		// create function to evaluate properties on the page
		const evaluateProperties = async () => {
			return await page.evaluate(() => {
				const properties = document.querySelectorAll('.property');

				let props = Array.from(properties).map((property) => {
					return {
						address:
							property.querySelector('.property-title.card-title')
								?.textContent || '',
						price: property.querySelector('.lead')?.textContent || '',
						link: property.querySelector('a')?.href || '',
						bed:
							property.querySelector('a > div > ul > li:nth-child(2)')
								?.textContent || '',
						bath:
							property.querySelector('a > div > ul > li:nth-child(3)')
								?.textContent || '',
						sqft:
							property.querySelector('a > div > ul > li:nth-child(4)')
								?.textContent || '',
						status:
							property.querySelector('a > div > span.badge')?.textContent ||
							'available',
						texted: false,
						created_at: new Date().toISOString(),
						modified_at: new Date().toISOString(),
					};
				});
				props = props.filter((property) => {
					return (
						property.address !== '' &&
						property.price !== '' &&
						property.link !== '' &&
						property.bed !== '' &&
						property.bath !== '' &&
						property.sqft !== '' &&
						property.status !== ''
					);
				});

				return props.map((property) => {
					let regExp = /\(([^)]+)\)/;
					let arv = property.address.match(regExp)
						? property.address.match(regExp)![1]
						: '';
					let address = property.address.replace(`(${arv})`, '').trim();
					property.address = address;
					property.status = property.status.toLowerCase();
					let formattedProperty = { ...property, arv: arv };
					return formattedProperty;
				});
			});
		};

		const setFilters = async () => {
			await page.waitForSelector('text/properties');
			// await page.select('select[name="loc"]', '1592');
			await page.select('select[name="loc"]', '6537');
			await page.waitForSelector('text/Status');
			await page.select('select[name="status"]', 'available');
			await page.waitForSelector(
				'body > div > div.content-wrap > div > main > div.property-list.row.three-column'
			);
		};

		// Wait for the results to show up
		await page.click('text/View Properties');
		await page.waitForSelector('text/Tampa, FL');
		await page.click('text/Tampa, FL');
		await page.waitForSelector('text/Change To Sort View Mode');
		await page.click('text/Change To Sort View Mode');

		let properties: Property[] = [];

		// evaluate the properties on each page and push the results to the properties array
		await setFilters();

		while (true) {
			let pageProperties = await evaluateProperties();
			properties = [...properties, ...pageProperties];
			if (pageProperties.length < 15) break;
			await page.click('text/Next');
			await page.waitForSelector(
				'body > div > div.content-wrap > div > main > div.property-list.row.three-column'
			);
		}

		// will want to check to see if the properties are already in the database
		// if they are not in the database then we will want to insert them into the database
		try {
			const { data: dbProperties, error: dbError } = await client
				.from('flip_list')
				.select('*')
				.in(
					'address',
					properties.map((property) => property.address)
				);
			if (error) throw error;
			// update the properties in the properties array to have the texted property from the one in the database
			if (dbProperties) {
				properties = properties.map((property) => {
					const dbProperty = dbProperties.find(
						(dbProperty) => dbProperty.address === property.address
					);
					if (dbProperty) {
						// we will leave the status from the website listing but change the texted property to the one from the database
						return {
							...property,
							texted: dbProperty.texted,
						};
					}
					// if the property is not in the database then we will just return the property
					return property;
				});
			}
		} catch (e) {
			console.error(e);
			error = e;
		}

		// insert the properties into the database
		try {
			const { data, error } = await client.from('flip_list').insert(properties);
			if (error) throw error;
		} catch (e) {
			console.log(e);
			error = e;
		}

		// filter out all properties that are pending status and texted is false
		let availableProperties = properties.filter(
			(property) => property.status === 'available' && !property.texted
		);

		let textedProperties: string[] = [];
		// if there are any properties that are available and have not been texted then we will want to text them
		if (availableProperties.length > 0) {
			availableProperties.forEach(async (property) => {
				try {
					let body = `There is a new property available at ${property.address}\nLink: ${property.link}\nDetails:\nPrice - ${property.price} ${property.arv}\nStatus: ${property.status}\n${property.bed}\n${property.bath}\n${property.sqft}`;
					const res = await twilioClient.messages.create({
						body,
						from: twilioNumber,
						to: '+18134750728',
					});
					if (res.errorMessage) throw res.errorMessage;
					const res2 = await twilioClient.messages.create({
						body,
						from: twilioNumber,
						to: '+18134084221',
					});
					if (res2.errorMessage) throw res2.errorMessage;
				} catch (e) {
					console.log(e);
					error = e;
				} finally {
					try {
						textedProperties.push(property.address);
						// update the database to have the texted property set to true
						const { error } = await client
							.from('flip_list')
							.update({ texted: true })
							.eq('address', property.address);
						if (error) throw error;
					} catch (e) {
						console.log(e);
						error = e;
					}
				}
			});
			return {
				data: textedProperties.length ? textedProperties : 'None Texted',
				error,
			};
		}

		await browser.close();

		return {
			data: 'None Texted',
			error,
		};
	} catch (e) {
		console.log(e);
		return {
			data: null,
			error: { e, error },
		};
	}
});
