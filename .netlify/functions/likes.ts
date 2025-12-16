import { getStore } from "@netlify/blobs";
import type { Handler } from "@netlify/functions";

type LikesData = {
	count: number;
};

const STORE_NAME = "likes-store";

export default async function (request: Request) {
	const url = new URL(request.url);
	const page = url.searchParams.get("page");

	if (!page) {
		return new Response(
			JSON.stringify({ error: "Missing page parameter" }),
			{ status: 400 }
		);
	}

	const store = getStore("likes-store");
	const current = (await store.get(page, { type: "json" })) as {
		count: number;
	} | null;

	const count = current?.count ?? 0;

	if (request.method === "POST") {
		const updated = { count: count + 1 };
		await store.setJSON(page, updated);

		return new Response(JSON.stringify(updated), { status: 200 });
	}

	return new Response(JSON.stringify({ count }), { status: 200 });
}
