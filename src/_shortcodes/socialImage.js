import { Image } from "@11ty/eleventy-img";
import { getCacheDuration } from "../_helpers/getCacheDuration.js";

export async function socialImageShortcode(src) {
	let options = {
		widths: [1000],
		formats: ["jpeg"],
		outputDir: "./dist/img/",
		cacheOptions: {
			duration: getCacheDuration().images,
			directory: ".cache",
		},
	};

	const metadata = await Image(src, options);
	return metadata.jpeg[0].url;
}
