import twilio from "twilio";
import { createClient } from "@supabase/supabase-js";

export default defineEventHandler(async (event) => {
	const config = useRuntimeConfig();
	const accountSid = config.private.TWILIO_ACCOUNT_SID;
	const authToken = config.private.TWILIO_AUTH_TOKEN;

	const supabase = createClient(
		config.public.SUPABASE_URL,
		config.private.SUPABASE_SERVICE_KEY
	);

	const client = twilio(accountSid, authToken);

	const { message, to } = await useBody(event);

	try {
		const res = await client.messages.create({
			body: message,
			from: config.private.TWILIO_PHONE_NUMBER,
			to: to,
		});
		console.log(res);
		if (!!res.errorMessage) {
			throw res.errorMessage;
		}
	} catch (error) {
		console.log(error);
	}
});
