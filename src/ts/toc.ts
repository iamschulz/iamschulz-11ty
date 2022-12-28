export class Toc {
	private el: HTMLElement;
	private container: HTMLElement;
	private sections: {
		navigation: HTMLAnchorElement;
		elements: HTMLElement[];
	}[];

	constructor() {
		const el = document.querySelector('[data-component="toc"]') as HTMLElement | null;
		const container = el?.querySelector('nav') as HTMLElement | null;

		if (!el || !container) {
			return;
		}

		this.el = el;
		this.container = container;
		this.sections = [];
		this.getSections();
		this.registerEvents();
	}

	getHeadlines(): HTMLElement[] {
		return Array.from(this.el.querySelectorAll('a')).map((link) =>
			document.querySelector(`[id="${link.getAttribute('href')?.replace('#', '') || ''}"]`)
		) as HTMLElement[];
	}

	getSections() {
		const elements = Array.from(document.querySelectorAll('.article__content > *')) as HTMLElement[];

		elements.forEach((element) => {
			if (element.matches(':is(h2, h3, h4') && element.id) {
				const navigation = this.el.querySelector(`[href="#${element.id}"]`);

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
					entry.target.setAttribute('data-in-screen', String(entry.isIntersecting));
				});
				this.highlightNavigation();
			},
			{
				threshold: 0,
				rootMargin: '-40px 0px 0px 0px',
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
					'data-highlight',
					String(section.elements.some((element) => element.matches('[data-in-screen="true"]')))
				);
			});
			this.scrollToTarget();
		});
	}

	scrollToTarget() {
		const threshold = -80;
		const last = this.sections.reverse().find((x) => x.navigation.matches('[data-highlight="true"]'))?.navigation;
		const inScreen =
			this.container.clientHeight + this.container.scrollTop > (last?.offsetTop || NaN) &&
			this.container.scrollTop + threshold < (last?.offsetTop || NaN);

		if (!last || inScreen) {
			return;
		}

		//todo: add scrolling from top/bottom
		// todo: fix bug: scroll to out-of-viewport toc, use this. soft scrolling breaks.
		this.container.scrollTo(0, last.offsetTop + last.offsetHeight + threshold);
	}
}
