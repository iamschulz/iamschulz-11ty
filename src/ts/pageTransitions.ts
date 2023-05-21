export class PageTransitions {
	animatables: HTMLElement[];
	triggers: HTMLAnchorElement[];

	constructor() {
		this.animatables = Array.from(
			document.querySelectorAll('[data-transition="true"]')
		);

		this.triggers = Array.from(
			document.querySelectorAll('[data-transition-trigger="true"]')
		);

		this.registerElementTransitions();
		this.registerFullPageTransitions();
	}

	registerElementTransitions() {
		if (!this.triggers.length) {
			return;
		}

		const observer = new IntersectionObserver(
			(entries) => {
				entries.forEach((entry) => {
					const el = entry.target as HTMLElement;
					const transitionName = el.dataset.transitionName;
					(el as HTMLElement).style.setProperty(
						"--article-header-transition",
						entry.isIntersecting ? `${transitionName}` : "none"
					);
				});
			},
			{
				threshold: 0,
				rootMargin: "-40px 0px 0px 0px",
			}
		);

		this.animatables.forEach((header) => {
			observer.observe(header);
		});
	}

	registerFullPageTransitions() {
		(
			Array.from(
				document.querySelectorAll("a[href]")
			) as HTMLAnchorElement[]
		).forEach((el) => {
			if (this.triggers.includes(el)) {
				return;
			}

			el.addEventListener("click", () => {
				document
					.querySelector('meta[name="view-transition"]')
					?.remove();
			});
		});
	}
}
