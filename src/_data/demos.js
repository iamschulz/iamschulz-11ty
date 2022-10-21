require("dotenv").config();
const { Client } = require("@notionhq/client");

module.exports = async () => {
	const notion = new Client({
		auth: process.env.NOTION_KEY,
	});

	const db = await notion.databases.query({
		database_id: process.env.NOTION_DEMO_ID,
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
	});

	const posts = db.results.map((result) => ({
		id: result.id,
		title: result.properties["Title"].title.pop().plain_text,
		content:
			result.properties["Description"]?.rich_text.pop()?.plain_text || "",
		cover: result.cover?.file?.url || result.cover?.external?.url,
		coverAlt:
			result.properties["Cover Alt"]?.rich_text.pop()?.plain_text || "",
		date: result.properties["Date"]?.date.start,
	}));

	return posts;
};
