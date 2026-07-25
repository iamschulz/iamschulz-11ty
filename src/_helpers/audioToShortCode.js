const isMatchInCodeBlock = require("./isMatchInCodeBlock");

// Turns the `[audio](url)` token emitted by the notion-to-md custom transformer
// (see blogs.js / arts.js) into the `{% audio %}` shortcode.
module.exports = (markdown) => {
	let result = markdown;

	const regex = /\[audio\]\((?<url>[^\)]+)\)/gm;
	let match = regex.exec(markdown);

	while (match != null) {
		const mdAudio = match[0];
		const url = match.groups.url;

		if (!url) {
			console.error(`url missing for ${mdAudio}`);
			return;
		}

		if (!isMatchInCodeBlock(match, markdown)) {
			// replace with shortcode
			result = result.replace(mdAudio, `{% audio "${url}" %}`);
		}

		match = regex.exec(markdown);
	}

	return result;
};
