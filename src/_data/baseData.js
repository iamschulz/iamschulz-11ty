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
			url: "/about/",
			active: ["about"],
		},
		{
			label: "blog",
			url: "/blog/",
			active: ["blog", "blogPost"],
		},
		{
			label: "projects",
			url: "/projects/",
			active: ["projects", "projectsDetail"],
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
