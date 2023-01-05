export class Comments {
	comments: Reply[];
	el: HTMLElement;
	template: HTMLTemplateElement;

	constructor(comments: Reply[]) {
		const el = document.querySelector('[data-component="comments"]');
		const template = document.querySelector(
			'[data-comments-el="template"]'
		);
		if (!el || !template) {
			return;
		}
		this.el = el as HTMLElement;
		this.template = template as HTMLTemplateElement;
		this.comments = comments;
		this.renderComments();
	}

	renderComments() {
		this.comments.forEach((comment) => {
			this.el.insertAdjacentHTML(
				"beforeend",
				this.createNewItem(comment)
			);
		});
		this.comments.length > 0 && this.el.removeAttribute("hidden");
	}

	createNewItem(comment: Reply) {
		let newItemHtml = this.template.innerHTML;
		newItemHtml = newItemHtml.replace("{{ id }}", comment.id);
		newItemHtml = newItemHtml.replace(
			"{{ userLink }}",
			comment.authorUrl?.href || '#'
		);
		newItemHtml = newItemHtml.replace("{{ avatar }}", comment.avatar?.href || '');
		newItemHtml = newItemHtml.replace("{{ name }}", comment.authorName);
		newItemHtml = newItemHtml.replace(
			"{{ datetime }}",
			comment.date.toString()
		);
		newItemHtml = newItemHtml.replace(
			"{{ date }}",
			comment.date.toLocaleString("de-DE", {
				dateStyle: "medium",
			})
		);
		newItemHtml = newItemHtml.replace("{{ source }}", comment.source.href);
		newItemHtml = newItemHtml.replace(
			"{{ sourceName }}",
			comment.source.hostname
		);
		newItemHtml = newItemHtml.replace("{{ content }}", comment.content);
		newItemHtml = newItemHtml.replace("{{ currentPage }}", location.href);
		newItemHtml = newItemHtml.replace(
			"{{ moreLink }}",
			comment.source.href
		);
		newItemHtml = newItemHtml.replace(
			"more-link-is--hidden",
			comment.hasReply ? "" : "is--hidden"
		);
		return newItemHtml;
	}
}
