const svg = require("./svg");

module.exports = function codepenShortcode(content) {
	const uuid = Math.round(Math.random() * 1000000);
	let result = `
<div class="codepen-embed">
	<a
		data-component="replaceIframe"
		data-replace-iframe-trigger-target="${uuid}"
		href="${content}"
		class="codepen-embed__replacer"
	>
		<img
			class="codepen-embed__thumbnail"
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
		<span class="codepen-embed__icon">
            ${svg("static/codepen-brands.svg")}
		</span>
	</a>
	<span class="codepen-embed__legal">
		Activating this Feature allows CodePen to place cookies and communicate
		with CodePen's servers.<br>
		<a href="/legal">more info</a><br>
        <a href="${content}" rel="noopener" target="_blank">open in new tab</a>
	</span>
	<iframe
		data-iframe-replace-id="${uuid}"
		class="codepen-embed__iframe"
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
