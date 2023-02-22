import axios from 'axios';
import dotenv from 'dotenv';

const main = async () => {
	// 0. Load environment variables
	dotenv.config();
	const { API_KEY: apiKey } = process.env;
	console.log('Running cron job');
	let appUrl = 'https://app.highestcashbuyer.com/api/public/flip-list-cron';
	try {
		const response = await axios.post(
			appUrl,
			{
				apiKey,
			},
			{
				method: 'POST',
			}
		);
		console.log('data', response.data.data);
		console.log('error', response.data.error);
	} catch (error) {
		console.log(error);
	}
};

main();
