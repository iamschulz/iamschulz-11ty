export function formatDate(dateString) {
	return new Date(dateString).toLocaleString("de-DE", {
		dateStyle: "medium",
		timeZone: "Europe/Berlin",
	});
}
