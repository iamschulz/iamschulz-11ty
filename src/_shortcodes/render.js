const unescapeNjk = require("../_helpers/unescapeNjk");

module.exports = async function (content, eleventyConfig) {
	// escape nunjucks code in content inside data handlers
	content = await eleventyConfig.javascriptFunctions.renderTemplate(
		content,
		"njk"
	);
	content = unescapeNjk(content);
	return content;
};
