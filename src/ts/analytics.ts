import { init, trackPages } from "insights-js";

export class Analytics {
	constructor() {
		init("IqSjHtM7ug1TtI7F");
		trackPages();
	}
}
