import { help } from "../help";
import { ConsoleStyles } from "./ConsoleStyles";
import { Directions } from "./Directions";
import { Item } from "./items";
import { Logger } from "./log";
import { Place, places } from "./places";

class textAdventure {
	places: Place[];
	logger: Logger;
	state: {
		place: Place;
		item: Item | null;
		lastTransition: string | null;
	};

	constructor(newGame = false) {
		this.logger = new Logger();
		this.places = places;
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
		}

		this.logger.log("You see the Town Square beneath the Northern Gate");
	}

	startGame(): void {
		help();
		console.log(
			"Now go and %cexplore this website%c!",
			ConsoleStyles.HELP,
			ConsoleStyles.DEFAULT
		);
		console.log(" ");
		//ta.inspect(this.getCurrentRoom().name);
	}

	resumeGame(): void {
		if (!sessionStorage.ta) return;

		const store = JSON.parse(sessionStorage.ta);
		this.logger.log(
			store.lastTransition
				? `💨 ${store.lastTransition}`
				: `💨 You find yourself in the mansions ${this.state.place.name}`
		);

		if (
			store.currentItem &&
			store.currentItem.url &&
			store.currentItem.url === window.location.href
		) {
			this.logger.log(`⚡ ${store.currentItem.interaction}`);
			console.log(
				"💡 Use %cta.finish()%c to go back.",
				ConsoleStyles.HELP,
				ConsoleStyles.DEFAULT
			);
		} else {
			//ta.inspect(this.state.place.name);
		}
	}

	persistState(): void {
		sessionStorage.ta = JSON.stringify({
			places: this.state.place.name,
			currentItem: this.state.item?.name || null,
			lastTransition: this.state.lastTransition,
		});
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
				`👁️ You take a look around the ${this.state.place.name}.`
			);
			this.logger.log(`👁️ ${this.state.place.description}`);
			return;
		}

		const item = this.state.place.items.find(
			(x) => x.name.toLowerCase() === interest.toLowerCase() // todo: items are only references by name
		);
		if (!item) {
			this.logger.log(`👁️ You can't find ${interest} around here.`);
			return;
		}
		this.logger.log(`👁️ ${item.description}`);
	}
}

new textAdventure(true);
