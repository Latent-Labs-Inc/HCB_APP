// import { Handler } from '@netlify/functions';
// import { createClient } from '@supabase/supabase-js';
// import axios from 'axios';
// import * as dotenv from 'dotenv';
// import { Database } from '~~/types/supabase';

// dotenv.config();

// const { SUPABASE_URL, SUPABASE_KEY, SERVER_FUNCTIONS_API_KEY, BASE_URL } =
// 	process.env;

// const checkEnvVariables = () => {
// 	const requiredVars = [
// 		'SUPABASE_URL',
// 		'SUPABASE_KEY',
// 		'SERVER_FUNCTIONS_API_KEY',
// 		'BASE_URL',
// 	];
// 	for (const variable of requiredVars) {
// 		if (!process.env[variable]) {
// 			console.error(`Missing environment variable: ${variable}`);
// 			throw new Error(`Missing environment variable: ${variable}`);
// 		}
// 	}
// };

// const handler: Handler = async (event, context) => {
// 	try {
// 		console.log('Cron job starting at ' + new Date().toLocaleString());

// 		checkEnvVariables();

// 		const supabase = createClient<Database>(SUPABASE_URL!, SUPABASE_KEY!, {
// 			auth: {
// 				persistSession: false,
// 			},
// 		});

// 		const emails = [
// 			{
// 				email_to: ['lukelong0421@gmail.com', 'chad@highestcashbuyer.com'],
// 				subject: 'Cron Job Ran',
// 				message: 'Cron job ran at ' + new Date().toLocaleString(),
// 			},
// 		];

// 		const url = BASE_URL! + '/api/email/notification/send';
// 		console.log('URL: ' + url);
// 		// send the email to the server endpoint
// 		const res = await axios.post(url, {
// 			apiKey: SERVER_FUNCTIONS_API_KEY,
// 			emails,
// 		});

// 		const { error } = res.data;

// 		if (error) throw error;

// 		return {
// 			statusCode: 200,
// 			body: JSON.stringify({ message: 'Cron job ran successfully' }),
// 		};
// 	} catch (error) {
// 		console.error(error);
// 		return { statusCode: 500, body: JSON.stringify({ error }) };
// 	}
// };

// export { handler };
