const markdownIt = require("markdown-it");

module.exports = async function (content, eleventyConfig) {
	const md = markdownIt({
		html: true,
	});

	const renderedShortcodes =
		await eleventyConfig.javascriptFunctions.renderTemplate(content, "njk");
	return md.render(renderedShortcodes);
};
