module.exports = (markdown) => {
	let result = markdown;

	const regex = /!\[(?<alt>[^\]]+)?\]\((?<url>[^\)]+)\)/gm;
	match = regex.exec(markdown);

	while (match != null) {
		const mdImage = match[0];
		const alt = match[1];
		const url = match[2];

		if (!url) {
			console.error(`url missing for ${mdImage}`);
			return;
		}

		if (!alt) {
			console.error(`alt missing for ${mdImage}`);
			return;
		}

		// replace with new url
		result = result.replace(mdImage, `{% image "${url}", "${alt}" %}`);

		match = regex.exec(markdown);
	}

	return result;
};
