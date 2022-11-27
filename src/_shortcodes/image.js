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
		widths: [420, 786, 1000],
		formats: isAnimated ? ["webp", "gif"] : ["avif", "webp", "jpeg"],
		sharpOptions: {
			animated: isAnimated,
			avif: {
				quality: 100,
				lossless: true,
			},
			webp: {
				quality: 100,
				lossless: true,
				mixed: true,
			},
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
