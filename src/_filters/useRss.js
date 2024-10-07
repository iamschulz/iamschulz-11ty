export function useRssFilter(content, eleventyConfig) {
	eleventyConfig.addGlobalData("isRss", true);
	return content;
}
