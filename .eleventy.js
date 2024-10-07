import { EleventyRenderPlugin } from "@11ty/eleventy";
import tinyHTML from "@sardine/eleventy-plugin-tinyhtml";
import markdownIt from "markdown-it";
import markdownItAnchor from "markdown-it-anchor";
import { render as renderShortcode } from "./src/_shortcodes/render.js";
import { imageShortcode } from "./src/_shortcodes/image.js";
import { socialImageShortcode } from "./src/_shortcodes/socialImage.js";
import { codepenShortcode } from "./src/_shortcodes/codepen.js";
import { youtubeShortcode } from "./src/_shortcodes/youtube.js";
import syntaxHighlight from "@11ty/eleventy-plugin-syntaxhighlight";
import { getYear } from "./src/_shortcodes/getYear.js";
import { svg } from "./src/_shortcodes/svg.js";
import { formatDate } from "./src/_shortcodes/formatDate.js";
import pluginTOC from "eleventy-plugin-toc";
import pluginRss from "@11ty/eleventy-plugin-rss";
import { useRssFilter } from "./src/_filters/useRss.js";
import { renderHtmlFilter } from "./src/_filters/renderHtml.js";
import { renderRssFilter } from "./src/_filters/renderRss.js";
import { escapeAttribute } from "./src/_filters/escapeAttribute.js";

export default function (eleventyConfig) {
	eleventyConfig.addWatchTarget("./src/sass/");
	eleventyConfig.addWatchTarget("./src/ts/");
	eleventyConfig.addPassthroughCopy({ "src/robots.txt": "/robots.txt" });
	eleventyConfig.addPassthroughCopy({ "src/static/public": "assets" });
	eleventyConfig.addPassthroughCopy({ "src/manifest.json": "/" });
	eleventyConfig.setTemplateFormats(["md", "njk"]);
	eleventyConfig.setLibrary(
		"md",
		markdownIt({
			html: true,
		}).use(markdownItAnchor)
	);

	eleventyConfig.addPlugin(pluginRss);
	eleventyConfig.addPlugin(EleventyRenderPlugin);
	eleventyConfig.addPlugin(pluginTOC, {
		tags: ["h2", "h3", "h4"],
		flat: true,
	});
	eleventyConfig.addPlugin(tinyHTML);
	eleventyConfig.addPlugin(syntaxHighlight);

	eleventyConfig.addTransform("absoluteUrl", async function (content) {
		console.log("foo abs", this.page.inputPath, content);
		console.log(this.page.outputPath);

		return content; // todo: actually add the absUrl transform
	});

	eleventyConfig.addShortcode("svg", svg);
	eleventyConfig.addShortcode("date", formatDate);
	eleventyConfig.addShortcode("year", getYear);
	eleventyConfig.addNunjucksShortcode("codepen", (content) => codepenShortcode(content, eleventyConfig));
	eleventyConfig.addNunjucksShortcode("youtube", (content) => youtubeShortcode(content, eleventyConfig));
	eleventyConfig.addNunjucksAsyncShortcode("image", imageShortcode);
	eleventyConfig.addNunjucksAsyncShortcode("socialImage", socialImageShortcode);
	eleventyConfig.addNunjucksAsyncShortcode("render", async (content) => renderShortcode(content, eleventyConfig));

	eleventyConfig.addFilter("escapeAttribute", escapeAttribute);
	eleventyConfig.addFilter("encodeURIComponent", encodeURIComponent);
	eleventyConfig.addFilter("useRss", (content) => useRssFilter(content, eleventyConfig));
	eleventyConfig.addAsyncFilter("renderHtml", async (content) => await renderHtmlFilter(content, eleventyConfig));
	eleventyConfig.addAsyncFilter("renderRss", async (content) => await renderRssFilter(content, eleventyConfig));

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
}
