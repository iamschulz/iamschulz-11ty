require("dotenv").config();
const { Client } = require("@notionhq/client");
const { NotionToMarkdown } = require("notion-to-md");
const fetchNotionBlocks = require("../_helpers/fetchNotionBlocks");
const imageToShortCode = require("../_helpers/imageToShortCode");
const codepenToShortCode = require("../_helpers/codepenToShortCode");
const youtubeToShortCode = require("../_helpers/youtubeToShortCode");
const escapeNjk = require("../_helpers/escapeNjk");
const EleventyFetch = require("@11ty/eleventy-fetch");

module.exports = async () => {
	const notion = new Client({
		auth: process.env.NOTION_KEY,
	});
	const n2m = new NotionToMarkdown({ notionClient: notion });

	const db = await EleventyFetch(
		`https://api.notion.com/v1/databases/${process.env.NOTION_BLOG_ID}/query`,
		{
			duration: "1h",
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

	const getContent = async (id) => {
		const notionBlocks = await fetchNotionBlocks(id);
		const mdblocks = await n2m.blocksToMarkdown(notionBlocks);
		const dividerIndex = mdblocks.findIndex((x) => x.type === "divider");
		const excerptBlocks =
			dividerIndex >= 0 ? mdblocks.slice(0, dividerIndex) : undefined;

		let excerptMdString = undefined;
		if (excerptBlocks) {
			excerptMdString = n2m.toMarkdownString(excerptBlocks);
			excerptMdString = escapeNjk(excerptMdString); // unescaping is in render shortcode
			excerptMdString = imageToShortCode(excerptMdString);
			excerptMdString = codepenToShortCode(excerptMdString);
			excerptMdString = youtubeToShortCode(excerptMdString);
			mdblocks.splice(dividerIndex, 1);
		}

		let contentMdString = n2m.toMarkdownString(mdblocks);
		contentMdString = escapeNjk(contentMdString); // unescaping is in render shortcode
		contentMdString = imageToShortCode(contentMdString);
		contentMdString = codepenToShortCode(contentMdString);
		contentMdString = youtubeToShortCode(contentMdString);

		return {
			excerpt: excerptMdString,
			content: contentMdString,
		};
	};

	const posts = db.results.map((result) => ({
		id: result.id,
		title: result.properties["Title"].title.pop().plain_text,
		content: undefined,
		excerpt: undefined,
		cover: result.cover?.file?.url || result.cover?.external?.url,
		coverAlt:
			result.properties["Cover Alt"]?.rich_text.pop()?.plain_text || "",
		date: result.properties["Date"]?.date.start,
		language: result.properties["Language"]?.select?.name || "EN",
		devID: result.properties["Dev ID"]?.rich_text.pop()?.plain_text,
		canonical: result.properties["Canonical"]?.url,
	}));

	for (i = 0; i < posts.length; i++) {
		const post = await getContent(posts[i].id);
		posts[i].excerpt = post.excerpt;
		posts[i].content = post.content;
	}

	return posts;
};
