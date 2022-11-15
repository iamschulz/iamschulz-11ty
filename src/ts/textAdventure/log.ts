import { ConsoleStyles } from "./ConsoleStyles";
import { Directions } from "./Directions";
import { items } from "./items";
import { places } from "./places";

type Trigger = {
	name: string;
	style: ConsoleStyles;
};

export class Logger {
	triggers: Trigger[];

	constructor() {
		this.triggers = [];

		items.forEach((item) => {
			this.triggers.push({
				name: item.name,
				style: ConsoleStyles.ITEM,
			});
		});

		places.forEach((place) => {
			this.triggers.push({
				name: place.name,
				style: ConsoleStyles.ROOM,
			});
		});

		Object.values(Directions).forEach((direction) => {
			this.triggers.push({
				name: direction,
				style: ConsoleStyles.DIRECTION,
			});
		});
	}

	public log(str: string) {
		let styles = [] as string[];
		let parsed = str;

		parsed = parsed.replace(
			new RegExp(
				this.triggers.map((trigger) => `(${trigger.name})`).join("|"),
				"gi"
			),
			(match) => {
				let format = this.triggers.filter((trigger) => {
					return trigger.name.toLowerCase() === match.toLowerCase();
				})[0].style;
				styles.push(format);
				styles.push(ConsoleStyles.DEFAULT);
				return `%c${match}%c`;
			}
		);

		console.log(parsed, ...styles);
	}
}
