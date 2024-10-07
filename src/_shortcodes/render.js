import { preventMDh1 } from "../_helpers/preventMDh1.js";
import { unescapeNjk } from "../_helpers/unescapeNjk.js";

export async function render(content, eleventyConfig) {
	// escape nunjucks code in content inside data handlers
	if (!content) {
		return "";
	}
	content = await eleventyConfig.javascript.functions.renderTemplate(content, "njk");
	content = preventMDh1(content);
	content = unescapeNjk(content);
	return content;
}
