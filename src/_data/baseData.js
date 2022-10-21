module.exports = () => ({
	pageTitle: "Daniel Schulz",
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
			active: ["art", "artPost"],
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
			label: "Source Code",
			url: "#pending",
		},
	],
});
