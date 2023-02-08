import { sendMetric } from "./sendMetric";

export const trackHit = () => {
	window.addEventListener("beforeunload", () => {
		sendMetric("hit", {
			url: window.location.href,
			referrer: document.referrer
				? new URL(document.referrer).pathname
				: null,
			visit: "/",
		});
	});
};
