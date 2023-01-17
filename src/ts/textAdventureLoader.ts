declare global {
	interface Window {
		ta:
			| {
					start: (boolean) => void;
			  }
			| {
					help: () => void;
					go: (string) => void;
					inspect: (string) => void;
					interact: (string) => void;
					reset: () => void;
			  }
			| undefined;
	}
}

export class TextAdventureLoader {
	constructor() {
		if (sessionStorage.ta) {
			this.init(false);
			return;
		}

		window.ta = {
			start: this.init,
		};

		console.log(
			"Guess what: You can play this website as a text adventure!\nType '%cta.start()%c' to play.",
			"color: lime;",
			"color: unset;"
		);
	}

	init(newGame: boolean) {
		var script = document.createElement("script");
		script.src = "/textAdventure/textAdventure.js";
		document.body.appendChild(script);
		return newGame ? "Loading text adventure..." : "";
	}
}
