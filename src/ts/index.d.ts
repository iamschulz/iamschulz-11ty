type Webmention = {
	author: {
		name: string;
		url: string;
		photo: string;
	};
	content?: {
		text: string;
		html: string;
	};
	published?: string;
	"wm-received": string;
	"like-of": string;
	"repost-of": string;
	"wm-private": string;
	"wm-id": string;
	url: string;
};

type devReply = {
	type_of: string;
	id_code: string;
	created_at: string;
	body_html: string;
	user: {
		name: string;
		username: string;
		profile_image_90: string;
	};
	children: Array<any>;
};

type Reply = {
	id: string;
	avatar?: URL;
	authorName: string;
	authorUrl?: URL;
	source: URL;
	date: Date;
	content: string;
	hasReply: boolean;
};
