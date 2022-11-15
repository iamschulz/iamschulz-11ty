import { Directions } from "./Directions";
import { Item } from "./items";

export type Place = {
	name: string;
	description: string;
	directions: Directions[];
	items: Item[];
};

export const places = [
	{
		name: "town square",
		description: "a town square foo bar desc",
		directions: [
			Directions.NORTH,
			Directions.EAST,
			Directions.WEST,
			Directions.SOUTH,
		],
		items: [],
	},
] as Place[];
