import { unescapeNjk } from "../_helpers/unescapeNjk.js";

export async function renderRssFilter(content, eleventyConfig) {
	content = unescapeNjk(content);
	eleventyConfig.addGlobalData("isRss", false);
	return content;
}
