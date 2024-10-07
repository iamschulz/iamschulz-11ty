import * as dotenv from "dotenv";
import { Client } from "@notionhq/client";
import { NotionToMarkdown } from "notion-to-md";
import { fetchNotionBlocks } from "../_helpers/fetchNotionBlocks.js";
import { imageToShortCode } from "../_helpers/imageToShortCode.js";
import { codepenToShortCode } from "../_helpers/codepenToShortCode.js";
import { youtubeToShortCode } from "../_helpers/youtubeToShortCode.js";
import * as EleventyFetch from "@11ty/eleventy-fetch";
import { markdownToTxt } from "markdown-to-txt";
import { getCacheDuration } from "../_helpers/getCacheDuration.js";
import { escapeNjk } from "../_helpers/escapeNjk.js";

dotenv.config({ path: "./config" });

export async function blogs() {
	if (process.env.OFFLINE) {
		return [];
	}

	const notion = new Client({
		auth: process.env.NOTION_KEY,
	});
	const n2m = new NotionToMarkdown({ notionClient: notion });

	const fetchDbBenchmark0 = performance.now();
	const db = await EleventyFetch(`https://api.notion.com/v1/databases/${process.env.NOTION_BLOG_ID}/query`, {
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
	const fetchDbBenchmark1 = performance.now();
	console.log("fetched blogs db in", fetchDbBenchmark1 - fetchDbBenchmark0);

	const getContent = async (blocks) => {
		const mdblocks = await n2m.blocksToMarkdown(blocks);
		const dividerIndex = mdblocks.findIndex((x) => x.type === "divider");
		const excerptBlocks = dividerIndex >= 0 ? mdblocks.slice(0, dividerIndex) : undefined;

		let excerptMdString = undefined;
		if (excerptBlocks) {
			excerptMdString = n2m.toMarkdownString(excerptBlocks).parent;
			excerptMdString = escapeNjk(excerptMdString); // unescaping is in render shortcode
			excerptMdString = imageToShortCode(excerptMdString);
			excerptMdString = codepenToShortCode(excerptMdString);
			excerptMdString = youtubeToShortCode(excerptMdString);
			mdblocks.splice(dividerIndex, 1);
		}

		const excerptPlainString = excerptMdString ? markdownToTxt(excerptMdString) : undefined;

		let contentMdString = n2m.toMarkdownString(mdblocks).parent;
		contentMdString = escapeNjk(contentMdString); // unescaping is in render shortcode
		contentMdString = imageToShortCode(contentMdString);
		contentMdString = codepenToShortCode(contentMdString);
		contentMdString = youtubeToShortCode(contentMdString);

		return {
			excerpt: excerptMdString,
			excerptPlain: excerptPlainString,
			content: contentMdString,
		};
	};

	let posts = db.results.map((result) => ({
		id: result.id,
		title: result.properties["Title"].title.pop().plain_text,
		content: undefined,
		excerpt: undefined,
		excerptPlain: undefined,
		cover: result.cover?.file?.url || result.cover?.external?.url,
		coverAlt: result.properties["Cover Alt"]?.rich_text.pop()?.plain_text || "",
		date: result.properties["Date"]?.date?.start,
		language: result.properties["Language"]?.select?.name || "EN",
		devId: result.properties["Dev ID"]?.rich_text.pop()?.plain_text,
		canonical: result.properties["Canonical"]?.url,
		ignoreComments: result.properties["Ignored Comments"]?.rich_text.pop()?.plain_text,
	}));

	posts = posts.filter((x, i) => i < 10);

	for (i = 0; i < posts.length; i++) {
		const id = posts[i].id.replaceAll("-", "");
		const skipCache = (!process.env.INCOMING_HOOK_BODY && i === 0) || process.env.INCOMING_HOOK_BODY === id; // don't cache latest or specified article
		if (skipCache) {
			console.log("skipping cache for:", posts[i].title);
		}
		const blocks = await fetchNotionBlocks(posts[i].id, [], null, skipCache, posts[i].title);
		const post = await getContent(blocks);
		posts[i].excerpt = post.excerpt;
		posts[i].excerptPlain = post.excerptPlain;
		posts[i].content = post.content;
	}

	return posts;
}
