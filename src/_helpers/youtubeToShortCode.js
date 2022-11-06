module.exports = (markdown) => {
	let result = markdown;

	const regex =
		/\[image\]\(https\:\/\/www\.youtube\.com\/watch\?v=(?<id>[-_\w\/]+)\)/gm;
	match = regex.exec(markdown);

	while (match != null) {
		const mdYoutube = match[0];
		const id = match[1];

		if (!id) {
			console.error(`url missing for ${mdYoutube}`);
			return;
		}

		// replace with shortcode
		result = result.replace(mdYoutube, `{% youtube "${id}" %}`);

		match = regex.exec(markdown);
	}

	return result;
};
