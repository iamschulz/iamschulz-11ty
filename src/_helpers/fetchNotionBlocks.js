const EleventyFetch = require("@11ty/eleventy-fetch");
const getCacheDuration = require("./getCacheDuration");

const fetchNotionBlocks = async (
	id,
	blocks = [],
	cursor = null,
	skipCache = false
) => {
	let url = `https://api.notion.com/v1/blocks/${id}/children?page_size=100`;
	if (cursor) {
		url += `&start_cursor=${cursor}`;
	}

	const fetchOptions = {
		headers: {
			Authorization: `Bearer ${process.env.NOTION_KEY}`,
			"Notion-Version": "2022-06-28",
			"Content-Type": "application/json",
		},
	};

	const fetchArticleBenchmark0 = performance.now();

	const response = skipCache
		? await (await fetch(url, fetchOptions)).json()
		: await EleventyFetch(url, {
				duration: getCacheDuration().content,
				type: "json",
				fetchOptions,
		  });

	const fetchArticleBenchmark1 = performance.now();

	if (skipCache) {
		console.log(
			"getting article from cache",
			id,
			fetchArticleBenchmark1 - fetchArticleBenchmark0
		);
	} else {
		console.log(
			"fetching article",
			id,
			fetchArticleBenchmark1 - fetchArticleBenchmark0
		);
	}

	blocks.push(...response.results);
	if (response.has_more) {
		blocks = await fetchNotionBlocks(
			id,
			blocks,
			response.next_cursor,
			skipCache
		);
	}
	return blocks;
};

module.exports = fetchNotionBlocks;
