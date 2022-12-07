const Image = require("@11ty/eleventy-img");
const getCacheDuration = require("../_helpers/getCacheDuration");
const { AssetCache } = require("@11ty/eleventy-fetch");

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

	/*
    todo: introduce image caching mechanics
    - stripped query params can not be used by image plugin
    - create new json in ./cache with cached image urls with stripped query params and created_at
    - if json includes current src, do not fetch again
    - check eleventy cache for old image instead (how?)

    example source: https://s3.us-west-2.amazonaws.com/secure.notion-static.com/ac17bf75-0ab6-4bff-b246-a40eaf3afffe/synthetic-font.gif?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAT73L2G45EIPT3X45%2F20221127%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20221127T134600Z&X-Amz-Expires=3600&X-Amz-Signature=65eec5b61fdf244e83de352cf2edc0928e6081011e76683f7731e889f26cb831&X-Amz-SignedHeaders=host&x-id=GetObject
    - expires after 60s
    */

	let options = {
		widths: [420, 786, 1000, 1800],
		formats: isAnimated ? ["webp", "gif"] : ["avif", "webp", "jpeg"],
		sharpOptions: {
			animated: isAnimated,
		},
		sharpWebpOptions: {
			quality: 80,
			lossless: false,
			nearLossless: true,
		},
		sharpAvifOptions: {
			quality: 80,
			lossless: false,
		},
		cacheOptions: {
			duration: getCacheDuration().images,
			directory: ".cache",
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
