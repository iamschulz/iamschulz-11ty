import { Comments } from "./comments";
import { apiProxy, getLikeApi } from "./constants";
import { Likes } from "./likes";

export class Reactions {
	el: HTMLElement;
	devId: string | null;
	ignoredComments: string[];
	reactions: {
		likes: number;
		comments: Reply[];
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
		this.ignoredComments =
			document
				.querySelector('meta[name="ignore-comments"]')
				?.getAttribute("content")
				?.split(",")
				.map((x) => x.trim()) || [];

		this.fetchReactions().then((reactions) => {
			this.reactions = reactions;
			this.enableUi();
		});
	}

	private enableUi() {
		new Likes(this.reactions.likes);
		new Comments(this.reactions.comments);
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
		if (!this.devId) {
			return [];
		}

		const apiFetchUrl = `https://dev.to/api/comments?a_id=${
			this.devId
		}&time=${Date.now()}`;
		let comments: Reply[] = [];

		await fetch(apiFetchUrl)
			.then((response) => response.json())
			.then((data) => {
				Array.from(data).forEach((r) => {
					const reply = r as devReply;

					if (
						this.ignoredComments.some(
							(x) => String(x) === String(reply.id_code)
						)
					) {
						return;
					}

					const comment = {
						id: reply.id_code,
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
					} as Reply;

					comments.push(comment);
				});
			});
		return comments;
	}

	private async fetchWebmentions() {
		const webmentionsUrl = "iamschulz.com";
		const targetUrl = window.location.href;
		const webmentionsFetchUrl = `https://webmention.io/api/mentions.jf2?domain=${webmentionsUrl}&target=${targetUrl}`;
		const apiFetchUrl = `${apiProxy}${encodeURIComponent(
			webmentionsFetchUrl
		)}&time=${Date.now()}`;

		let likes = 0;
		let comments: Reply[] = [];

		await fetch(apiFetchUrl)
			.then((response) => response.json())
			.then((data) => {
				Array.from(data.children).forEach((r) => {
					const reply = r as Webmention;

					if (reply["like-of"] === targetUrl) {
						likes += 1;
						return;
					}

					if (
						reply["repost-of"] ||
						this.ignoredComments.some(
							(x) => String(x) === String(reply["wm-id"])
						) ||
						!reply.content
					) {
						return;
					}

					try {
						const comment = {
							id: reply["wm-id"],
							avatar: reply.author.photo
								? new URL(reply.author.photo)
								: null,
							authorName: reply.author.name,
							authorUrl: reply.author.url
								? new URL(reply.author.url)
								: null,
							source: new URL(reply.url),
							date: new Date(
								reply.published || reply["wm-received"]
							),
							content: reply.content?.html || reply.content?.text,
							hasReply: false,
						} as Reply;

						comments.push(comment);
					} catch (e) {
						console.warn("could not parse comment", e);
					}
				});
			});

		comments = comments.sort((a, b) => b.date.getTime() - a.date.getTime());

		return {
			likes,
			comments,
		};
	}
}
