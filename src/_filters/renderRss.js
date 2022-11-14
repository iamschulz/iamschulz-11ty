const unescapeNjk = require("../_helpers/unescapeNjk");

module.exports = async function (content, eleventyConfig) {
	content = unescapeNjk(content);
	eleventyConfig.addGlobalData("isRss", false);
	return content;
};
