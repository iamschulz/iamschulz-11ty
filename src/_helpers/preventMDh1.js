module.exports = function (content) {
	if (content.includes("\n# ")) {
		content = content.replaceAll("\n##### ", "\n###### ");
		content = content.replaceAll("\n#### ", "\n##### ");
		content = content.replaceAll("\n### ", "\n#### ");
		content = content.replaceAll("\n## ", "\n### ");
		content = content.replaceAll("\n# ", "\n## ");
	}
	return content;
};
