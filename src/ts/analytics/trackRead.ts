import { sendMetric } from "./sendMetric";

export const trackRead = (triggerEl: Element) => {
	const observer = new IntersectionObserver((entries) => {
		entries.forEach((entry) => {
			if (entry.isIntersecting) {
				observer.unobserve(triggerEl);

				window.addEventListener("beforeunload", () => {
					sendMetric("read", {
						url: window.location.href,
					});
				});
			}
		});
	});

	observer.observe(triggerEl);
};
