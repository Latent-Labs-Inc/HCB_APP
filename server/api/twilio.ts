export default defineEventHandler(async (event) => {
	// const query = useQuery(event);
	const config = useRuntimeConfig();

	const message = await useBody(event);

	const twilio = require("twilio");

	const accountSid = config.private.TWILIO_ACCOUNT_SID;
	const authToken = config.private.TWILIO_AUTH_TOKEN;

	const client = new twilio(accountSid, authToken);

	client.messages
		.create({
			body: "Hi there",
			from: config.private.TWILIO_PHONE_NUMBER,
			to: "+18134084221",
		})
		.then((message) => console.log(message.sid));
});
// Download the helper library from https://www.twilio.com/docs/node/install
// Find your Account SID and Auth Token at twilio.com/console
// and set the environment variables. See http://twil.io/secure
