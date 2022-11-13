import { rgbToHex } from "./rgbToHex";

export class Search {
	el: HTMLFormElement;

	constructor() {
		try {
			this.el = document.querySelector(
				'[data-component="search"]'
			) as HTMLFormElement;
		} catch (e) {
			return;
		}

		this.registerEvents();
	}

	registerEvents() {
		this.el.addEventListener("submit", (event) => {
			event.preventDefault();
			this.setTheme();
			this.el.submit();
		});
	}

	setTheme() {
		const style = getComputedStyle(document.body);
		const baseColor = rgbToHex(style.backgroundColor);
		const fgColor = rgbToHex(style.color);

		try {
			(
				document.querySelector(
					'[data-search-el="header"]'
				) as HTMLInputElement
			).value = baseColor;
			(
				document.querySelector(
					'[data-search-el="background"]'
				) as HTMLInputElement
			).value = baseColor;
			(
				document.querySelector(
					'[data-search-el="text"]'
				) as HTMLInputElement
			).value = fgColor;
			(
				document.querySelector(
					'[data-search-el="links"]'
				) as HTMLInputElement
			).value = fgColor;
			(
				document.querySelector(
					'[data-search-el="addresses"]'
				) as HTMLInputElement
			).value = fgColor;
		} catch (e) {}
	}
}
