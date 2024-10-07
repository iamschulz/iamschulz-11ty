import markdownIt from "markdown-it";

export async function renderHtmlFilter(content, eleventyConfig) {
	const md = markdownIt({
		html: true,
	});

	if (!content) {
		return md.render("");
	}

	const renderedShortcodes = await eleventyConfig.javascript.functions.renderTemplate(content, "njk");
	return md.render(renderedShortcodes);
}
