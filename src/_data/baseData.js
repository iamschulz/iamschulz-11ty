module.exports = () => ({
	pageTitle: "Daniel Schulz",
	url: "https://iamschulz.com",
	meta: {
		authorName: "Daniel Schulz",
		authorEmail: "hallo@iamschulz.de",
		description: "Mostly frontend, sometimes art",
		monetization: "$ilp.uphold.com/emhMEXmNazrU",
	},
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
			label: "Icons by Font Awesome",
			url: "https://fontawesome.com/",
		},
		{
			label: "Legal",
			url: "/legal/",
		},
		{
			label: "RSS",
			url: "/index.xml",
		},
		{
			label: "Source Code",
			url: "https://github.com/iamschulz/iamschulz-11ty",
		},
	],
});
