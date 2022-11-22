import { textAdventure } from "./textAdventure";

export type Item = {
	name: string;
	description: string;
	interact?: (textAdventure) => void;
	grabable: boolean;
};

export const items = [
	{
		name: "Apple",
		description: "A delicious Apple",
		grabable: true,
		interact: (ta: textAdventure) => {
			const appleIndex = ta.state.inventory.findIndex(
				(x) => x.name === "Apple"
			);
			ta.state.inventory.splice(appleIndex, 1);
			ta.logger.log("🍎 You eat a tasty apple.");
		},
	},
	{
		name: "Bench",
		description: "A bench to sit on",
		grabable: false,
		interact: (ta: textAdventure) => {
			ta.logger.log("🪑 You sit down.");
		},
	},
] as Item[];
