import twilio from "twilio";
import { createClient } from "@supabase/supabase-js";
import { Lead } from "~/types/types";

export default defineEventHandler(async (event) => {
	const config = useRuntimeConfig();
	const accountSid = config.private.TWILIO_ACCOUNT_SID;
	const authToken = config.private.TWILIO_AUTH_TOKEN;

	const supabase = createClient(
		config.public.SUPABASE_URL,
		config.private.SUPABASE_SERVICE_KEY
	);

	const client = twilio(accountSid, authToken);

	const { message, leadProvider, leadType, otherProvider, otherType, user_id } =
		await useBody(event);

	console.log(message);

	let leads = [] as Lead[];

	let error;

	if (message === null) {
		error = new Error("Message is required");
		console.log(error);
		throw error;
	} else {
		try {
			if (leadProvider === "all") {
				if (leadType === "all") {
					const { data, error } = await supabase
						.from("leads")
						.select("*")
						.eq("user_id", user_id)
						.eq("texted", false);
					if (error) {
						throw error;
					}
					leads = data as Lead[];
				} else {
					const { data, error } = await supabase
						.from("leads")
						.select("*")
						.eq("user_id", user_id)
						.eq("leadType", leadType === "other" ? otherType : leadType)
						.eq("texted", false);

					if (error) {
						throw error;
					}
					leads = data as Lead[];
				}
			} else {
				if (leadType === "all") {
					const { data, error } = await supabase
						.from("leads")
						.select("*")
						.eq("user_id", user_id)
						.eq(
							"leadProvider",
							leadProvider === "other" ? otherProvider : leadProvider
						)
						.eq("texted", false);
					if (error) {
						throw error;
					}
					leads = data as Lead[];
				} else {
					const { data, error } = await supabase
						.from("leads")
						.select("*")
						.eq("user_id", user_id)
						.eq(
							"leadProvider",
							leadProvider === "other" ? otherProvider : leadProvider
						)
						.eq("leadType", leadType === "other" ? otherType : leadType)
						.eq("texted", false);

					if (error) {
						throw error;
					}
					leads = data as Lead[];
				}
			}
		} catch (error) {
			console.log(error);
		}

		leads.forEach((lead) => {
			lead.wireless.forEach(async (phone) => {
				console.log(phone);
				await new Promise(async () =>
					setTimeout(() => {
						console.log("texted");
					}, 1000)
				);

				// const res = await client.messages.create({
				// 	body: message,
				// 	from: config.private.TWILIO_PHONE_NUMBER,
				// 	to: phone,
				// });
				// console.log(res);

				// if (!!res.error_code) {
				await supabase
					.from("leads")
					.update({ texted: false })
					.eq("lead_id", lead.lead_id);
				// }
			});
		});
		return !!error ? { error } : { data: leads };
	}
});
