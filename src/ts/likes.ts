export class Likes {
	likesCount: number;
	el: HTMLElement;
	button: HTMLButtonElement;
	counter: HTMLSpanElement;
	loader: HTMLElement;
	storedLikes: {
		[key: string]: boolean;
	};
	url: string;

	constructor(likesCount = 0) {
		const el = document.querySelector('[data-component="likes"]');
		const button = el?.querySelector('[data-likes-el="button"]');
		const counter = el?.querySelector('[data-likes-el="counter"]');
		const loader = el?.querySelector('[data-likes-el="loader"]');

		if (!el || !button || !counter || !loader) {
			return;
		}

		this.likesCount = likesCount;
		this.storedLikes = JSON.parse(localStorage.getItem("likes") || "{}");
		this.el = el as HTMLElement;
		this.button = button as HTMLButtonElement;
		this.counter = counter as HTMLSpanElement;
		this.loader = loader as HTMLElement;
		this.url = window.location.href.replace(
			window.location.protocol + "//",
			""
		);

		// user has liked the article before
		if (this.storedLikes[this.url]) {
			this.button.setAttribute("disabled", "disabled");
		}

		this.registerEventListeners();

		this.enableUi();
	}

	private enableUi() {
		this.loader.setAttribute("hidden", "hidden");
		this.button.removeAttribute("hidden");
	}

	private registerEventListeners() {
		this.button.addEventListener("click", () => {
			this.addLike();
		});
	}

	private addLike() {
		this.button.classList.add("is--animated");
		this.counter.innerText = String(parseInt(this.counter.innerText) + 1);
		this.button.addEventListener("animationend", () => {
			this.persistLike();
			this.button.classList.remove("is--animated");
			this.button.setAttribute("disabled", "disabled");
		});
	}

	private persistLike() {
		this.storedLikes[this.url] = true;
		localStorage.setItem("likes", JSON.stringify(this.storedLikes));
	}
}
