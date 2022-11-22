const { EleventyRenderPlugin } = require("@11ty/eleventy");
const tinyHTML = require("@sardine/eleventy-plugin-tinyhtml");
const markdownIt = require("markdown-it");
const markdownItAnchor = require("markdown-it-anchor");
const renderShortcode = require("./src/_shortcodes/render.js");
const imageShortcode = require("./src/_shortcodes/image.js");
const socialImageShortcode = require("./src/_shortcodes/socialImage.js");
const codepenShortcode = require("./src/_shortcodes/codepen.js");
const youtubeShortcode = require("./src/_shortcodes/youtube.js");
const syntaxHighlight = require("@11ty/eleventy-plugin-syntaxhighlight");
const getYear = require("./src/_shortcodes/getYear.js");
const getSvgContent = require("./src/_shortcodes/svg.js");
const formatDate = require("./src/_shortcodes/formatDate.js");
const eleventyHTMLValidate = require("eleventy-plugin-html-validate");
const pluginTOC = require("eleventy-plugin-toc");
const pluginRss = require("@11ty/eleventy-plugin-rss");
const useRssFilter = require("./src/_filters/useRss");
const renderHtmlFilter = require("./src/_filters/renderHtml");
const renderTxtFilter = require("./src/_filters/renderTxt");
const renderRssFilter = require("./src/_filters/renderRss");
const escapeAttribute = require("./src/_filters/escapeAttribute.js");

module.exports = function (eleventyConfig) {
	eleventyConfig.addWatchTarget("./src/sass/");
	eleventyConfig.addWatchTarget("./src/ts/");
	eleventyConfig.addPassthroughCopy({ "src/static/public": "assets" });
	eleventyConfig.setTemplateFormats(["md", "njk"]);
	eleventyConfig.setLibrary(
		"md",
		markdownIt({
			html: true,
		}).use(markdownItAnchor)
	);

	eleventyConfig.addPlugin(pluginRss);
	eleventyConfig.addPlugin(EleventyRenderPlugin);
	eleventyConfig.addPlugin(eleventyHTMLValidate);
	eleventyConfig.addPlugin(pluginTOC, {
		tags: ["h2", "h3", "h4"],
		flat: true,
	});
	eleventyConfig.addPlugin(tinyHTML);
	eleventyConfig.addPlugin(syntaxHighlight);

	eleventyConfig.addShortcode("svg", getSvgContent);
	eleventyConfig.addShortcode("date", formatDate);
	eleventyConfig.addShortcode("year", getYear);
	eleventyConfig.addNunjucksShortcode("codepen", (content) =>
		codepenShortcode(content, eleventyConfig)
	);
	eleventyConfig.addNunjucksShortcode("youtube", (content) =>
		youtubeShortcode(content, eleventyConfig)
	);
	eleventyConfig.addNunjucksAsyncShortcode("image", imageShortcode);
	eleventyConfig.addNunjucksAsyncShortcode(
		"socialImage",
		socialImageShortcode
	);
	eleventyConfig.addNunjucksAsyncShortcode("render", async (content) =>
		renderShortcode(content, eleventyConfig)
	);

	eleventyConfig.addFilter("escapeAttribute", escapeAttribute);
	eleventyConfig.addFilter("useRss", (content) =>
		useRssFilter(content, eleventyConfig)
	);
	eleventyConfig.addAsyncFilter(
		"renderHtml",
		async (content) => await renderHtmlFilter(content, eleventyConfig)
	);
	eleventyConfig.addAsyncFilter(
		"renderTxt",
		async (content) => await renderTxtFilter(content, eleventyConfig)
	);
	eleventyConfig.addAsyncFilter(
		"renderRss",
		async (content) => await renderRssFilter(content, eleventyConfig)
	);

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
