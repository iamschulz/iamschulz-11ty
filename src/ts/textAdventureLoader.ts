declare global {
	interface Window {
		ta: any;
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
