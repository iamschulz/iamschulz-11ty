export class Likes {
	el: HTMLElement;
	button: HTMLButtonElement;
	storedLikes: {
		[key: string]: boolean;
	};
	url: string;

	constructor() {
		const el = document.querySelector('[data-component="likes"]');
		const button = el?.querySelector('[data-likes-el="button"]');

		if (!el || !button) {
			return;
		}

		this.storedLikes = JSON.parse(localStorage.getItem("likes") || "{}");
		this.el = el as HTMLElement;
		this.button = button as HTMLButtonElement;
		this.url = window.location.href.replace(
			window.location.protocol + "//",
			""
		);

		if (this.storedLikes[this.url]) {
			this.button.setAttribute("disabled", "disabled");
		}

		this.registerEventListeners();
	}

	private registerEventListeners() {
		this.button.addEventListener("click", () => {
			this.addLike();
		});
	}

	private addLike() {
		this.button.classList.add("is--animated");
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
