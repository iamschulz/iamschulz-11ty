const svg = require("./svg");

module.exports = function codepenShortcode(content, eleventyConfig) {
	const uuid = Math.round(Math.random() * 1000000);

	if (eleventyConfig.globalData.isRss) {
		return `<a href="${content}" rel="noopener" target="_blank">CodePen Embed</a>`;
	}

	return `
<div class="replace-embed" data-source="codepen">
	<a
		data-component="replaceIframe"
		data-replace-iframe-trigger-target="${uuid}"
		href="${content}"
		class="replace-embed__replacer"
	>
		<img
			class="replace-embed__thumbnail"
			srcset="
                ${content}/image/small.png 360w,
                ${content}/image/large.png 1280w
                "
            sizes="(min-width: 30em) 50vw, 100vw"
			src="${content}/image/large.png"
			alt="Screenshot of a CodePen Embed"
			loading="lazy"
			decoding="async"
		>
		<span class="replace-embed__icon loader">
            ${svg("static/codepen-brands.svg")}
		</span>
	</a>
	<span class="replace-embed__legal">
		Activating this Feature allows CodePen to place cookies and communicate
		with CodePen's servers.<br>
        <a href="${content}" rel="noopener" target="_blank">open in new tab</a>
	</span>
	<iframe
		data-iframe-replace-id="${uuid}"
		class="replace-embed__iframe"
		style="width: 100%"
		hidden
		src="#"
		data-src="${content.replace(
			"/pen/",
			"/embed/"
		)}?height=265&theme-id=dark&default-tab=result"
	></iframe>
</div>
`;
	return result;
};
