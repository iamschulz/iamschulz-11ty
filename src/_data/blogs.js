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

	const getContent = async (id) => {
		const mdblocks = await n2m.pageToMarkdown(id);

		let mdString = n2m.toMarkdownString(mdblocks);
		mdString = imageToShortCode(mdString);
		mdString = codepenToShortCode(mdString);

		return mdString;
	};

	const getCover = (page) => page.cover?.file?.url || page.cover?.external?.url || undefined;

	const getDraft = (page) => page.icon?.emoji !== '✅';

	const blogPosts = response.results
		.filter((x) => x.type === 'child_page')
		.map((x) => {
			return {
				id: x.id,
				draft: undefined,
				title: x.child_page.title,
				cover: undefined,
				content: undefined,
				publishedAt: new Date(x.last_edited_time).toLocaleDateString(),
			};
		});

	for (i = 0; i < blogPosts.length; i++) {
		const page = await notion.pages.retrieve({
			page_id: blogPosts[i].id,
		});
		blogPosts[i].draft = getDraft(page);
		blogPosts[i].cover = getCover(page);
		blogPosts[i].content = await getContent(blogPosts[i].id);
	}

	return blogPosts.filter((x) => x.content && !x.draft);
};
