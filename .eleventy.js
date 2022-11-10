const { EleventyRenderPlugin } = require("@11ty/eleventy");
const tinyHTML = require("@sardine/eleventy-plugin-tinyhtml");
const markdownIt = require("markdown-it");
const markdownItAnchor = require("markdown-it-anchor");
const imageShortcode = require("./src/_shortcodes/image.js");
const codepenShortcode = require("./src/_shortcodes/codepen.js");
const youtubeShortcode = require("./src/_shortcodes/youtube.js");
const syntaxHighlight = require("@11ty/eleventy-plugin-syntaxhighlight");
const getYear = require("./src/_shortcodes/getYear.js");
const getSvgContent = require("./src/_shortcodes/svg.js");
const formatDate = require("./src/_shortcodes/formatDate.js");
const eleventyHTMLValidate = require("eleventy-plugin-html-validate");
const pluginTOC = require("eleventy-plugin-toc");
const unescapeNjk = require("./src/_helpers/unescapeNjk.js");

const md = markdownIt({
	html: true,
});

module.exports = function (eleventyConfig) {
	eleventyConfig.addWatchTarget("./src/sass/");
	eleventyConfig.addWatchTarget("./src/ts/");
	eleventyConfig.setTemplateFormats(["md"]);
	eleventyConfig.setLibrary(
		"md",
		markdownIt({
			html: true,
		}).use(markdownItAnchor)
	);

	eleventyConfig.addPlugin(EleventyRenderPlugin);
	eleventyConfig.addPlugin(eleventyHTMLValidate);
	eleventyConfig.addPlugin(pluginTOC, {
		flat: true,
	});
	eleventyConfig.addPlugin(tinyHTML);
	eleventyConfig.addPassthroughCopy({ "src/static/public": "assets" });
	eleventyConfig.addShortcode("svg", getSvgContent);
	eleventyConfig.addShortcode("date", formatDate);
	eleventyConfig.addShortcode("year", getYear);
	eleventyConfig.addNunjucksShortcode("codepen", codepenShortcode);
	eleventyConfig.addNunjucksShortcode("youtube", youtubeShortcode);
	eleventyConfig.addNunjucksAsyncShortcode("image", imageShortcode);
	eleventyConfig.addPlugin(syntaxHighlight);
	eleventyConfig.addNunjucksAsyncShortcode("render", async (content) => {
		// escape nunjucks code in content inside data handlers
		content = await eleventyConfig.javascriptFunctions.renderTemplate(
			content,
			"njk"
		);
		content = unescapeNjk(content);
		return content;
	});
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
		templateFormats: ["md", "njk", "html", "liquid"],
		markdownTemplateEngine: "njk",
		dataTemplateEngine: "njk",
		htmlTemplateEngine: "njk",
		dir: {
			input: "src",
			output: "dist",
		},
	};
};
