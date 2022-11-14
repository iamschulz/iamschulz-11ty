import Quicklink from "quicklink/dist/quicklink.js";

export class Preload {
	constructor() {
		if (this.isDataSaver()) {
			return;
		}

		this.startQuicklink();
	}

	isDataSaver() {
		return navigator?.connection?.saveData;
	}

	startQuicklink() {
		Quicklink.listen({
			ignores: [
				(uri) => uri === window.location.href,
				(uri) => uri.includes("/api-proxy"),
				(uri) => uri.includes("/legal"),
				(uri) => uri.includes(".zip"),
				(uri) => uri.includes(".rar"),
				(uri) => uri.includes(".gz"),
				(uri) => uri.includes(".7z"),
				(uri) => uri.includes(".xml"),
				(uri) => uri.includes("#"),
			],
		});
	}
}
