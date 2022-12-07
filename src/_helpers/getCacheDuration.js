module.exports = function () {
	return {
		db: process.env.CACHE_DB ? "2m" : "7d",
		content: process.env.CACHE_CONTENT ? "2m" : "30d",
		images: process.env.CACHE_IMAGES ? "10m" : "30d",
		articleId: null,
	};
};
