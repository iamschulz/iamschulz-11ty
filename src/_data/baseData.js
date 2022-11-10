module.exports = () => ({
	pageTitle: "Daniel Schulz",
	authorName: "Daniel Schulz",
	authorEmail: "hallo@iamschulz.de",
	meta: [
		{
			name: "description",
			content: "and this is my website",
		},
		{
			name: "google-site-verification",
			content: "YXi9gLgXdTu-0XVP6VAzIPmczJgpXBACJPYcfyjr7bY",
		},
		{
			name: "monetization",
			content: "$ilp.uphold.com/emhMEXmNazrU",
		},
	],
	mainNavigation: [
		{
			label: "about",
			url: "/",
			active: [""],
		},
		{
			label: "blog",
			url: "/blog/",
			active: ["blog", "blogPost"],
		},
		{
			label: "demo",
			url: "/demo/",
			active: ["demo"],
		},
		{
			label: "art",
			url: "/art/",
			active: ["art", "artPiece"],
		},
	],
	footerNavigation: [
		{
			label: "Legal",
			url: "/legal/",
		},
		{
			label: "RSS",
			url: "/rss/",
		},
		{
			label: "Blog Roll",
			url: "/blogroll/",
		},
		{
			label: "Source Code",
			url: "https://github.com/iamschulz/iamschulz-11ty",
		},
	],
});
