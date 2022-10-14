const { EleventyRenderPlugin } = require("@11ty/eleventy");
const imageShortcode = require("./src/_shortcodes/image.js");
const codepenShortcode = require("./src/_shortcodes/codepen.js");
const getSvgContent = require("./src/_shortcodes/svg.js");

const markdownIt = require("markdown-it");
const md = markdownIt({
	html: true,
});

module.exports = function (eleventyConfig) {
	eleventyConfig.addWatchTarget("./src/sass/");
	eleventyConfig.addWatchTarget("./src/ts/");
	eleventyConfig.setTemplateFormats(["md"]);
	eleventyConfig.addPlugin(EleventyRenderPlugin);
	eleventyConfig.addPassthroughCopy({ "src/static/public": "assets" });
	eleventyConfig.addShortcode("svg", getSvgContent);
	eleventyConfig.addNunjucksShortcode("codepen", codepenShortcode);
	eleventyConfig.addNunjucksShortcode("image", imageShortcode);
	eleventyConfig.addNunjucksAsyncShortcode(
		"render",
		async (content) =>
			await eleventyConfig.javascriptFunctions.renderTemplate(
				content,
				"njk"
			)
	);
	eleventyConfig.addNunjucksAsyncShortcode("renderMd", async (content) => {
		const renderedShortcodes =
			await eleventyConfig.javascriptFunctions.renderTemplate(
				content,
				"njk"
			);
		const renderedMd = md.render(renderedShortcodes);
		return renderedMd;
	});

	return {
		markdownTemplateEngine: "njk",
		dataTemplateEngine: "njk",
		htmlTemplateEngine: "njk",
		dir: {
			input: "src",
			output: "dist",
		},
	};
};
