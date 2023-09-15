require("dotenv").config();
const { Client } = require("@notionhq/client");
const NCCLient = require("nextcloud-node-client").Client;
const { UploadFilesCommand } = require("nextcloud-node-client");
const AdmZip = require("adm-zip");
const { NotionToMarkdown } = require("notion-to-md");
const fetchNotionBlocks = require("./src/_helpers/fetchNotionBlocks");
const codepenToShortCode = require("./src/_helpers/codepenToShortCode");
const youtubeToShortCode = require("./src/_helpers/youtubeToShortCode");
const { Readable } = require("stream");
const { finished } = require("stream/promises");

const fs = require("fs");
const https = require("https");

const backupDir = "./backup";
const nextcloudDir = "blog_backup";

const checkDir = () => {
	if (fs.existsSync(backupDir)) {
		fs.rmSync(backupDir, { recursive: true, force: true });
	}
	fs.mkdirSync(backupDir, 0o744);
};

const getDb = async (id) => {
	return await fetch(`https://api.notion.com/v1/databases/${id}/query`, {
		method: "POST",
		withCredentials: true,
		credentials: "include",
		body: JSON.stringify({
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
	});
};

const getContent = async (blocks) => {
	const notion = new Client({ auth: process.env.NOTION_KEY });
	const n2m = new NotionToMarkdown({ notionClient: notion });

	const mdblocks = await n2m.blocksToMarkdown(blocks);

	let contentMdString = n2m.toMarkdownString(mdblocks);
	contentMdString = codepenToShortCode(contentMdString);
	contentMdString = youtubeToShortCode(contentMdString);

	return contentMdString;
};

const getPosts = async (id, dir) => {
	const db = await (await getDb(id)).json();

	const posts = db.results.map((result) => ({
		id: result.id,
		title: result.properties["Title"].title?.pop()?.plain_text || result.id,
		draft: result.properties["Draft"].checkbox,
		content: undefined,
		cover: result.cover?.file?.url || result.cover?.external?.url,
		coverAlt: result.properties["Cover Alt"]?.rich_text.pop()?.plain_text || "",
		date: result.properties["Date"]?.date?.start,
		language: result.properties["Language"]?.select?.name || "EN",
		devId: result.properties["Dev ID"]?.rich_text.pop()?.plain_text,
		canonical: result.properties["Canonical"]?.url,
		ignoreComments: result.properties["Ignored Comments"]?.rich_text.pop()?.plain_text,
	}));

	for (i = 0; i < posts.length; i++) {
		const blocks = await fetchNotionBlocks(posts[i].id, [], null);
		const content = await getContent(blocks);
		fs.mkdirSync(`${dir}/${posts[i].title}`, { recursive: true });
		posts[i].content = content;
		posts[i].content = await replaceImages(blocks, posts[i], dir);
		posts[i].cover = replaceCoverImage(posts[i], dir).cover;
	}

	return posts;
};

const replaceImages = async (blocks, post, dir) => {
	const filtered = blocks.filter((block) => block.type === "image");
	for (let i = 0; i < filtered.length; i++) {
		const res = await fetch(filtered[i].image.file.url);
		const fileName = new URL(filtered[i].image.file.url).pathname.split("/").at(-1);
		const fileStream = fs.createWriteStream(`${dir}/${post.title}/${fileName}`);
		const t0 = performance.now();
		await finished(Readable.fromWeb(res.body).pipe(fileStream));
		const t1 = performance.now();
		console.log(`fetching image ${fileName}`, t1 - t0);

		post.content = post.content.replace(filtered[i].image.file.url, fileName);
	}
	return post.content;
};

const replaceCoverImage = (post, dir) => {
	if (!post.cover) {
		return post;
	}
	const fileName = new URL(post.cover).pathname.split("/").at(-1);
	const file = fs.createWriteStream(`${dir}/${post.title}/${fileName}`);
	const t0 = performance.now();
	const request = https.get(post.cover, function (response) {
		response.pipe(file);

		// after download completed close filestream
		file.on("finish", () => {
			file.close();
			const t1 = performance.now();
			console.log(`fetching image ${fileName}`, t1 - t0);
		});

		file.on("error", (e) => {
			console.log(`failed to fetch image ${fileName}`, e);
		});
	});
	post.cover = fileName;
	return post;
};

const writePostMdContent = (post) => {
	let content = "";
	content += `---\n`;
	Object.keys(post).forEach((key) => {
		if (key === "content" || !post[key]) {
			return;
		}
		content += `${key}: ${post[key]}\n`;
	});
	content += `---\n\n`;
	content += post.content;
	return content;
};

backupContent = async (id, subdir = "") => {
	const dir = [backupDir, subdir].join("/");
	const posts = await getPosts(id, dir);
	posts.forEach((post) => {
		fs.writeFileSync(`${dir}/${post.title}/${post.title}.md`, writePostMdContent(post), function (err) {
			if (err) {
				return console.log(err);
			}
		});
	});
};

const compressBackup = () => {
	const zip = new AdmZip();
	const outputFile = `backup.zip`;
	zip.addLocalFolder("./backup");
	zip.writeZip(outputFile);
	console.log(`Created ${outputFile} successfully`);
};

const pushToNC = async () => {
	const client = new NCCLient();
	await client.createFolder(nextcloudDir);
	const files = [
		{
			sourceFileName: "./backup.zip",
			targetFileName: `/${nextcloudDir}/backup.zip`,
		},
	];
	const uc = new UploadFilesCommand(client, { files });
	await uc.execute();
	fs.rmSync("backup.zip");
};

initBackup = async () => {
	checkDir();
	await backupContent(process.env.NOTION_BLOG_ID, "blog");
	await backupContent(process.env.NOTION_ART_ID, "art");
	await compressBackup();
	await pushToNC();
};

initBackup();
