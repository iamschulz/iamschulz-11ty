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

	const databaseId = 'ff540d032dd4427988cab57db47b4544';
	const db = await notion.databases.query({
		database_id: databaseId,
		filter: {
			property: 'Draft',
			checkbox: {
				equals: false,
			},
		},
	});

	const getContent = async (id) => {
		const mdblocks = await n2m.pageToMarkdown(id);

		let mdString = n2m.toMarkdownString(mdblocks);
		mdString = imageToShortCode(mdString);
		mdString = codepenToShortCode(mdString);

		return mdString;
	};

	const posts = db.results.map((result) => ({
		id: result.id,
		title: result.properties['Title'].title.pop().plain_text,
		content: undefined,
		cover: result.cover?.file?.url || result.cover?.external?.url,
		coverAlt: result.properties['Cover Alt']?.rich_text.pop()?.plain_text || '',
		date: result.properties['Date']?.date.start,
		language: result.properties['Language']?.select?.name || 'EN',
		devID: result.properties['Dev ID']?.rich_text.pop()?.plain_text,
		canonical: result.properties['Canonical']?.url,
	}));

	for (i = 0; i < posts.length; i++) {
		posts[i].content = await getContent(posts[i].id);
	}

	return posts;
};
