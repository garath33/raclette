# Testování

Příkaz `npm test` spustí všechno. Jednotlivé vrstvy jdou pustit zvlášť.

| Příkaz | Co hlídá |
| --- | --- |
| `npm run test:unit` | Jazykové klíče, vzdálenost Pointů, SEO, velikost assetů, `index.html`, styly, místní odkazy, validní HTML a CSS |
| `npm run test:smoke` | Načtení stránky, styl, jazyk, nejbližší Point, odmítnutá poloha, aplikace Raclette Lovers |
| `npm run test:responsive` | 320, 768, 1024 a 1440 px, menu, žádný vodorovný přetok |
| `npm run test:performance` | Žádná vlastní odpověď nad 500 kB, čistá konzole, hero má prioritu, galerie je lazy |
| `npm run test:languages` | Až před vydáním: všech devět jazyků se načte. V běžném `npm test` se nespouští |

Jedna věc má jeden test. Výpočet a texty jsou v jednotkách. Prohlížeč jen ověří, že se to na stránce projeví. Stejný scénář se nepíše dvakrát.

## Údržba

U každé změny se rozhodne, jestli sada potřebuje úpravu. Test, který hlídá chování, které se změnilo, se přepíše. Nový test přibude, když chyba už jednou utekla, a ve vrstvě, která ji chytí bez druhé kopie. Klíčové scénáře stačí. Stejná obrazovka se nefotí v devíti jazycích.

## Smoke

Rychlá kontrola sestavení je v jednotkách: existuje `index.html`, stránky odkazují na `css/fonts.css` a `css/styles.css`, místní `href`, `src` a `srcset` míří na soubor a kotvu, která v cíli je. Prohlížeč v smoke ověří, že odpověď je 200 a že se styl opravdu aplikoval (pozadí stránky).

Smoke dál ověří, že se stránka rozběhne: nadpis, sekce, testovací pruh, pět českých vizitek, přepnutí vlajky na tři švýcarské a přepnutí do němčiny. Hero „Najít nejbližší Point“ ve stejném klepnutí spustí polohu. Aplikace `app.html` má osm karet bez mapy a polohu spouští až po klepnutí.

Poloha u Kladna vybere food truck, druhé klepnutí u Jeseníku Křížový vrch. Odkaz do Maps nemá `origin` ani `dir_action=navigate`. Záběhlice a pin u Hamerského rybníka nechají food truck; hrubý odečet řekne, že se výběr může změnit. Aktuální IP na Zličíně přebije ten pin a stránka řekne, že jde o polohu ze sítě.

Odmítnutá poloha je ve `tests/e2e/geo-denied.spec.js`. Na notebooku hláška navede k zapnutí sdílení a první klepnutí na vizitku starý pin neotevře. Bez prohlížečové polohy v aplikaci navigace startuje z IP. Na Androidu bez GPS se IP z Jeseníku nepoužije. Se zapnutou GPS na Zličíně vyhraje food truck i proti IP z Jeseníku.

## Regrese

Regrese je v jednotkových testech. Všech devět jazyků musí mít stejné klíče. Každý `data-i18n` na stránce musí mít překlad. Výběr nejbližšího Pointu a adresy vizitek mají pevné příklady. Veřejné HTML a překlady nesmí obsahovat jméno, které bylo z kontaktů vyřazené. Čekání na první odečet je 24 sekund, opakování po 3. Poptávku z formuláře skládá stránka, proto ji hlídá smoke, ne samostatný modul.

## Responsivita

Playwright otevře 320, 768, 1024 a 1440 px. U každé změří, jestli stránka není širší než okno, a to i po odscrollování na kontakty. Na 320 px musí jít otevřít menu. Na 768 a 1024 px je hamburger pořád vidět, zlom je 1100 px. Na 1440 px je menu rozbalené a hamburger skrytý. Po přechodu na pointy zůstane tlačítko pod bochníkem ve viewportu. Krátké okno 1920×640 hlídá totéž tlačítko, když se vejde výška.

## Validace

`html-validate` (sada `standard`) a parser `css-tree` pustí jednotky. Veřejné HTML (`index.html`, `pro-partnery.html`, `app.html`) a `css/styles.css` musí projít bez hlášky. Odkaz „Navigovat k nejbližšímu“ dostane `href`, `target` a `rel` až ve chvíli, kdy stránka zná cíl. Bez `href` by `target` na `<a>` nebyl validní.

## Více jazyků

Primární verze je čeština (`?lang=cs`). Vývoj, úpravy layoutu a průběžné testy v prohlížeči jedou jen na ní. Texty jsou mimo HTML, v `js/i18n.js`, `js/i18n-extra.js`, `js/i18n-app.js` a `js/i18n-ig.js`. Při úpravě vzhledu se ty soubory neotevírají.

Jednotky pořád hlídají, že všech devět jazyků má stejné klíče a že každý `data-i18n` má překlad. To je porovnání klíčů, ne prohlížení vět.

Vizuální kontrola mutací je jednou před vydáním: `npm run test:languages`. V CI na pull requestu neběží.

## Snímky

`tests/e2e/visual.spec.js` uloží úvod a sekci pointů v češtině na šířkách z responsivity do `test-results/visual/`. Workflow CI je přiloží k běhu jako artefakt `visual-cs`. Pixelové diffy se neukládají.

## Odkazy

Nefunkční odkazy (404) hledá v pull requestu job **links** ve workflow CI, nástroj [Lychee](https://github.com/lycheeverse/lychee). Projde `index.html`, `pro-partnery.html`, `app.html`, `css/styles.css`, `css/fonts.css` a `js/points.js`. Agent v Cursoru odkazy neproklikává. Nastavení je v `.lychee.toml`.

## Výkon

Dva rozpočty:

- soubory na disku, aby do repozitáře nevlezla zbytečně velká fotka
- přenos v prohlížeči, žádný vlastní soubor nad 500 kB

Písma jsou místní soubory ve `fonts/` a do limitu 500 kB na odpověď se počítají. Hero fotka se přednačítá jako AVIF, galerie pod ohybem má `loading="lazy"`. Hláška prohlížeče `compute-pressure` přichází z vložené mapy a test ji nepočítá jako chybu stránky.

Příklad z údržby: po záměně souřadnic přibyl jednotkový test „z Kladna je nejbližší food truck“.
