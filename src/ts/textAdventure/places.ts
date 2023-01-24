import { textAdventure } from "./textAdventure";
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
	on?: (textAdventure) => void;
};

export const places: Place[] = [
	{
		name: "town square",
		description: "a town square. A Jester gives you directions.",
		directions: {
			north: {
				name: "monastery",
				transition: "you leave the town square for the monastery.",
			},
			west: {
				name: "workshop",
				transition: "you leave the town square for the workshop.",
			},
			south: {
				name: "tavern",
				transition: "you leave the town square for the tavern.",
			},
		},
		items: ["Jester", "Sherriff"],
		url: new URL(`${location.protocol}//${location.host}`),
	},
	{
		name: "monastery",
		description: "The monastery. You see a scholar.",
		directions: {
			south: {
				name: "town square",
				transition: "you walk through the portal and find yourself on the town square again.",
			},
		},
		items: ["Scholar"],
		url: new URL(`${location.protocol}//${location.host}/blog/`),
	},
	{
		name: "workshop",
		description: "The workshop",
		directions: {
			east: {
				name: "town square",
				transition: "you walk through the door and find yourself on the town square again.",
			},
		},
		items: ["Inventor"],
		url: new URL(`${location.protocol}//${location.host}/demo/`),
	},
	{
		name: "tavern",
		description: "The tavern",
		directions: {
			north: {
				name: "town square",
				transition: "you walk through the door and find yourself on the town square again.",
			},
		},
		items: ["Artist", "Drunk"],
		url: new URL(`${location.protocol}//${location.host}/ta/tavern/`),
	},
	{
		name: "jail",
		description: "The jail",
		directions: {},
		items: [],
		url: new URL(`${location.protocol}//${location.host}/ta/jail/`),
	},
];
