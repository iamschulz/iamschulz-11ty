require('dotenv').config();
const { Client } = require('@notionhq/client');
const { NotionToMarkdown } = require('notion-to-md');
const imageToShortCode = require('../_helpers/imageToShortCode');
const codepenToShortCode = require('../_helpers/codepenToShortCode');

module.exports = async () => {
	const notion = new Client({
		auth: process.env.NOTION_KEY,
	});
	const n2m = new NotionToMarkdown({ notionClient: notion });

	const blockId = process.env.NOTION_BLOG_ID;
	const response = await notion.blocks.children.list({
		block_id: blockId,
	});

	const blogPosts = response.results
		.filter((x) => x.type === 'child_page')
		.map((x) => ({
			id: x.id,
			title: x.child_page.title,
			content: undefined,
			publishedAt: x.last_edited_time,
		}));

	for (i = 0; i < blogPosts.length; i++) {
		const mdblocks = await n2m.pageToMarkdown(blogPosts[i].id);

		let mdString = n2m.toMarkdownString(mdblocks);
		mdString = imageToShortCode(mdString);
		mdString = codepenToShortCode(mdString);

		blogPosts[i].content = mdString;
	}

	return blogPosts;
};
