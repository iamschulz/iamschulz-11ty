export function preventMDh1(content) {
	if (content.includes("\n# ")) {
		content = content.replaceAll("\n##### ", "\n###### ");
		content = content.replaceAll("\n#### ", "\n##### ");
		content = content.replaceAll("\n### ", "\n#### ");
		content = content.replaceAll("\n## ", "\n### ");
		content = content.replaceAll("\n# ", "\n## ");
	}
	return content;
}
