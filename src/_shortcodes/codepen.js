module.exports = async function codepenShortcode(content) {
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
                    https://codepen.io/user/pen/{{ $id }}/image/small.png 360w,
                    https://codepen.io/user/pen/{{ $id }}/image/large.png 1280w
                "
			src="${content}/image/large.png"
			alt="Screenshot of a CodePen Embed"
			loading="lazy"
			decoding="async"
		/>
		<span class="codepen-embed__icon">
			<!-- todo: codepen logo here -->
		</span>
	</a>
	<span class="codepen-embed__legal">
		Activating this Feature allows CodePen to place cookies and communicate
		with CodePen's servers.<br />
		<a href="/legal">(more info)</a>
	</span>
	<iframe
		data-iframe-replace-id="${uuid}"
		class="codepen-embed__iframe"
		style="width: 100%"
		hidden
		scrolling="no"
		src=""
		data-src="${content}?height=265&theme-id=dark"
		frameborder="no"
		allowtransparency="true"
	></iframe>
</div>
`;
	return result;
};
