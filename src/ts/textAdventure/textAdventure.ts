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
		lastTransition: string | null;
	};

	constructor(newGame = false) {
		this.logger = new Logger();
		this.places = places;
		this.items = items;
		this.state = {
			place: this.places[0], // first place is default
			lastTransition: null,
		};

		window.ta = {
			help: help,
			go: this.movePC.bind(this),
			inspect: this.inspect.bind(this),
			interact: this.interact.bind(this),
			reset: this.resetGame.bind(this),
		};

		this.setupDynamicContent().then(() => {
			this.init(newGame);
		});
	}

	init(newGame: boolean): void {
		if (newGame) {
			help();
		} else {
			this.loadState();
			this.state.lastTransition && this.logger.log(this.state.lastTransition);
			this.logger.log(`You find yourself in ${this.state.place.name}`);
			this.state.place.on && this.state.place.on(this);
		}
	}

	startGame(): void {
		help();
		window.location.href = this.state.place.url?.href || window.location.href;
		console.log("Now go and %cexplore this website%c!", ConsoleStyles.HELP, ConsoleStyles.DEFAULT);
		console.log(" ");
		this.inspect(this.state.place.name);

		window.setTimeout(() => {
			this.persistState();
		}, 0);
	}

	persistState(): void {
		sessionStorage.setItem(
			"ta",
			JSON.stringify({
				place: this.state.place.name,
				lastTransition: this.state.lastTransition,
			})
		);
	}

	loadState(): void {
		const save = JSON.parse(sessionStorage.ta);
		this.state.place = this.places.find((x) => x.name === save.place) || this.places[0];
		this.state.lastTransition = save.lastTransition;
	}

	async setupDynamicContent() {
		const articles: Element[] = [];

		try {
			const resp = await fetch("/index.xml");
			const text = await resp.text();
			const parser = new DOMParser();
			const xmlDoc = parser.parseFromString(text, "text/xml");
			const entries = Array.from(xmlDoc.querySelectorAll("entry"));
			articles.push(...entries);
		} catch (e) {
			console.warn("Could not fetch content from RSS feed. Game experience might be a bit botched.", e);
			return;
		}

		articles.forEach((article, i) => {
			const chapter = i + 1;
			const url =
				article
					.querySelector("link")
					?.getAttribute("href")
					?.replace("https://iamschulz.com", "http://localhost:8082") // dev env
					?.replace(/\/$/, "") || ""; // remove trailing slashes
			const title = article.querySelector("title")?.textContent || "";
			const bookTitle = `Book ${chapter}`;

			// open article
			this.items.push({
				name: bookTitle,
				description: `A book with the title: ${title}`,
				interact: () => {
					this.teleportPC(window.location.href.replace(/\/$/, "") === url ? "monastery" : bookTitle);
				},
			});

			this.places.find((x) => x.name === "monastery")?.items.push(bookTitle);

			// read article
			this.places.push({
				name: bookTitle,
				description: `It's cover says: ${title}`,
				directions: {},
				items: [bookTitle],
				url: new URL(url),
			});
		});
	}

	/**
	 * resets the game to the start state
	 */
	resetGame(): void {
		delete window.ta;
		delete sessionStorage.ta;
		this.state = {
			place: this.places[0], // first place is default
			lastTransition: null,
		};
		console.clear();
		this.startGame();
		window.setTimeout(() => {
			this.persistState();
		}, 0);
	}

	movePC(inputDirection: Directions): void {
		// invalid inputDirection
		if (!Object.values(Directions).includes(inputDirection)) {
			this.logger.log(`❌ You may only go ${Object.values(Directions).join(", ")}.`);
			return;
		}

		// no place in this direction
		const oldPlace = this.state.place;
		const newPlace = this.places.find(
			(x) => x.name.toLowerCase() === oldPlace.directions[inputDirection]?.name.toLowerCase()
		);
		if (!newPlace) {
			this.logger.log(`❌ You can't go ${inputDirection} from here.`);
			return;
		}

		this.state.lastTransition = oldPlace.directions[inputDirection]!.transition;
		this.teleportPC(newPlace.name, false);
	}

	teleportPC(placeName: string, overrideTransition = true): void {
		const newPlace = this.places.find((x) => x.name.toLowerCase() === placeName.toLowerCase());

		if (!newPlace) {
			this.logger.log(`❌ You don't know where ${placeName} is.`);
			return;
		}

		if (!overrideTransition) {
			this.state.lastTransition = null;
		}

		this.state.place = newPlace;
		this.logger.log("💨 " + this.state.lastTransition);
		this.inspect();
		this.persistState();

		if (newPlace.url) {
			window.location.href = newPlace.url.href;
		}
	}

	inspect(interest?: string): void {
		if (!interest) {
			this.logger.log(`👁️ You take a look around ${this.state.place.name}.`);
			this.logger.log(`👁️ ${this.state.place.description}`);
			return;
		}

		const itemName = this.state.place.items.find((x) => x.toLowerCase() === interest.toLowerCase());
		const item = this.items.find((x) => x.name === itemName);

		if (!item) {
			console.log(`❌ You can't find ${interest} around here.`); // don't highlight this
			return;
		}
		this.logger.log(`👁️ ${item.description}`);
	}

	interact(itemName: string): void {
		const item = this.items.find((x) => {
			return x.name.toLowerCase() === itemName.toLowerCase();
		});

		const inRoom = this.state.place.items.find((x) => x.toLowerCase() === itemName.toLowerCase());

		if (!item || !inRoom) {
			this.logger.log(`❌ Can't find ${itemName}.`);
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
