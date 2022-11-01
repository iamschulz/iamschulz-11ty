export class ThemeSwitch {
	private el: HTMLElement;
	private toggle: HTMLInputElement;
	private body: HTMLBodyElement;

	constructor() {
		const el = document.querySelector('[data-component="theme-switch"]');
		const toggle = el?.querySelector("input");

		if (!toggle) {
			return;
		}

		this.el = el as HTMLElement;
		this.toggle = toggle as HTMLInputElement;
		this.body = document.body as HTMLBodyElement;
		this.registerEvents();
		this.enableUi();
	}

	private registerEvents() {
		this.toggle.addEventListener("input", () => this.setBrightness());
	}

	private setBrightness() {
		this.body.setAttribute("style", `--theme-lit: ${this.toggle.value}%`);
	}

	private enableUi() {
		this.el.removeAttribute("hidden");
	}
}
