import { sendMetric } from "./sendMetric";

export const trackHit = () => {
	window.addEventListener("beforeunload", () => {
		sendMetric("hit", {
			url: window.location.pathname,
			referrer: document.referrer
				? new URL(document.referrer).hostname
				: null,
			visit: "/",
		});
	});
};
