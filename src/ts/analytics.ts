import { init, track, trackPages, parameters } from "insights-js";

export class Analytics {
	readTrigger: HTMLElement | null;

	constructor() {
		if (!process.env.INSIGHTS_KEY) {
			return;
		}
		init(process.env.INSIGHTS_KEY);

		// page views
		trackPages();

		// read articles
		this.registerReadTriggers();
		this.trackRead();

		//performance
		this.trackPerformance();

		//referrers
		this.trackReferrers();
	}

	registerReadTriggers() {
		this.readTrigger = document.querySelector('[data-track="read"]');
	}

	trackRead() {
		if (!this.readTrigger) {
			return;
		}
		const observer = new IntersectionObserver((entries) => {
			entries.forEach((entry) => {
				if (entry.isIntersecting) {
					observer.unobserve(this.readTrigger!);

					track({
						id: "read-post",
						parameters: {
							url: window.location.pathname,
						},
					});
				}
			});
		});

		observer.observe(this.readTrigger);
	}

	trackPerformance() {
		const observers = [this.observeLcp(), this.observeCls()];
		Promise.all(observers).then((metrics) => {
			console.log({
				url: window.location.pathname,
				lcp: metrics[0],
				cls: metrics[1],
			});
			window.addEventListener("beforeunload", () => {
				track({
					id: "performance",
					parameters: {
						url: window.location.pathname,
						lcp: metrics[0]?.toString() || "",
						cls: metrics[1]?.toString() || "",
					},
				});
			});
		});
	}

	observeLcp(): Promise<number | null> {
		return new Promise((resolve) => {
			if (!PerformanceObserver.supportedEntryTypes.includes("largest-contentful-paint")) {
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
	}

	observeCls(): Promise<number | null> {
		return new Promise((resolve) => {
			if (!PerformanceObserver.supportedEntryTypes.includes("layout-shift")) {
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
	}

	trackReferrers() {
		if (!document.referrer || document.referrer.startsWith(location.origin)) {
			return;
		}

		track({
			id: "referrers",
			parameters: parameters.referrer(),
		});
	}
}
