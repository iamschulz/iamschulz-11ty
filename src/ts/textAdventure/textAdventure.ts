import { help } from "../help";
import { ConsoleStyles } from "./ConsoleStyles";
import { Directions } from "./Directions";
import { Logger } from "./log";
import { Place, places } from "./places";
import { Item, items } from "./items";

class textAdventure {
	places: Place[];
	items: Item[];
	logger: Logger;
	state: {
		place: Place;
		item: Item | null;
		lastTransition: string | null;
	};

	constructor(newGame = false) {
		this.logger = new Logger();
		this.places = places;
		this.items = items;
		this.state = {
			place: this.places[0], // first place is default
			item: null,
			lastTransition: null,
		};

		window.ta = {
			help: help,
			go: this.movePC.bind(this),
			inspect: this.inspect.bind(this),
			//use: this.use.bind(this),
			//reset: this.resetGame.bind(this),
		};

		if (newGame) {
			help();
		} else {
			this.loadState();
			this.state.lastTransition &&
				this.logger.log(this.state.lastTransition);
			this.logger.log(`You find yourself in ${this.state.place.name}`);
		}

		this.inspect();
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
				item: this.state.item?.name || null,
				lastTransition: this.state.lastTransition,
			})
		);
	}

	loadState(): void {
		const save = JSON.parse(sessionStorage.ta);
		this.state.place =
			this.places.find((x) => x.name === save.place) || this.places[0];
		this.state.item = this.items.find((x) => x.name === save.item) || null;
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
			console.log(`👁️ You can't find ${interest} around here.`); // don't highlight this
			return;
		}
		this.logger.log(`👁️ ${item.description}`);
	}
}

new textAdventure(!sessionStorage.ta);
