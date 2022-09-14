import twilio from "twilio";
import { createClient } from "@supabase/supabase-js";
import { Lead, Message } from "../../types/types";

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

	const sentMessages = [] as Message[];

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
						.eq("texted", false)
						.range(0, 10);
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
						.eq("texted", false)
						.range(0, 100);

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
						.eq("texted", false)
						.range(0, 100);
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
						.eq("texted", false)
						.range(0, 100);

					if (error) {
						throw error;
					}
					leads = data as Lead[];
				}
			}
		} catch (error) {
			console.log(error);
		}
		const badNumbers = [];
		try {
			const { data, error: badNumbersError } = await supabase
				.from("bad_numbers")
				.select("*")
				.eq("user_id", user_id);

			if (badNumbersError) {
				throw badNumbersError;
			}
			data.forEach((badNumber) => {
				badNumbers.push(badNumber.number);
			});
		} catch (error) {
			console.log(error);
		}

		leads.forEach(async (lead) => {
			lead.wireless.forEach(async (phone) => {
				if (!badNumbers.includes(phone)) {
					try {
						const res = await client.messages.create({
							body: message,
							from: config.private.TWILIO_PHONE_NUMBER,
							to: phone,
						});

						console.log(res);
						if (!!res.errorMessage) {
							throw res.errorMessage;
						}

						let sentMessage: Message = {
							lead_id: lead.lead_id,
							user_id: user_id,
							message,
							to: phone,
							from: config.private.TWILIO_PHONE_NUMBER,
							sid: res.sid,
							status: res.status,
							created_at: res.dateCreated,
							sent_at: res.dateSent,
							updated_at: res.dateUpdated,
							direction: res.direction,
							errorCode: res.errorCode,
							errorMessage: res.errorMessage,
							propertyAddress: lead.propertyAddress,
						};
						sentMessages.push(sentMessage);
						try {
							const { error } = await supabase
								.from("leads")
								.update({ texted: true })
								.eq("lead_id", lead?.lead_id);
							const { error: err, data } = await supabase
								.from("sent_messages")
								.insert(sentMessage);
							await supabase
								.from("bad_numbers")
								.insert({ number: phone, user_id: user_id });

							if (error || err) {
								throw error || err;
							}
						} catch (error) {
							console.log(error);
						}
					} catch (error) {
						console.log(error);
					}
				}
			});
		});

		return { data: sentMessages };
	}
});
