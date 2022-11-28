const Image = require("@11ty/eleventy-img");

module.exports = async function imageShortcode(
	src,
	alt,
	className = "",
	lazy = true
) {
	// todo: add whitelist

	const isAnimated = [".gif", ".webp"].some((x) =>
		new URL(src).pathname.endsWith(x)
	);

	let options = {
		widths: [420, 786, 1000, 1800],
		formats: isAnimated ? ["webp", "gif"] : ["avif", "webp", "jpeg"],
		animated: isAnimated,
		sharpWebpOptions: {
			quality: 80,
			lossless: false,
			nearLossless: true,
		},
		sharpAvifOptions: {
			quality: 80,
			lossless: false,
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
