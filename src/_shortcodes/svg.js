const fs = require("fs");

module.exports = function (file) {
	let relativeFilePath = `./src/${file}`;
	let data = fs.readFileSync(relativeFilePath, function (err, contents) {
		if (err) return err;
		return contents;
	});

	return data.toString("utf8");
};
