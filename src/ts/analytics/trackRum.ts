import { sendMetric } from "./sendMetric";

export const trackRum = () => {
	let lcp: number | null = null;
	new PerformanceObserver((entryList) => {
		for (const entry of entryList.getEntries()) {
			lcp = entry.startTime;
		}
	}).observe({ type: "largest-contentful-paint", buffered: true });

	let cls = 0;
	new PerformanceObserver((entryList) => {
		for (const entry of entryList.getEntries()) {
			if (!(entry as any).hadRecentInput) {
				cls += (entry as any).value;
			}
		}
	}).observe({ type: "layout-shift", buffered: true });

	window.addEventListener("beforeunload", () => {
		sendMetric("rum", {
			url: location.pathname,
			lcp: lcp,
			cls: cls,
			scripts_done: 0,
		});
	});
};
