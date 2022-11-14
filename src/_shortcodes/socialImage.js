const Image = require("@11ty/eleventy-img");

module.exports = async function imageShortcode(src) {
	let options = {
		widths: [1000],
		formats: ["jpeg"],
		outputDir: "./dist/img/",
	};

	const metadata = await Image(src, options);
	return metadata.jpeg[0].url;
};
