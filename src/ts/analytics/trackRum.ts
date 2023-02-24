import { sendMetric } from "./sendMetric";

export const trackRum = () => {
	const observeLcp = (): Promise<number | null> => {
		return new Promise((resolve) => {
			if (
				!PerformanceObserver.supportedEntryTypes.includes(
					"largest-contentful-paint"
				)
			) {
				resolve(null);
				return;
			}
			const observer = new PerformanceObserver((list) => {
				const entry = list.getEntries()[0];
				observer.disconnect();
				resolve(entry.startTime);
			});
			observer.observe({
				type: "largest-contentful-paint",
				buffered: true,
			});
		});
	};

	const observeCls = (): Promise<number | null> => {
		return new Promise((resolve) => {
			if (
				!PerformanceObserver.supportedEntryTypes.includes(
					"layout-shift"
				)
			) {
				resolve(null);
				return;
			}
			const observer = new PerformanceObserver((list) => {
				let cls = 0;
				for (const entry of list.getEntries()) {
					if (!(entry as any).hadRecentInput) {
						cls += (entry as any).value;
					}
				}
				observer.disconnect();
				resolve(cls);
			});
			observer.observe({ type: "layout-shift", buffered: true });
		});
	};

	const observers = [observeLcp(), observeCls()];
	Promise.all(observers).then((metrics) => {
		console.log({
			url: window.location.pathname,
			lcp: metrics[0],
			cls: metrics[1],
		});
		window.addEventListener("beforeunload", () => {
			sendMetric("rum", {
				url: window.location.pathname,
				lcp: metrics[0],
				cls: metrics[1],
			});
		});
	});
};
