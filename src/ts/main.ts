import { ReplaceIframe } from "./replaceIframe";
import { Search } from "./search";
import { ThemeSwitch } from "./themeSwitch";
import { Toc } from "./toc";
import { Preload } from "./preload";
import { Reactions } from "./reactions";
import { Share } from "./share";
import { trackHit } from "./analytics/trackHit";
import { trackRead } from "./analytics/trackRead";
import { trackRum } from "./analytics/trackRum";
//import { TextAdventureLoader } from "./textAdventureLoader";
import { PageTransitions } from "./pageTransitions";

new PageTransitions();
new ReplaceIframe();
new ThemeSwitch();
new Toc();
new Search();
new Preload();
new Reactions();
new Share();
//new TextAdventureLoader();

trackHit();
trackRum();

const readTrigger = document.querySelector('[data-track="read"]');
readTrigger && trackRead(readTrigger);
