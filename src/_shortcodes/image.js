const Image = require('@11ty/eleventy-img');

module.exports = function imageShortcode(src, alt) {
	// todo: add whitelist
	let options = {
		widths: [300, 600],
		formats: ['avif', 'webp', 'jpeg'],
		outputDir: './dist/img/',
	};

	// generate images, while this is async we don’t wait
	Image(src, options);

	let imageAttributes = {
		alt,
		sizes: '(min-width: 30em) 50vw, 100vw',
		loading: 'lazy',
		decoding: 'async',
	};

	// get metadata even the images are not fully generated
	const metadata = Image.statsByDimensionsSync(src, 600, 600, options);
	let html = Image.generateHTML(metadata, imageAttributes);
	html = html.replace(/(?:width|height)="[0-9]+"/gm, '');
	return html;
};
