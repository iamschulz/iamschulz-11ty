import { apiProxy, getLikeApi } from "./constants";
import { Likes } from "./likes";

type Webmention = {
	author: {
		name: string;
		url: string;
		photo: string;
	};
	content?: {
		text: string;
		html: string;
	};
	published: string;
	"like-of": string;
	"repost-of": string;
	"wm-private": string;
	"wm-id": string;
	url: string;
};

type devReply = {
	type_of: string;
	id_code: string;
	created_at: string;
	body_html: string;
	user: {
		name: string;
		username: string;
		profile_image_90: string;
	};
	children: Array<any>;
};

type Comment = {
	avatar: URL;
	authorName: string;
	authorUrl: URL;
	source: URL;
	date: Date;
	content: string;
	hasReply: boolean;
};

export class Reactions {
	el: HTMLElement;
	devId: string | null;
	reactions: {
		likes: number;
		comments: Comment[];
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
		console.log(this.reactions); // todo: remove
		new Likes(this.reactions.likes);
		this.loader.setAttribute("hidden", "hidden");
	}

	private async fetchReactions() {
		// todo: check if those are parallel
		const customLikes = await this.fetchCustomLikes();
		const devLikes = await this.fetchDevLikes();
		const devComments = await this.fetchDevComments();
		const webmentions = await this.fetchWebmentions();

		return {
			likes: customLikes + devLikes + webmentions.likes,
			comments: [...webmentions.comments, ...devComments],
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
		if (!this.devId) {
			return 0;
		}
		const devLikesUrl = `https://dev.to/api/articles/${
			this.devId
		}&time=${Date.now()}`;
		const devLikesResult = await (await fetch(devLikesUrl)).json();
		return Number(devLikesResult.positive_reactions_count) || 0;
	}

	private async fetchDevComments() {
		const apiFetchUrl = `https://dev.to/api/comments?a_id=${
			this.devId
		}&time=${Date.now()}`;
		const comments: Comment[] = [];

		await fetch(apiFetchUrl)
			.then((response) => response.json())
			.then((data) => {
				Array.from(data).forEach((r) => {
					const reply = r as devReply;
					const comment = {
						avatar: new URL(reply.user.profile_image_90),
						authorName: reply.user.name,
						authorUrl: new URL(
							`https://dev.to/${reply.user.username}`
						),
						source: new URL(
							`https://dev.to/${reply.user.username}/comment/${reply.id_code}`
						),
						date: new Date(reply.created_at),
						content: reply.body_html,
						hasReply: reply.children.length > 0,
					} as Comment;
					comments.push(comment);
				});
			});
		return comments;
	}

	private async fetchWebmentions() {
		const webmentionsUrl = "iamschulz.com";
		//const targetUrl = window.location.href;
		const targetUrl = "https://iamschulz.com/writing-a-game-in-typescript/"; // todo: switch out
		const webmentionsFetchUrl = `https://webmention.io/api/mentions.jf2?domain=${webmentionsUrl}&target=${targetUrl}`;
		const apiFetchUrl = `${apiProxy}${encodeURIComponent(
			webmentionsFetchUrl
		)}&time=${Date.now()}`;

		let likes = 0;
		const comments: Comment[] = [];

		await fetch(apiFetchUrl)
			.then((response) => response.json())
			.then((data) => {
				Array.from(data.children).forEach((r) => {
					const reply = r as Webmention;

					if (reply["like-of"] === targetUrl) {
						likes += 1;
						return;
					}

					const comment = {
						avatar: new URL(reply.author.photo),
						authorName: reply.author.name,
						authorUrl: new URL(reply.author.url),
						source: new URL(reply.url),
						date: new Date(reply.published),
						content: reply.content?.html,
						hasReply: false,
					} as Comment;

					comments.push(comment);
				});
			});

		return {
			likes,
			comments,
		};
	}
}
