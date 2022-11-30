import { apiProxy, getLikeApi } from "./constants";
import { Likes } from "./likes";

export class Reactions {
	el: HTMLElement;
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
		const currentUrl = window.location.href.replace(
			window.location.protocol + "//",
			""
		);

		const customLikesUrl = `${apiProxy}${getLikeApi}${currentUrl}&time=${Date.now()}`;
		const customLikeResult = await (await fetch(customLikesUrl)).text();
		const customLikes = Number(customLikeResult) || 0;

		const devLikes = 0;
		const wmLikes = 0;

		const likes = customLikes + devLikes + wmLikes;

		return {
			likes,
		};
	}
}
