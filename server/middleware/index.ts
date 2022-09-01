export default defineEventHandler((event) => {
	console.log("New request: " + event.req.url);
	if (event.req.url.includes("/api/changeAuth")) {
		console.log("changeAuth");
	}
});
