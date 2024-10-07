import { isMatchInCodeBlock } from "./isMatchInCodeBlock.js";

export function youtubeToShortCode(markdown) {
	let result = markdown;

	const regex = /\[image\]\(https\:\/\/www\.youtube\.com\/watch\?v=(?<id>[-_\w\/]+)\)/gm;
	let match = regex.exec(markdown);

	while (match != null) {
		const mdYoutube = match[0];
		const id = match[1];

		if (!id) {
			console.error(`url missing for ${mdYoutube}`);
			return;
		}

		if (!isMatchInCodeBlock(match, markdown)) {
			// replace with shortcode
			result = result.replace(mdYoutube, `{% youtube "${id}" %}`);
		}

		match = regex.exec(markdown);
	}

	return result;
}
