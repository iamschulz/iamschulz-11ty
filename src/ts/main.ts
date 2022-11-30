import { ReplaceIframe } from "./replaceIframe";
import { Search } from "./search";
import { ThemeSwitch } from "./themeSwitch";
import { Toc } from "./toc";
import { Preload } from "./preload";
import { Likes } from "./likes";
//import { TextAdventureLoader } from "./textAdventureLoader";

new ReplaceIframe();
new ThemeSwitch();
new Toc();
new Search();
new Preload();

setTimeout(() => {
	new Likes(5);
}, 5000);
//new TextAdventureLoader();
