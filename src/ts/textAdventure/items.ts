import { Logger } from "./log";
import { textAdventure } from "./textAdventure";

const logger = new Logger();

export type Item = {
	name: string;
	description: string;
	interact?: (textAdventure) => void;
	grabable: boolean;
};

export const items = [
	{
		name: "Jester",
		description: "A Jester",
		grabable: false,
		interact: () => {
			logger.log("i give you directions!");
		},
	},
	{
		name: "Scholar",
		description: "A Scholar",
		grabable: false,
		interact: () => {
			logger.log("I can give you blog articles");
		},
	},
] as Item[];
