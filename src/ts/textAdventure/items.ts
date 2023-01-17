import { Logger } from "./log";
import { textAdventure } from "./textAdventure";

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
		interact: (ta: textAdventure) => {
			ta.logger.log("To the north is the monastery, to the south the tavern. The workshop is in the west.");
		},
	},
	{
		name: "Sherriff",
		description: "A Sherriff",
		grabable: false,
		interact: (ta: textAdventure) => {
			ta.logger.log("i get you to the legal page!"); // jail minigame?
			ta.teleportPC("jail");
		},
	},
	{
		name: "Scholar",
		description: "A Scholar",
		grabable: false,
		interact: (ta: textAdventure) => {
			ta.logger.log("I can give you blog articles");
		},
	},
	{
		name: "Inventor",
		description: "An Inventor",
		grabable: false,
		interact: (ta: textAdventure) => {
			ta.logger.log("I can give you demo entries");
		},
	},
	{
		name: "Artist",
		description: "An Artist",
		grabable: false,
		interact: (ta: textAdventure) => {
			ta.logger.log("I can give you art pieces");
		},
	},
	{
		name: "Drunk",
		description: "A Drunk",
		grabable: false,
		interact: (ta: textAdventure) => {
			ta.logger.log("FITE ME!!!"); // drink minigame
		},
	},
] as Item[];
