const svg = require("./svg");

module.exports = function youtubeShortcode(id, eleventyConfig) {
	const uuid = Math.round(Math.random() * 1000000);

	if (eleventyConfig.globalData.isRss) {
		return `<a href="https://www.youtube.com/watch?v=${id}">Youtube Video</a>`;
	}

	return `
<div class="replace-embed" data-source="youtube">
	<a
		data-component="replaceIframe"
		data-replace-iframe-trigger-target="${uuid}"
		href="${id}"
		class="replace-embed__replacer"
	>
		<img
			class="replace-embed__thumbnail"
			srcset="
                https://i.ytimg.com/vi/${id}/hqdefault.jpg 360w,
                https://i.ytimg.com/vi/${id}/maxresdefault.jpg 1280w
                "
            sizes="(min-width: 30em) 50vw, 100vw"
			src="https://i.ytimg.com/vi/${id}/maxresdefault.jpg"
			alt="Screenshot of a YouTube Embed"
			loading="lazy"
			decoding="async"
		>
		<span class="replace-embed__icon">
            ${svg("static/youtube-brands.svg")}
		</span>
	</a>
	<span class="replace-embed__legal">
		Activating this Feature allows YouTube to place cookies and communicate
		with Google's servers.<br>
		<a href="/legal">more info</a><br>
        <a href="https://www.youtube.com/watch?v=${id}" rel="noopener" target="_blank">open in new tab</a>
	</span>
	<iframe
		data-iframe-replace-id="${uuid}"
		class="replace-embed__iframe"
		style="width: 100%"
		hidden
		src="#"
		data-src="https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0"
	></iframe>
</div>
`;
};
