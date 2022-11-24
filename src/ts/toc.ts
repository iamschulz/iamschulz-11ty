export class Toc {
	private el: HTMLElement;
	private sections: {
		navigation: HTMLAnchorElement;
		elements: HTMLElement[];
	}[];

	constructor() {
		const el = document.querySelector(
			'[data-component="toc"]'
		) as HTMLElement | null;

		if (!el) {
			return;
		}

		this.el = el;
		this.sections = [];
		this.getSections();
		this.registerEvents();
	}

	getHeadlines(): HTMLElement[] {
		return Array.from(this.el.querySelectorAll("a")).map((link) =>
			document.querySelector(
				`[id="${link.getAttribute("href")?.replace("#", "") || ""}"]`
			)
		) as HTMLElement[];
	}

	getSections() {
		const elements = Array.from(
			document.querySelectorAll(".article__content > *")
		) as HTMLElement[];

		elements.forEach((element) => {
			if (element.matches(":is(h2, h3, h4") && element.id) {
				const navigation = this.el.querySelector(
					`[href="#${element.id}"]`
				);

				this.sections.push({
					navigation: navigation as HTMLAnchorElement,
					elements: [element],
				});
			} else {
				this.sections.at(-1)?.elements.push(element);
			}
		});
	}

	registerEvents() {
		const observer = new IntersectionObserver(
			(entries) => {
				entries.forEach((entry) => {
					entry.target.setAttribute(
						"data-in-screen",
						String(entry.isIntersecting)
					);
				});
				this.highlightNavigation();
			},
			{
				threshold: 0,
				rootMargin: "-40px 0px 0px 0px",
			}
		);

		const articleElements = this.sections.map((x) => x.elements).flat();
		Object.keys(articleElements).forEach((index) => {
			observer.observe(articleElements[index]);
		});
	}

	highlightNavigation() {
		window.requestAnimationFrame(() => {
			this.sections.forEach((section) => {
				section.navigation.setAttribute(
					"data-highlight",
					String(
						section.elements.some((element) =>
							element.matches('[data-in-screen="true"]')
						)
					)
				);
			});
		});
	}
}
