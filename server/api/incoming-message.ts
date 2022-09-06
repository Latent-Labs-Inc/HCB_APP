import { IncomingMessage, TwilioIncoming } from "~/types/types";
import twilio from "twilio";
import { createClient } from "@supabase/supabase-js";

export default defineEventHandler(async (event) => {
	const config = useRuntimeConfig();

	const supabase = createClient(
		config.public.SUPABASE_URL,
		config.private.SUPABASE_SERVICE_KEY
	);

	const body: TwilioIncoming = await useBody(event);

	try {
		let user_id;
		try {
			const { data } = await supabase
				.from("profiles")
				.select("*")
				.contains("phoneNumbers", [body.to]);
			user_id = data[0].user_id;
		} catch (error) {
			console.log(error);
		}

		// will need to clean this up to use user_id's if making public app
		const { data: lead_ids, error: err } = await supabase
			.from("leads")
			.select("lead_id")
			.contains("wireless", [body.from]);

		let incoming_message: IncomingMessage = {
			user_id: user_id,
			message: body.body,
			from: body.from,
			to: body.to,
			sid: body.sid,
			created_at: body.date_created,
			sent_at: body.date_sent,
			updated_at: body.date_updated,
			status: body.status,
			direction: body.direction,
			error_code: body.error_code,
			error_message: body.error_message,
			lead_id: lead_ids[0].lead_id,
		};

		const { error } = await supabase
			.from("incoming_messages")
			.insert(incoming_message);

		if (error || err) {
			throw error || err;
		}
	} catch (error) {
		console.log(error);
	}

	// perform logic based on what the event is (e.g. message sent, message received, etc.)

	const { MessagingResponse } = twilio.twiml;

	const twiml = new MessagingResponse();

	twiml.message("Thank you for your reply we will get back to you shortly");

	return twiml.toString();
});
