import { ReplaceIframe } from "./replaceIframe";
import { Search } from "./search";
import { ThemeSwitch } from "./themeSwitch";
import { Toc } from "./toc";
import { Preload } from "./preload";
import { Reactions } from "./reactions";
import { Share } from "./share";
import { onLCP, onFID, onCLS } from "web-vitals";
//import { TextAdventureLoader } from "./textAdventureLoader";

new ReplaceIframe();
new ThemeSwitch();
new Toc();
new Search();
new Preload();
new Reactions();
new Share();
//new TextAdventureLoader();

console.log("testing metrics...");
onLCP((lcp) => console.log("lcp", lcp));
onFID((fid) => console.log("fid", fid));
onCLS((cls) => console.log("cls", cls));
