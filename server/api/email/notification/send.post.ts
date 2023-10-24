export default defineEventHandler(async (event) => {
	console.log('Sending email notifications');
	try {
		const body = (await readBody(event)) as {
			apiKey?: string;
			emails: {
				email_to: string | string[];
				subject: string;
				message: string;
			}[];
		};

		const { apiKey, emails } = body;

		const { SERVER_FUNCTIONS_API_KEY } = useRuntimeConfig().private;

		// check if there is a user and if not then check if there is an api key
		if (
			!event.context.auth?.user &&
			(!apiKey || apiKey !== SERVER_FUNCTIONS_API_KEY)
		) {
			sendError(event, new Error('No user or invalid api key'));
		}

		console.log('Sending email notifications', emails);

		// now we need to send the emails, create a promise for each one and then use Promise.all to wait for all of them to finish
		const promises = emails.map((email) => useSendEmailNotification(email));

		const results = await Promise.all(promises);
		console.log('Sent all emails via promise');

		// now based on the results we want to update the email_notifications table
		results.forEach((result, index) => {
			const { error } = result;
			if (error) {
				console.error(`Error at index ${index} - ${error}`);
			}
		});

		return { data: null };
	} catch (error) {
		console.error(error);
		return { data: null, error };
	}
});
