module.exports = (content) => {
	content = content.replaceAll("{{", "\\{\\{");
	content = content.replaceAll("}}", "\\}\\}");
	content = content.replaceAll("{%", "\\{\\%");
	content = content.replaceAll("%}", "\\%\\}");
	return content;
};
