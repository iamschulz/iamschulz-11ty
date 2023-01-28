const imageToShortCode = require("../_helpers/imageToShortCode");
const codepenToShortCode = require("../_helpers/codepenToShortCode");
const youtubeToShortCode = require("../_helpers/youtubeToShortCode");
const escapeNjk = require("../_helpers/escapeNjk");

let contentMdString = `
# Colors
<div style="display:grid;  grid-template-columns: repeat(auto-fill, minmax(18ch, 1fr));gap:var(--spacing-x);font-family:var(--mono-font);">
    <div style="color:var(--fg-color);background-color:var(--base-color);width:18ch;height:18ch;border:2px solid var(--fg-color);padding:1ch;">--base-color</div>
    <div style="color:var(--base-color);background-color:var(--fg-color);width:18ch;height:18ch;border:2px solid var(--fg-color);padding:1ch;">--fg-color</div>
    <div style="color:var(--fg-color);background-color:var(--accent-color);width:18ch;height:18ch;border:2px solid var(--fg-color);padding:1ch;">--accent-color</div>
    <div style="color:var(--base-color);background-color:var(--pop-color);width:18ch;height:18ch;border:2px solid var(--fg-color);padding:1ch;">--pop-color</div>
    <div style="color:var(--base-color);background-color:var(--grey);width:18ch;height:18ch;border:2px solid var(--fg-color);padding:1ch;">--grey</div>
    <div style="color:var(--fg-color);background-color:var(--grey-fade);width:18ch;height:18ch;border:2px solid var(--fg-color);padding:1ch;">--grey-fade</div>
</div>

---

# Fonts

<span style="font-size:var(--small-font-size)">Sans Serif, small</span>

<span style="font-size:var(--base-font-size)">Sans Serif, base</span>

<span style="font-size:var(--base-font-size);font-family:var(--mono-font)">Monospace, base</span>

<span style="font-size:var(--large-font-size)">Sans Serif, large</span>

<span style="font-size:var(--large-font-size);font-family:var(--headline-font);">Blank River, large</span>

<span style="font-size:var(--x-large-font-size)">Sans Serif, x-large</span>

<span style="font-size:var(--x-large-font-size);font-family:var(--headline-font);">Blank River, x-large</span>

---

# Headlines
<h2>h2</h2>
<h3>h3</h3>
<h4>h4</h4>
<h5>h5</h5>
<h6>h6</h6>

---

# Text

Bacon ipsum dolor amet drumstick ham hock beef ribs rump. Boudin rump tail, pork buffalo short loin tongue jerky strip steak landjaeger bacon andouille. Chicken leberkas short loin sirloin. Tongue meatloaf short ribs ball tip short loin filet mignon salami.

Short ribs andouille pork belly ground round fatback strip steak kielbasa buffalo bacon short loin, sirloin drumstick bresaola ribeye doner. Chuck pastrami prosciutto, brisket capicola shank short ribs. Tongue ball tip ham, fatback short loin frankfurter picanha spare ribs rump capicola meatloaf. Spare ribs sausage shoulder, drumstick corned beef tail short ribs ground round. Leberkas pancetta pork chop turducken strip steak swine t-bone.

Cupim bresaola leberkas bacon venison. Jowl cupim alcatra ribeye rump. Andouille landjaeger biltong meatball tongue prosciutto spare ribs pork chop shankle sirloin tail strip steak shoulder corned beef leberkas. Chislic biltong chuck fatback, filet mignon t-bone brisket shankle tenderloin picanha prosciutto drumstick landjaeger rump boudin. Tenderloin pork filet mignon ribeye shankle, rump brisket short ribs jowl buffalo strip steak.

---

# Clickables

[Normal Link](/styleguide/)

[External Link](https://theuselessweb.com/)

<button>Button</button>

---

# Embeds

Codepen
[embed](https://codepen.io/ricardoolivaalonso/pen/mdbGvmr)

Youtube
[image](https://www.youtube.com/watch?v=6-t5LHTjDk0)

---

# Code
\`\`\`scss
:root {
	--theme-hue: 190deg;
	--theme-lit: 95%;
	--theme-sat: clamp(0%, calc(45% - var(--theme-lit)), 30%);
	--theme-hue-accent: 330deg;
}
\`\`\`

\`\`\`js
#!/usr/bin/env node

const watchFlag = process.argv.indexOf("--watch") > -1;

require("esbuild")
	.build({
		entryPoints: ["src/ts/main.ts", "src/ts/sw.ts"],
		bundle: true,
		outdir: "public",
		watch: watchFlag,
	})
	.catch(() => process.exit(1));
\`\`\`

Here's some \`inline code\` for you.

---

# Lists
- Never gonna give you up
- Never gonna let you down
- Never gonna run around and hurt you

1. Never gonna make you cry
2. Never gonna say goodbye
3. Never gonna tell a lie and hurt you

---

# Tables

|Tic |Tac | Toe|
--- | --- | ---|
|X|O|X|
|X|X|O|
|O|O| |

---

# Quotes
> F is for friends, right by your side I stand.<br>
> U is for you and me, gonna stay that way 'til the end.<br>
> N is for nothing ever come between us, yeah.<br>
> And if you ever need someone to lean on, I'll be there.<br>

(Spongebob Squarepants)
`;

contentMdString = escapeNjk(contentMdString); // unescaping is in render shortcode
contentMdString = imageToShortCode(contentMdString);
contentMdString = codepenToShortCode(contentMdString);
contentMdString = youtubeToShortCode(contentMdString);

module.exports = () => {
	return [
		{
			id: 1,
			title: "Styleguide",
			content: contentMdString,
			excerpt: "This is a styleguide.",
			excerptPlain: "This is a styleguide.",
			cover: null,
			coverAlt: "",
			date: null,
			language: null,
			devId: null,
			canonical: null,
			ignoreComments: null,
			disableReactions: true, // todo: doesnt work
		},
	];
};
