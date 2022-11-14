const { markdownToTxt } = require("markdown-to-txt");

module.exports = async function (content, eleventyConfig) {
	const renderedShortcodes =
		await eleventyConfig.javascriptFunctions.renderTemplate(content, "njk");
	const plainText = markdownToTxt(renderedShortcodes);
	return plainText;
};
