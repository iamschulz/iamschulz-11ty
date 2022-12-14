const isMatchInCodeBlock = require("./isMatchInCodeBlock");

module.exports = (markdown) => {
	let result = markdown;

	const regex = /\[embed\]\(https\:\/\/codepen\.io\/(?<url>[-_\w\/]+)\)/gm;
	match = regex.exec(markdown);

	while (match != null) {
		const mdCodepen = match[0];
		const url = match[1];

		if (!url) {
			console.error(`url missing for ${mdCodepen}`);
			return;
		}

		if (!isMatchInCodeBlock(match, markdown)) {
			// replace with shortcode
			result = result.replace(
				mdCodepen,
				`{% codepen "https://codepen.io/${url}" %}`
			);
		}

		match = regex.exec(markdown);
	}

	return result;
};
