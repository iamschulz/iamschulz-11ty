require("dotenv").config();
const EleventyFetch = require("@11ty/eleventy-fetch");

module.exports = async () => {
	const db = await EleventyFetch(
		`https://api.notion.com/v1/databases/${process.env.NOTION_DEMO_ID}/query`,
		{
			duration: "1d", // 1 day
			type: "json",
			fetchOptions: {
				method: "POST",
				withCredentials: true,
				credentials: "include",
				body: JSON.stringify({
					filter: {
						property: "Draft",
						checkbox: {
							equals: false,
						},
					},
					sorts: [
						{
							property: "Date",
							direction: "descending",
						},
					],
				}),
				headers: {
					Authorization: `Bearer ${process.env.NOTION_KEY}`,
					"Notion-Version": "2022-06-28",
					"Content-Type": "application/json",
				},
			},
		}
	);

	const posts = db.results.map((result) => ({
		id: result.id,
		title: result.properties["Title"].title.pop().plain_text,
		content:
			result.properties["Description"]?.rich_text.pop()?.plain_text || "",
		cover: result.cover?.file?.url || result.cover?.external?.url,
		coverAlt:
			result.properties["Cover Alt"]?.rich_text.pop()?.plain_text || "",
		date: result.properties["Date"]?.date.start,
		url: result.properties["URL"]?.url,
		screenshots: result.properties["Screenshots"].files.map(
			(image) => image.file.url
		),
	}));

	return posts;
};
