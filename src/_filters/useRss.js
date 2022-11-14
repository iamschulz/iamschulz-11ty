module.exports = function (content, eleventyConfig) {
	eleventyConfig.addGlobalData("isRss", true);
	return content;
};
