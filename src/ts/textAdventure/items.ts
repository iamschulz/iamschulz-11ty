import { Directions } from "./Directions";

export type Item = {
	name: string;
	description: string;
	observe: string;
	interact?: () => void;
};

export const items = [
	{
		name: "Apple",
		description: "A delicious Apple",
		observe: "It's green",
	},
] as Item[];
