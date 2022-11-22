import { help } from "../help";
import { ConsoleStyles } from "./ConsoleStyles";
import { Directions } from "./Directions";
import { Logger } from "./log";
import { Place, places } from "./places";
import { Item, items } from "./items";

export class textAdventure {
	places: Place[];
	items: Item[];
	logger: Logger;
	state: {
		place: Place;
		inventory: Item[];
		lastTransition: string | null;
	};

	constructor(newGame = false) {
		this.logger = new Logger();
		this.places = places;
		this.items = items;
		this.state = {
			place: this.places[0], // first place is default
			inventory: [],
			lastTransition: null,
		};

		window.ta = {
			help: help,
			go: this.movePC.bind(this),
			inspect: this.inspect.bind(this),
			take: this.take.bind(this),
			use: this.use.bind(this),
			reset: this.resetGame.bind(this),
		};

		if (newGame) {
			help();
		} else {
			this.loadState();
			this.state.lastTransition &&
				this.logger.log(this.state.lastTransition);
			this.logger.log(`You find yourself in ${this.state.place.name}`);
		}
	}

	startGame(): void {
		help();
		console.log(
			"Now go and %cexplore this website%c!",
			ConsoleStyles.HELP,
			ConsoleStyles.DEFAULT
		);
		console.log(" ");
		this.inspect(this.state.place.name);
	}

	persistState(): void {
		sessionStorage.setItem(
			"ta",
			JSON.stringify({
				place: this.state.place.name,
				inventory: this.state.inventory.map((x) => x.name),
				lastTransition: this.state.lastTransition,
			})
		);
	}

	loadState(): void {
		const save = JSON.parse(sessionStorage.ta);
		this.state.place =
			this.places.find((x) => x.name === save.place) || this.places[0];
		this.state.inventory = save.inventory.map((x) =>
			this.items.find((y) => y.name === x.name)
		);
		this.state.lastTransition = save.lastTransition;
	}

	/**
	 * resets the game to the start state
	 */
	resetGame(): void {
		delete window.ta;
		delete sessionStorage.ta;
		console.clear();
		this.startGame();
		window.setTimeout(() => {
			this.persistState();
		}, 0);
	}

	movePC(inputDirection: Directions): void {
		// invalid inputDirection
		if (!Object.values(Directions).includes(inputDirection)) {
			this.logger.log(
				`❌ You may only go ${Object.values(Directions).join(", ")}.`
			);
			return;
		}

		// no place in this direction
		const oldPlace = this.state.place;
		const newPlace = this.places.find(
			(x) =>
				x.name.toLowerCase() ===
				oldPlace.directions[inputDirection]?.name.toLowerCase()
		);
		if (!newPlace) {
			this.logger.log(`❌ You can't go ${inputDirection} from here.`);
			return;
		}

		this.state.place = newPlace;
		this.state.lastTransition =
			oldPlace.directions[inputDirection]!.transition;
		this.logger.log("💨 " + this.state.lastTransition);
		this.inspect();
		this.persistState();

		if (newPlace.url) {
			window.location.href = newPlace.url.href;
		}
	}

	inspect(interest?: string): void {
		if (!interest) {
			this.logger.log(
				`👁️ You take a look around ${this.state.place.name}.`
			);
			this.logger.log(`👁️ ${this.state.place.description}`);
			return;
		}

		const itemName = this.state.place.items.find(
			(x) => x.toLowerCase() === interest.toLowerCase()
		);
		const item = this.items.find((x) => x.name === itemName);

		if (!item) {
			console.log(`❌ You can't find ${interest} around here.`); // don't highlight this
			return;
		}
		this.logger.log(`👁️ ${item.description}`);
	}

	take(itemName: string): void {
		const item = this.items.find(
			(x) => x.name.toLowerCase() === itemName.toLowerCase()
		);

		if (!item) {
			console.log(`❌ I don't know what ${itemName} even is.`); // don't highlight this
			return;
		}

		if (
			!this.state.place.items.some(
				(x) => x.toLowerCase() === itemName.toLowerCase()
			)
		) {
			this.logger.log(`❌ There is no ${item.name} around here.`);
			return;
		}

		if (!item.grabable) {
			this.logger.log(`❌ You can't take ${item.name}`);
			return;
		}

		this.logger.log(`👜 You take ${item.name}`);
		this.state.inventory.push(item);
	}

	use(itemName: string): void {
		const item = this.state.inventory.find(
			(x) => x.name.toLowerCase() === itemName.toLowerCase()
		);

		// todo: you should be able to use items that aren't in the inventory

		if (!item) {
			this.logger.log(`❌ You don't have ${itemName} in you inventory.`);
			return;
		}

		if (!item.interact) {
			this.logger.log(`❌ This isn't the time to use that.`);
			return;
		}

		item.interact(this);
	}
}

new textAdventure(!sessionStorage.ta);
