import { apiProxy, getLikeApi } from "./constants";

export async function getReactions() {
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
