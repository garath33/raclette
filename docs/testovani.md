# Testování

Příkaz `npm test` spustí všechno. Jednotlivé vrstvy jdou pustit zvlášť.

| Příkaz | Co hlídá |
| --- | --- |
| `npm run test:unit` | Jazyky, vzdálenost Pointů, SEO soubory, velikost assetů |
| `npm run test:smoke` | Načtení stránky, jazyk, nejbližší Point, odmítnutá poloha, aplikace Raclette Lovers |
| `npm run test:responsive` | 390, 768, 1280 a 1440 px, menu, žádný vodorovný přetok |
| `npm run test:performance` | Žádná vlastní odpověď nad 500 kB, čistá konzole, hero má prioritu, galerie je lazy |

Jedna věc má jeden test. Výpočet a texty jsou v jednotkách. Prohlížeč jen ověří, že se to na stránce projeví. Stejný scénář se nepíše dvakrát.

## Smoke

Smoke ověří, že se stránka rozběhne: nadpis, sekce, testovací pruh, pět českých vizitek, přepnutí vlajky na tři švýcarské a přepnutí do němčiny. Hero „Najít nejbližší Point“ ve stejném klepnutí spustí polohu. Aplikace `app.html` má osm karet bez mapy a polohu spouští až po klepnutí.

Poloha u Kladna vybere food truck, druhé klepnutí u Jeseníku Křížový vrch. Odkaz do Maps nemá `origin` ani `dir_action=navigate`. Záběhlice a pin u Hamerského rybníka nechají food truck; hrubý odečet řekne, že se výběr může změnit. Aktuální IP na Zličíně přebije ten pin a stránka řekne, že jde o polohu ze sítě.

Odmítnutá poloha je ve `tests/e2e/geo-denied.spec.js`. Na notebooku hláška navede k zapnutí sdílení a první klepnutí na vizitku starý pin neotevře. Bez prohlížečové polohy v aplikaci navigace startuje z IP. Na Androidu bez GPS se IP z Jeseníku nepoužije. Se zapnutou GPS na Zličíně vyhraje food truck i proti IP z Jeseníku.

## Regrese

Regrese je v jednotkových testech. Všech devět jazyků musí mít stejné klíče. Každý `data-i18n` na stránce musí mít překlad. Výběr nejbližšího Pointu a adresy vizitek mají pevné příklady. Veřejné HTML a překlady nesmí obsahovat jméno, které bylo z kontaktů vyřazené. Čekání na první odečet je 24 sekund, opakování po 3. Poptávku z formuláře skládá stránka, proto ji hlídá smoke, ne samostatný modul.

## Responsivita

Playwright otevře čtyři šířky. U každé změří, jestli stránka není širší než okno, a to i po odscrollování na kontakty. Na 390 px musí jít otevřít menu. Na 768 px je hamburger pořád vidět, zlom je 1100 px. Na 1280 px je menu rozbalené a hamburger skrytý. Po přechodu na pointy zůstane tlačítko pod bochníkem ve viewportu.

## Výkon

Dva rozpočty:

- soubory na disku, aby do repozitáře nevlezla zbytečně velká fotka
- přenos v prohlížeči, žádný vlastní soubor nad 500 kB

Písma z Google Fonts se do limitu vlastních souborů nepočítají. Hero fotka má `fetchpriority="high"`, galerie pod ohybem má `loading="lazy"`. Hláška prohlížeče `compute-pressure` přichází z vložené mapy a test ji nepočítá jako chybu stránky.

Nový test přidávej, když se objeví chyba, která už jednou utekla, a ve vrstvě, která ji umí chytit bez druhé kopie. Příklad: po záměně souřadnic přibyl jednotkový test „z Kladna je nejbližší food truck“.
