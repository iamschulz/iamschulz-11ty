import { rgbToHex } from "./rgbToHex";

export class ThemeSwitch {
	private el: HTMLElement;
	private toggle: HTMLInputElement;

	constructor() {
		const el = document.querySelector('[data-component="theme-switch"]');
		const toggle = el?.querySelector("input");

		if (!toggle) {
			return;
		}

		this.el = el as HTMLElement;
		this.toggle = toggle as HTMLInputElement;
		this.registerEvents();
		this.enableUi();
	}

	private registerEvents() {
		this.toggle.addEventListener("input", () => {
			this.setBrightness();
		});

		this.toggle.addEventListener("change", () => {
			this.setColor();
		});

		this.toggle.addEventListener("dblclick", () => {
			this.reset();
		});
	}

	private setBrightness() {
		const brightness = this.toggle.value;
		document.documentElement.style.setProperty(
			"--theme-lit",
			`${brightness}%`
		);
		window.localStorage.setItem("theme-brightness", brightness);
	}

	private setColor() {
		const color = rgbToHex(getComputedStyle(document.body)["background"]);
		window.requestAnimationFrame(() => {
			(
				document.head.querySelector(
					'[name="theme-color"]'
				) as HTMLMetaElement
			).content = color;
		});
		window.localStorage.setItem("theme-color", color);
	}

	private enableUi() {
		this.el.removeAttribute("hidden");
		const lit = parseInt(
			getComputedStyle(document.documentElement).getPropertyValue(
				"--theme-lit"
			)
		).toString();
		this.toggle.setAttribute("value", lit);
	}

	private reset() {
		const defaultLit =
			window.matchMedia &&
			window.matchMedia("(prefers-color-scheme: dark)").matches
				? "8"
				: "95";
		this.toggle.value = defaultLit;
		this.toggle.dispatchEvent(new Event("input"));
		window.localStorage.removeItem("theme-color");
		window.localStorage.removeItem("theme-brightness");
	}
}
