require("dotenv").config();
const { Client } = require("@notionhq/client");
const { NotionToMarkdown } = require("notion-to-md");
const imageToShortCode = require("../_helpers/imageToShortCode");
const codepenToShortCode = require("../_helpers/codepenToShortCode");
const youtubeToShortCode = require("../_helpers/youtubeToShortCode");
const escapeNjk = require("../_helpers/escapeNjk");

module.exports = async () => {
	const notion = new Client({
		auth: process.env.NOTION_KEY,
	});
	const n2m = new NotionToMarkdown({ notionClient: notion });

	const db = await notion.databases.query({
		database_id: process.env.NOTION_BLOG_ID,
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

	const getContent = async (id) => {
		const mdblocks = await n2m.pageToMarkdown(id);
		const dividerIndex = mdblocks.findIndex((x) => x.type === "divider");
		const excerptBlocks =
			dividerIndex >= 0 ? mdblocks.slice(0, dividerIndex) : undefined;

		let excerptMdString = undefined;
		if (excerptBlocks) {
			excerptMdString = n2m.toMarkdownString(excerptBlocks);
			excerptMdString = escapeNjk(excerptMdString); // unescaping is in render shortcode
			// todo: escape code blocks, prevent markdown from rendering
			excerptMdString = imageToShortCode(excerptMdString);
			excerptMdString = codepenToShortCode(excerptMdString);
			excerptMdString = youtubeToShortCode(excerptMdString);
			mdblocks.splice(dividerIndex, 1);
		}

		let contentMdString = n2m.toMarkdownString(mdblocks);
		contentMdString = escapeNjk(contentMdString); // unescaping is in render shortcode
		if (contentMdString.includes("Rendering, again")) {
			console.log(contentMdString);
		}
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
