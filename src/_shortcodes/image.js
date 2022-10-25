const Image = require("@11ty/eleventy-img");

module.exports = function imageShortcode(
	src,
	alt,
	className = "",
	lazy = true
) {
	// todo: add whitelist
	let options = {
		widths: [420, 786, 1000],
		formats: ["avif", "webp", "jpeg"],
		outputDir: "./dist/img/",
	};

	// generate images, while this is async we don’t wait
	Image(src, options);

	let imageAttributes = {
		alt,
		sizes: "100vw",
		class: className,
		loading: lazy ? "lazy" : "eager",
		decoding: "async",
	};

	// get metadata even the images are not fully generated
	const metadata = Image.statsByDimensionsSync(src, 1000, 1000, options);
	let html = Image.generateHTML(metadata, imageAttributes);
	html = html.replace(/(?:width|height)="[0-9]+"/gm, "");
	return html;
};
