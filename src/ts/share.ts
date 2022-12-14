export class Share {
	el: HTMLElement;
	shareApiLink: HTMLAnchorElement;
	title: string;
	text: string;
	url: URL;

	constructor() {
		const el = document.querySelector('[data-component="share"]');
		const shareApiLink = el?.querySelector(
			'[data-share-el="shareApiLink"]'
		);

		if (!el || !shareApiLink) {
			return;
		}

		this.el = el as HTMLElement;
		this.shareApiLink = shareApiLink as HTMLAnchorElement;
		this.title = this.el.dataset.shareLinksTitle || "";
		this.text = this.el.dataset.shareLinksText || "";
		this.url = new URL(this.el.dataset.shareLinksUrl || "");

		if (!this.url || !navigator.share) {
			return;
		}

		this.enableUI();
	}

	enableUI() {
		this.el.removeAttribute("hidden");
		this.shareApiLink.addEventListener("click", (e) =>
			this.useShareMenu(e)
		);
	}

	useShareMenu(event) {
		event.preventDefault();
		navigator.share({
			title: this.title,
			text: this.text,
			url: this.url.href,
		});
	}
}
