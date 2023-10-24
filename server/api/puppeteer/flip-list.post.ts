import { serverSupabaseServiceRole } from '#supabase/server';
import playwright from 'playwright-aws-lambda';
import { Property } from '~~/types/types';
import { Database } from '~~/types/supabase';

export default defineEventHandler(async (event) => {
	const { apiKey } = (await readBody(event)) as { apiKey: string };
	const { CRON_API_KEY, SERVER_FUNCTIONS_API_KEY } = useRuntimeConfig().private;

	const user_id = event.context.auth.user?.id || null;

	if (apiKey !== CRON_API_KEY && !user_id)
		return { error: 'Unauthorized', data: null };

	const { twilioClient, twilioNumber } = useTwilio();

	let error: any = null;

	try {
		const browser = await playwright.launchChromium({
			headless: true,
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
						emailed: false,
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
			// Wait for the results to show up
			await page.click('text=View Properties');
			await page.waitForSelector('text=Tampa, FL');
			await page.click('text=Tampa, FL');
			await page.waitForSelector('text=Change To Sort View Mode');
			await page.click('text=Change To Sort View Mode');
			await page.waitForSelector(
				'body > div > div.content-wrap > div > main > div.page-header > h1'
			);
			// await page.selectOption('select[name="loc"]', '1592');
			// await page.selectOption('select[name="loc"]', '6537');
			await page.waitForSelector('text=Status');
			await page.selectOption('select[name="status"]', 'available');
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
			await page.click('text=Next');
			await page.waitForSelector(
				'body > div > div.content-wrap > div > main > div.property-list.row.three-column'
			);
		}

		let newProperties: Property[];
		try {
			const { data: dbProperties, error: dbError } = await client
				.from('flip_list')
				.select('*')
				.in(
					'address',
					properties.map((property) => property.address)
				);
			if (dbError) throw dbError;
			if (dbProperties) {
				newProperties = properties.filter(
					(property) =>
						!dbProperties.find(
							(dbProperty) => dbProperty.address === property.address
						)
				);
				properties = properties.map((property) => {
					const dbProperty = dbProperties.find(
						(dbProperty) => dbProperty.address === property.address
					);
					if (dbProperty) {
						return {
							...property,
							emailed: dbProperty.emailed,
						};
					}

					return property;
				});
				try {
					const { error } = await client
						.from('flip_list')
						.insert(newProperties);
					if (error) throw error;
				} catch (e) {
					console.log(e);
					error = e;
				}
			} else {
				// insert the properties that are not in the database
				try {
					const { data, error } = await client
						.from('flip_list')
						.insert(properties);
					if (error) throw error;
				} catch (e) {
					console.log(e);
					error = e;
				}
			}
		} catch (e) {
			console.error(e);
			error = e;
		}

		// filter out all properties that are pending status and texted is false
		let availableProperties = properties.filter(
			(property) => property.status === 'available' && !property.emailed
		);

		let emailedProperties: string[] = [];
		if (availableProperties.length > 0) {
			const emails = availableProperties.map((property) => {
				const subject = `New Property Available at ${property.address}`;
				const message = createMessage(property);
				return {
					id: property.address as string,
					email_to: ['lukelong0421@gmail.com', 'chad@highestcashbuyer.com'],
					subject,
					message,
				};
			});

			emailedProperties = availableProperties.map(
				(property) => property.address
			);

			// now we need to send the emails, create a promise for each one and then use Promise.all to wait for all of them to finish
			const promises = emails.map((email) => useSendEmailNotification(email));

			const results = await Promise.all(promises);

			console.log('Sent all emails via promise');
			results.forEach(async (result, index) => {
				const { error } = result;
				if (error) {
					console.error(`Error at index ${index} - ${error}`);
					try {
						const { error: updateError } = await client
							.from('flip_list')
							.update({ emailed: false })
							.eq('address', emailedProperties[index]);
						if (updateError) throw updateError;
					} catch (e) {
						console.error(e);
					}
				} else {
					try {
						const { error: updateError } = await client
							.from('flip_list')
							.update({ emailed: true })
							.eq('address', emailedProperties[index]);
						if (updateError) throw updateError;
					} catch (e) {
						console.error(e);
					}
				}
			});

			return {
				data: emailedProperties.length ? emailedProperties : 'None Emailed',
				error,
			};
		}

		await browser.close();

		return {
			data: 'None Emailed',
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

const createMessage = (property: Property) => {
	const msg = `There is a new property available at ${property.address}\nLink: ${property.link}\nDetails:\nPrice - ${property.price} ${property.arv}\nStatus: ${property.status}\n${property.bed}\n${property.bath}\n${property.sqft}`;
	return msg;
};
