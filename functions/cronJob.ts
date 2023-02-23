import axios from 'axios';
import dotenv from 'dotenv';
import nodeCron from 'node-cron';
import { Handler, HandlerEvent, HandlerContext } from '@netlify/functions';

const handler: Handler = async (event, context) => {
	try {
		// 1. Schedule cron job for every 15 minutes
		nodeCron.schedule('*/15 * * * *', () => {
			console.log('Cron job ran at ' + new Date().toLocaleString());
			// 2. Call API
			dotenv.config();
			const { CRON_API_KEY: apiKey } = process.env;
			console.log('apiKey', apiKey);
			let appUrl = 'https://app.highestcashbuyer.com/api/public/flip-list-cron';

			const response = axios.post(
				appUrl,
				{
					apiKey,
				},
				{
					method: 'POST',
					timeout: 30000,
				}
			);
			return {
				statusCode: 200,
				body: JSON.stringify('Cron job ran successfully'),
			};
		});
	} catch (error) {
		console.log(error);
		return {
			statusCode: 500,
			body: JSON.stringify(error),
		};
	} finally {
		return {
			statusCode: 200,
			body: JSON.stringify('Cron job ran successfully'),
		};
	}
};

export { handler };
