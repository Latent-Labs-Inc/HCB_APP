import twilio from "twilio";

export default defineEventHandler(async (event) => {
	// const query = useQuery(event);
	const config = useRuntimeConfig();

	const { message } = await useBody(event);
	console.log(message);
	const accountSid = config.private.TWILIO_ACCOUNT_SID;
	const authToken = config.private.TWILIO_AUTH_TOKEN;

	const client = twilio(accountSid, authToken);

	const res = await client.messages.create({
		body: !!message ? message : "Hello from Twilio!",
		from: config.private.TWILIO_PHONE_NUMBER,
		to: "+18134084221",
	});
	console.log(res.sid);
	return res.sid;
});
// Download the helper library from https://www.twilio.com/docs/node/install
// Find your Account SID and Auth Token at twilio.com/console
// and set the environment variables. See http://twil.io/secure
