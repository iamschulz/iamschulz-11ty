module.exports = function () {
	return {
		db: process.env.CACHE_DB ? "7d" : "2m",
		content: process.env.CACHE_CONTENT ? "30d" : "2m",
		images: process.env.CACHE_IMAGES ? "30d" : "10m",
		articleId: null,
	};
};
