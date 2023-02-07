import { sendError, createError } from 'h3';
import { H3Event } from 'h3';

export default function handleError(err: any, event: H3Event) {
	const error = createError({
		statusCode: err.status,
		statusMessage: err.status,
		data: err.body,
	});
	sendError(event, error, false);
}
