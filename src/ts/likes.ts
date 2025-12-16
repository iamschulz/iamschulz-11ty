export class Likes {
	likesCount: number;
	el: HTMLButtonElement;
	counter: HTMLSpanElement;
	storedLikes: {
		[key: string]: boolean;
	};
	url: string;

	constructor(likesCount = 0) {
		const el = document.querySelector('[data-component="likes"]');
		const counter = el?.querySelector('[data-likes-el="counter"]');

		if (!el || !counter) {
			return;
		}

		this.likesCount = likesCount;
		this.storedLikes = JSON.parse(localStorage.getItem("likes") || "{}");
		this.el = el as HTMLButtonElement;
		this.counter = counter as HTMLSpanElement;
		this.url = window.location.href.replace(
			window.location.protocol + "//",
			""
		);

		// user has liked the article before
		if (this.storedLikes[this.url]) {
			this.el.setAttribute("disabled", "disabled");
		}

		this.registerEventListeners();

		this.enableUi();
	}

	private enableUi() {
		this.counter.innerText = String(this.likesCount);
		this.el.removeAttribute("hidden");
	}

	private registerEventListeners() {
		this.el.addEventListener("click", () => {
			this.addLike();
		});
	}

	private addLike() {
		this.el.classList.add("is--animated");
		this.counter.innerText = String(parseInt(this.counter.innerText) + 1);
		this.el.addEventListener("animationend", () => {
			this.persistLike();
			this.el.classList.remove("is--animated");
			this.el.setAttribute("disabled", "disabled");
		});
	}

	private async persistLike() {
		const currentUrl = encodeURIComponent(window.location.href.replace(
			window.location.protocol + "//",
			""
		));

		await fetch(`/.netlify/functions/likes?page=${currentUrl}`, {
			method: "POST",
		});
	}
}
