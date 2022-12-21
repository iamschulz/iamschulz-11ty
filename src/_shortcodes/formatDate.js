module.exports = function date(dateString) {
	return new Date(dateString).toLocaleString("de-DE", {
		dateStyle: "medium",
		timeZone: "Europe/Berlin"
	});
};
