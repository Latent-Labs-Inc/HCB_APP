import twilio from "twilio";

export default defineEventHandler(async (event) => {
	// const twiml = new twilio.twiml.MessagingResponse();
	// const message = twiml.message("The Robots are coming! Head for the hills!");

	// return message.toString();

	const res = await $fetch("/api/twilio", {
		method: "POST",
		body: JSON.stringify({
			message: "We have received your message and will get back shortly",
		}),
	});
	if (!!res) {
		return res;
	} else {
		return { error: "Failed to send message" };
	}
});
