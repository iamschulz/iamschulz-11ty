export function escapeNjk(content) {
	content = content.replaceAll("{{", "\\{\\{");
	content = content.replaceAll("}}", "\\}\\}");
	content = content.replaceAll("{%", "\\{\\%");
	content = content.replaceAll("%}", "\\%\\}");
	return content;
}
