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

	const response = await EleventyFetch(url, {
		duration: skipCache ? 0 : getCacheDuration().content,
		type: "json",
		fetchOptions: {
			method: "GET",
			withCredentials: true,
			credentials: "include",
			headers: {
				Authorization: `Bearer ${process.env.NOTION_KEY}`,
				"Notion-Version": "2022-06-28",
				"Content-Type": "application/json",
			},
		},
	});
	blocks.push(...response.results);
	if (response.has_more) {
		blocks = await fetchNotionBlocks(id, blocks, response.next_cursor);
	}
	return blocks;
};

module.exports = fetchNotionBlocks;
