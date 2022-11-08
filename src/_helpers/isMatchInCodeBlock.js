module.exports = (match, content) => {
	const codeBlockRegex = /```([a-z]*)\n([\s\S]*?\n)```/gm;
	codeBlockMatch = codeBlockRegex.exec(content);

	const codeSpanRegex = /`([^`^\n]+)`/g;
	codeSpanMatch = codeSpanRegex.exec(content);

	if (!codeBlockMatch && !codeSpanMatch) {
		return false;
	}

	codeBlocks = [];

	while (codeBlockMatch != null) {
		codeBlocks.push({
			start: codeBlockMatch.index,
			end: codeBlockMatch.index + codeBlockMatch[0].length,
		});
		codeBlockMatch = codeBlockRegex.exec(content);
	}

	while (codeSpanMatch != null) {
		codeBlocks.push({
			start: codeSpanMatch.index,
			end: codeSpanMatch.index + codeSpanMatch[0].length,
		});
		codeSpanMatch = codeSpanRegex.exec(content);
	}

	const isInCodeBlock = codeBlocks.some(
		(codeBlock) =>
			match.index >= codeBlock.start && match.index <= codeBlock.end
	);

	return isInCodeBlock;
};
