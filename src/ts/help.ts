import { ConsoleStyles } from "./textAdventure/ConsoleStyles";

export function help() {
	console.log("💡 %cHey! Listen!", ConsoleStyles.HELP);
	console.log(
		"You are in Text Adventure mode. That means you can navigate this site as if it were an early computer game."
	);
	console.log("It's probably full of bugs and I don't care.");
	console.log(
		"It's written in javascript, so every command is a js command. Here is what you can do:"
	);
	console.log(
		'• Move around the game world by using %cta.go("%cDirection%c")%c. You can go to all four cardinal directions. Directions are marked in %csalmon%c.',
		ConsoleStyles.HELP,
		ConsoleStyles.DIRECTION,
		ConsoleStyles.HELP,
		ConsoleStyles.DEFAULT,
		ConsoleStyles.DIRECTION,
		ConsoleStyles.DEFAULT
	);
	console.log(
		'• Inspect an item or room by using %cta.inspect("%cItem%c")%c to get more information on it. Items are marked in %cgreen%c and rooms are %cblue%c.',
		ConsoleStyles.HELP,
		ConsoleStyles.ITEM,
		ConsoleStyles.HELP,
		ConsoleStyles.DEFAULT,
		ConsoleStyles.ITEM,
		ConsoleStyles.DEFAULT,
		ConsoleStyles.ROOM,
		ConsoleStyles.DEFAULT
	);
	console.log(
		'• Use an item by using %cta.use("%cItem%c")%c. Note that not all items are usable.',
		ConsoleStyles.HELP,
		ConsoleStyles.ITEM,
		ConsoleStyles.HELP,
		ConsoleStyles.DEFAULT
	);
	console.log(
		"• Finish using an item by calling %cta.finish()%c. You don't need to do that for all items, though.",
		ConsoleStyles.HELP,
		ConsoleStyles.DEFAULT
	);
	console.log(
		"• %cta.reset()%c resets the game to the start. In case you're lost or just want to go back.",
		ConsoleStyles.HELP,
		ConsoleStyles.DEFAULT
	);
	console.log(
		"• %cta.help()%c displays this message.",
		ConsoleStyles.HELP,
		ConsoleStyles.DEFAULT
	);
}
