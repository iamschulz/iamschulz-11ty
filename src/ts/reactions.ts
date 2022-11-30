import { apiProxy, getLikeApi } from "./constants";
import { Likes } from "./likes";

export class Reactions {
	el: HTMLElement;
	devId: string | null;
	reactions: {
		likes: number;
	};
	loader: HTMLElement;

	constructor() {
		const el = document.querySelector('[data-component="reactions"]');
		const loader = el?.querySelector('[data-reactions-el="loader"]');

		if (!el || !loader) {
			return;
		}

		this.el = el as HTMLElement;
		this.loader = loader as HTMLElement;
		this.devId = this.el.getAttribute("data-dev-id") || null;

		this.fetchReactions().then((reactions) => {
			this.reactions = reactions;
			this.enableUi();
		});
	}

	private enableUi() {
		new Likes(this.reactions.likes);
		this.loader.setAttribute("hidden", "hidden");
	}

	private async fetchReactions() {
		// todo: check if those are parallel
		const customLikes = await this.fetchCustomLikes();
		const devLikes = await this.fetchDevLikes();
		const wmLikes = 0;
		const likes = customLikes + devLikes + wmLikes;

		return {
			likes,
		};
	}

	private async fetchCustomLikes() {
		const currentUrl = window.location.href.replace(
			window.location.protocol + "//",
			""
		);
		const customLikesUrl = `${apiProxy}${getLikeApi}${currentUrl}&time=${Date.now()}`;
		const customLikesResult = await (await fetch(customLikesUrl)).text();
		return Number(customLikesResult) || 0;
	}

	private async fetchDevLikes() {
		const devLikesUrl = `https://dev.to/api/articles/${
			this.devId
		}&time=${Date.now()}`;
		const devLikesResult = await (await fetch(devLikesUrl)).json();
		return Number(devLikesResult.positive_reactions_count) || 0;
	}
}
