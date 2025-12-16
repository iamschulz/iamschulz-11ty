import { getStore } from "@netlify/blobs";
import type { Handler } from "@netlify/functions";

type LikesData = {
	count: number;
};

const STORE_NAME = "likes-store";

export const handler: Handler = async (event) => {
	try {
		// Page identifier (e.g. /blog/post-1)
		const page =
			event.queryStringParameters?.page ??
			(event.body ? JSON.parse(event.body).page : null);

		if (!page) {
			return {
				statusCode: 400,
				body: JSON.stringify({ error: "Missing page parameter" }),
			};
		}

		const store = getStore(STORE_NAME);

		// Read current likes (default 0)
		const current = (await store.get(page, {
			type: "json",
		})) as LikesData | null;

		const count = current?.count ?? 0;

		// POST increments likes, GET just reads
		if (event.httpMethod === "POST") {
			const updated: LikesData = { count: count + 1 };
			await store.setJSON(page, updated);

			return {
				statusCode: 200,
				body: JSON.stringify(updated),
			};
		}

		// GET returns current likes
		return {
			statusCode: 200,
			body: JSON.stringify({ count }),
		};
	} catch (err) {
		console.error(err);

		return {
			statusCode: 500,
			body: JSON.stringify({ error: "Internal server error" }),
		};
	}
};
