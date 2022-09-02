export default defineEventHandler(async (event) => {
	// const query = useQuery(event);
	const subscriber = await useBody(event);

	const client = require("twilio")(accountSid, authToken);

	client.messages
		.create({ body: "Hi there", from: "+15017122661", to: "+15558675310" })
		.then((message) => console.log(message.sid));
});
// Download the helper library from https://www.twilio.com/docs/node/install
// Find your Account SID and Auth Token at twilio.com/console
// and set the environment variables. See http://twil.io/secure
