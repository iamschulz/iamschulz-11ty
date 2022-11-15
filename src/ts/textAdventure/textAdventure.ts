import { help } from "../help";
import { Logger } from "./log";
import { Place, places } from "./places";

class textAdventure {
	places: Place[];
	logger: Logger;

	constructor(newGame = false) {
		this.logger = new Logger();
		this.places = places;

		if (newGame) {
			help();
		}

		this.logger.log("You see the Town Square beneath the Northern Gate");
	}
}

new textAdventure(true);
