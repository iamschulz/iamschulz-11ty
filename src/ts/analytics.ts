import { init, track, trackPages } from "insights-js";

export class Analytics {
	readTrigger: HTMLElement | null;
	pageType: string | null;

	constructor() {
		if (!process.env.INSIGHTS_KEY) {
			return;
		}
		init(process.env.INSIGHTS_KEY);

		this.pageType = document.head.querySelector("meta[pageType]")?.getAttribute("content") || null;

		// page views
		trackPages();

		// read articles
		this.registerReadTriggers();
		this.trackRead();

		//performance
		this.trackPerformance();
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
		if (!this.pageType) {
			return;
		}

		const observers = [this.observeLcp(), this.observeCls()];
		Promise.all(observers).then((metrics) => {
			track({
				id: `performance-${this.pageType}`,
				parameters: {
					url: window.location.pathname,
					lcp: metrics[0] ? this.rankLcp(metrics[0]) : "",
					cls: metrics[1] ? this.rankCls(metrics[1]) : "",
				},
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

	rankCls(cls: number): string {
		const ranges = {
			perfect: 0,
			good: 0.1,
			mid: 0.25,
			poor: Infinity,
		};

		for (const key in ranges) {
			if (cls <= ranges[key]) {
				return key;
			}
		}

		return "poor"; // Default to "poor" if the number is greater than Infinity
	}

	rankLcp(lcp: number): string {
		const ranges = {
			perfect: 1000,
			good: 2500,
			mid: 4000,
			poor: Infinity,
		};

		for (const key in ranges) {
			if (lcp <= ranges[key]) {
				return key;
			}
		}

		return "poor"; // Default to "poor" if the number is greater than Infinity
	}
}
