type Portal = {
	name: string;
	transition: string;
};

export type Place = {
	name: string;
	description: string;
	directions: {
		north?: Portal;
		east?: Portal;
		west?: Portal;
		south?: Portal;
	};
	items: string[];
	url?: URL;
};

export const places = [
	{
		name: "town square",
		description: "a town square. A Jester gives you directions.",
		directions: {
			north: {
				name: "monastery",
				transition: "you leave the town square for the monastery.",
			},
		},
		items: ["Jester"],
		url: new URL(`${location.protocol}//${location.host}`),
	},
	{
		name: "monastery",
		description: "The monastery",
		directions: {
			south: {
				name: "town square",
				transition:
					"you walk through the portal and find yourself on the town square again.",
			},
		},
		items: ["Scholar"],
		url: new URL(`${location.protocol}//${location.host}/blog/`),
	},
] as Place[];
