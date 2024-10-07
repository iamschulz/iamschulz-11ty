import { getCacheDuration } from "./getCacheDuration.js";
import pkg from "@11ty/eleventy-fetch";

const { EleventyFetch } = pkg;

export const fetchNotionBlocks = async (id, blocks = [], cursor = null, skipCache = false, title = "") => {
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
	const response = await EleventyFetch(url, {
		duration: skipCache ? 0 : getCacheDuration().content,
		type: "json",
		fetchOptions,
	});

	const fetchArticleBenchmark1 = performance.now();

	if (skipCache) {
		console.log("getting article from cache", title, fetchArticleBenchmark1 - fetchArticleBenchmark0);
	} else {
		console.log("fetching article", title, fetchArticleBenchmark1 - fetchArticleBenchmark0);
	}

	blocks.push(...response.results);
	if (response.has_more) {
		blocks = await fetchNotionBlocks(id, blocks, response.next_cursor, skipCache, title);
	}
	return blocks;
};
