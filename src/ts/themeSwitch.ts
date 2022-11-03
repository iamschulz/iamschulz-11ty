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
			this.setColor();
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
		const color = getComputedStyle(document.body)["background"];
		(
			document.head.querySelector(
				'[name="theme-color"]'
			) as HTMLMetaElement
		).content = color;
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
}
