const { AssetCache } = require("@11ty/eleventy-fetch");
const crypto = require("crypto");
const fs = require("fs");
const path = require("path");
const getCacheDuration = require("../_helpers/getCacheDuration");

module.exports = async function audioShortcode(src, eleventyConfig) {
	const url = new URL(src);
	const ext = path.extname(url.pathname) || ".mp3";

	// The query string (AWS signature) changes on every build, so key the cache
	// and output filename on the stable pathname instead of the full URL.
	const hash = crypto
		.createHash("sha256")
		.update(url.pathname)
		.digest("hex")
		.slice(0, 12);

	const publicPath = `/audio/${hash}${ext}`;

	if (eleventyConfig?.globalData?.isRss) {
		return `<a href="${publicPath}">Audio</a>`;
	}

	const asset = new AssetCache(`notion_audio_${hash}`, ".cache");

	let buffer;
	if (asset.isCacheValid(getCacheDuration().images)) {
		buffer = await asset.getCachedValue();
	} else {
		const response = await fetch(src);
		if (!response.ok) {
			throw new Error(
				`Failed to fetch audio (${response.status} ${response.statusText}): ${src}`
			);
		}
		buffer = Buffer.from(await response.arrayBuffer());
		await asset.save(buffer, "buffer");
	}

	const outputDir = "./dist/audio";
	fs.mkdirSync(outputDir, { recursive: true });
	fs.writeFileSync(path.join(outputDir, `${hash}${ext}`), buffer);

	return `<audio controls preload="metadata" src="${publicPath}"></audio>`;
};
