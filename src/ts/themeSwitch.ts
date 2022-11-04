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
		const color = this.rgbToHex(
			getComputedStyle(document.body)["background"]
		);
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

	private rgbToHex(rgb) {
		const cleanRgb = rgb.split("(")[1].split(")")[0];
		const rgbArr = cleanRgb.split(",");

		const hex = rgbArr.map(function (x) {
			//For each array element
			x = parseInt(x).toString(16); //Convert to a base16 string
			return x.length == 1 ? "0" + x : x; //Add zero if we get only one character
		});

		return `#${hex.join("")}`;
	}
}
