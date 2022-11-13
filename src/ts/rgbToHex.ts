export function rgbToHex(rgb): string {
	const cleanRgb = rgb.split("(")[1].split(")")[0];
	const rgbArr = cleanRgb.split(",");

	const hex = rgbArr.map(function (x) {
		//For each array element
		x = parseInt(x).toString(16); //Convert to a base16 string
		return x.length == 1 ? "0" + x : x; //Add zero if we get only one character
	});

	return `#${hex.join("")}`;
}
