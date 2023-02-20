import { sendError } from 'h3';
import { serverSupabaseUser } from '#supabase/server';

export default defineEventHandler(async (event) => {
	const clientSideRoutes = !event.path?.startsWith('/api');
	const user = await serverSupabaseUser(event);
	const allowedRoutes = [
		'/api/public/twilio-incoming',
		'/api/public/twilio-status-update',
		'/api/public/flip-list-cron',
		'/api/incoming-message',
		'/api/status-update',
	];

	if (clientSideRoutes || event.path?.includes('_supabase')) {
		return;
	} else if (!user && !allowedRoutes.includes(event.path!)) {
		sendError(event, new Error('Unathorized'));
	}
	// this will pass the user object to the event if there is a user
	event.context.auth = {
		authenticated: true,
		user,
	};
});
