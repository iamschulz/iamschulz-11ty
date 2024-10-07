export function getCacheDuration() {
	return {
		db: process.env.CACHE_DB === "true" ? "7d" : "0s",
		content: process.env.CACHE_CONTENT === "true" ? "30d" : "0s",
		images: process.env.CACHE_IMAGES === "true" ? "30d" : "10m",
		articleId: null,
	};
}
