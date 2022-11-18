const Image = require("@11ty/eleventy-img");

module.exports = async function imageShortcode(
	src,
	alt,
	className = "",
	lazy = true
) {
	// todo: add whitelist

	const isGif = new URL(src).pathname.endsWith('.gif')

	let options = {
		widths: [420, 786, 1000],
		formats: isGif ? ["webp", "gif"] : ["avif", "webp", "jpeg"],
		sharpOptions: {
			animated: isGif
		},
		outputDir: "./dist/img/",
	};

	let imageAttributes = {
		alt,
		sizes: "100vw",
		class: className,
		loading: lazy ? "lazy" : "eager",
		decoding: "async",
	};

	const metadata = await Image(src, options);
	let html = Image.generateHTML(metadata, imageAttributes);
	return html;
};
