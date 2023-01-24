import { textAdventure } from "./textAdventure";

export type Item = {
	name: string;
	description: string;
	interact?: (textAdventure) => void;
};

export const items = [
	{
		name: "Jester",
		description: "A Jester",
		interact: (ta: textAdventure) => {
			ta.logger.log("To the north is the monastery, to the south the tavern. The workshop is in the west.");
		},
	},
	{
		name: "Sherriff",
		description: "A Sherriff",
		interact: (ta: textAdventure) => {
			ta.logger.log("i get you to the legal page!"); // jail minigame?
			ta.teleportPC("jail");
		},
	},
	{
		name: "Scholar",
		description: "A Scholar",
		interact: (ta: textAdventure) => {
			ta.logger.log("I can give you blog articles");
			ta.places.forEach((x) => {
				console.log(x.name);
			});
		},
	},
	{
		name: "Inventor",
		description: "An Inventor",
		interact: (ta: textAdventure) => {
			ta.logger.log("I can give you demo entries");
		},
	},
	{
		name: "Artist",
		description: "An Artist",
		interact: (ta: textAdventure) => {
			ta.logger.log("I can give you art pieces");
		},
	},
	{
		name: "Drunk",
		description: "A Drunk",
		interact: (ta: textAdventure) => {
			ta.logger.log("FITE ME!!!"); // drink minigame
		},
	},
] as Item[];
