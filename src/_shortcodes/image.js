const Image = require('@11ty/eleventy-img');

module.exports = async function imageShortcode(src, alt) {
	// todo: add whitelist
	// todo: use synchronous method to get images in macros
	let metadata = await Image(src, {
		widths: [300, 600],
		formats: ['avif', 'jpeg'],
		outputDir: './dist/img/',
	});

	let imageAttributes = {
		alt,
		sizes: '(min-width: 30em) 50vw, 100vw',
		loading: 'lazy',
		decoding: 'async',
	};

	// You bet we throw an error on missing alt in `imageAttributes` (alt="" works okay)
	const html = Image.generateHTML(metadata, imageAttributes);
	return html;
};
