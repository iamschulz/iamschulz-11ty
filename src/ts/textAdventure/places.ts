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
		description:
			"a town square. There's a Apple in one of the market stands.",
		directions: {
			north: {
				name: "church",
				transition: "you leave the town square for the church.",
			},
		},
		items: ["Apple", "Bench"],
		url: new URL(`${location.protocol}//${location.host}`),
	},
	{
		name: "church",
		description: "The church",
		directions: {
			south: {
				name: "town square",
				transition:
					"you walk through the portal and find yourself on the town square again.",
			},
		},
		items: [],
		url: new URL(`${location.protocol}//${location.host}/legal/`),
	},
] as Place[];
