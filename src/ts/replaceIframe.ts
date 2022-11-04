export class ReplaceIframe {
	private entries: HTMLElement[];

	constructor() {
		this.entries = Array.from(
			document.querySelectorAll('[data-component="replaceIframe"]')
		);
		this.registerEvents();
	}

	private registerEvents() {
		this.entries.forEach((entry) => {
			entry.addEventListener("click", (e) => {
				e.preventDefault();
				this.enableFeature(entry);
			});
		});
	}

	private enableFeature(entry: HTMLElement) {
		const targetId = entry.getAttribute(
			"data-replace-iframe-trigger-target"
		);
		const target = document.querySelector(
			`[data-iframe-replace-id="${targetId}"]`
		);
		if (!target) {
			return;
		}
		this.toggleLoading(entry, true);
		target.setAttribute("src", target.getAttribute("data-src") || "");
		target.addEventListener(
			"load",
			() => {
				this.toggleLoading(entry, false);
				target.removeAttribute("hidden");
				entry.remove();
			},
			{ once: true }
		);
	}

	private toggleLoading(entry: HTMLElement, force: Boolean) {
		entry.setAttribute("data-loading", String(force));
	}
}
