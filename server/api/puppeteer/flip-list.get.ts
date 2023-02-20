import { serverSupabaseClient } from '#supabase/server';
import puppeteer from 'puppeteer';
import { Property } from '~~/types/types';
import { Database } from '~~/types/supabase';

export default defineEventHandler(async (event) => {
	const { twilioClient, twilioNumber } = useTwilio();
	const browser = await puppeteer.launch({
		headless: false,
		defaultViewport: {
			width: 1080,
			height: 720,
		},
	});
	const page = await browser.newPage();

	const user_id = event.context.auth.user.id as string;

	const client = serverSupabaseClient<Database>(event);

	await page.goto('https://www.fliplist.com/');

	// create function to evaluate properties on the page
	const evaluateProperties = async () => {
		return await page.evaluate(() => {
			const properties = document.querySelectorAll('.property');
			return Array.from(properties).map((property) => {
				return {
					address:
						property.querySelector('.property-title.card-title')?.textContent ||
						'',
					price: property.querySelector('.lead')?.textContent || '',
					link: property.querySelector('a')?.href || '',
					bedrooms:
						property.querySelector('a > div > ul > li:nth-child(2)')
							?.textContent || '',
					bathrooms:
						property.querySelector('a > div > ul > li:nth-child(3)')
							?.textContent || '',
					sqft:
						property.querySelector('a > div > ul > li:nth-child(4)')
							?.textContent || '',
					status:
						property.querySelector('a > div > span.badge')?.textContent ||
						'available' ||
						'',
				};
			});
		});
	};

	try {
		// Wait for the results to show up
		await page.click('text/View Properties');
		await page.waitForSelector('text/Tampa, FL');
		await page.click('text/Tampa, FL');
		await page.waitForSelector('text/Change To Sort View Mode');
		await page.click('text/Change To Sort View Mode');

		const setFilters = async () => {
			await page.waitForSelector('text/properties');
			await page.select('select[name="loc"]', '1592');
			await page.waitForSelector('text/Status');
			await page.select('select[name="status"]', 'available');
			await page.waitForSelector(
				'body > div > div.content-wrap > div > main > div.property-list.row.three-column'
			);
		};
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
		// check to make sure there are no blanks in the array
		const checkedProperties = properties.filter((property) => {
			return (
				property.address !== '' &&
				property.price !== '' &&
				property.link !== '' &&
				property.bedrooms !== '' &&
				property.bathrooms !== '' &&
				property.sqft !== '' &&
				property.status !== ''
			);
		});

		// we will format the properties to match the supabase schema
		const formattedProperties = checkedProperties.map((property) => {
			var regExp = /\(([^)]+)\)/;
			let arv = property.address.match(regExp)
				? property.address.match(regExp)![1]
				: '';
			let address = property.address.replace(`(${arv})`, '').trim();
			return {
				user_id,
				address,
				id: useUuid(),
				arv,
				price: property.price,
				link: property.link,
				bed: property.bedrooms,
				bath: property.bathrooms,
				sqft: property.sqft,
				status: property.status,
				created_at: new Date().toISOString(),
				modified_at: new Date().toISOString(),
			};
		});

		// filter the properties into an array to find the available ones
		const availableProperties = formattedProperties.filter((property) => {
			return property.status === 'available';
		});

		// if there is an available property, send a text message
		if (availableProperties.length > 0) {
			availableProperties.forEach(async (property) => {
				try {
					let { messagingServiceSid, errorMessage } =
						await twilioClient.messages.create({
							from: twilioNumber,
							to: '+18134084221',
							body: `There is a new property available at ${property.address}\nLink:${property.link}\nDetails:\nPrice - ${property.price} ${property.arv}\nStatus: ${property.status}\n${property.bed} Bed\n${property.bath} Bath\n${property.sqft} sqft\n`,
						});
					if (errorMessage) throw errorMessage;
				} catch (e) {
					console.log(error);
				}
			});
		}

		// might not need to even push to supabase if we are just going to use the data to send a text message, we would only check the if the property is pending or available
		// now we will push these to supabase to store them in the database
		const { data, error } = await client
			.from('flip_list')
			.upsert(formattedProperties);
		if (error) throw error;
		console.log(formattedProperties.length);
	} catch (e) {
		console.error(e);
	} finally {
		// browser.close();
	}

	return {
		data: null,
		error: null,
	};
});
