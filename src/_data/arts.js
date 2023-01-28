require("dotenv").config();
const { Client } = require("@notionhq/client");
const { NotionToMarkdown } = require("notion-to-md");
const imageToShortCode = require("../_helpers/imageToShortCode");
const codepenToShortCode = require("../_helpers/codepenToShortCode");
const youtubeToShortCode = require("../_helpers/youtubeToShortCode");
const EleventyFetch = require("@11ty/eleventy-fetch");
const fetchNotionBlocks = require("../_helpers/fetchNotionBlocks");
const { markdownToTxt } = require("markdown-to-txt");
const getCacheDuration = require("../_helpers/getCacheDuration");

module.exports = async () => {
	if (process.env.OFFLINE) {
		return [];
	}

	const notion = new Client({
		auth: process.env.NOTION_KEY,
	});
	const n2m = new NotionToMarkdown({ notionClient: notion });

	const db = await EleventyFetch(`https://api.notion.com/v1/databases/${process.env.NOTION_ART_ID}/query`, {
		duration: getCacheDuration().db,
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
	});

	const getContent = async (blocks) => {
		const mdblocks = await n2m.blocksToMarkdown(blocks);
		const dividerIndex = mdblocks.findIndex((x) => x.type === "divider");
		const excerptBlocks = dividerIndex >= 0 ? mdblocks.slice(0, dividerIndex) : undefined;

		let excerptMdString = undefined;
		if (excerptBlocks) {
			excerptMdString = n2m.toMarkdownString(excerptBlocks);
			excerptMdString = imageToShortCode(excerptMdString);
			excerptMdString = codepenToShortCode(excerptMdString);
			excerptMdString = youtubeToShortCode(excerptMdString);
			mdblocks.splice(dividerIndex, 1);
		}

		const excerptPlainString = excerptMdString ? markdownToTxt(excerptMdString) : undefined;

		let contentMdString = n2m.toMarkdownString(mdblocks);
		contentMdString = imageToShortCode(contentMdString);
		contentMdString = codepenToShortCode(contentMdString);
		contentMdString = youtubeToShortCode(contentMdString);

		return {
			excerpt: excerptMdString,
			excerptPlain: excerptPlainString,
			content: contentMdString,
		};
	};

	const posts = db.results.map((result) => ({
		id: result.id,
		title: result.properties["Title"].title.pop().plain_text,
		content: undefined,
		excerpt: undefined,
		excerptPlain: undefined,
		cover: result.cover?.file?.url || result.cover?.external?.url,
		coverAlt: result.properties["Cover Alt"]?.rich_text.pop()?.plain_text || "",
		date: result.properties["Date"]?.date.start,
		language: result.properties["Language"]?.select?.name || "EN",
		canonical: result.properties["Canonical"]?.url,
	}));

	for (i = 0; i < posts.length; i++) {
		const id = posts[i].id.replaceAll("-", "");
		const skipCache = (!process.env.INCOMING_HOOK_BODY && i === 0) || process.env.INCOMING_HOOK_BODY === id; // don't cache latest or specified article
		if (skipCache) {
			console.log("skipping cache for:", posts[i].title);
		}
		const blocks = await fetchNotionBlocks(posts[i].id, [], null, skipCache);
		const post = await getContent(blocks);
		posts[i].excerpt = post.excerpt;
		posts[i].excerptPlain = post.excerptPlain;
		posts[i].content = post.content;
	}

	return posts;
};
