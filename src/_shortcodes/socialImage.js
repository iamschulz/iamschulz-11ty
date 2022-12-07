const Image = require("@11ty/eleventy-img");
const getCacheDuration = require("../_helpers/getCacheDuration");

module.exports = async function imageShortcode(src) {
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
};
