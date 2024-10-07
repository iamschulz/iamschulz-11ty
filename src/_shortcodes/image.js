import { Image } from "@11ty/eleventy-img";
import { getCacheDuration } from "../_helpers/getCacheDuration.js";

export async function imageShortcode(src, alt, className = "", lazy = true) {
	// todo: add whitelist

	const isAnimated = [".gif", ".webp"].some((x) => new URL(src).pathname.endsWith(x));

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
		fetchpriority: lazy ? "low" : "high",
		decoding: "async",
	};

	const metadata = await Image(src, options);
	let html = Image.generateHTML(metadata, imageAttributes);
	return html;
}
