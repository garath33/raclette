# Rozhodnutí a opravy

Krátký záznam, aby se stejná chyba neopakovala.

## Veřejný text neříká, koho jsme vyřadili

V první verzi kontaktů bylo napsané, že Veronika v seznamu není. To na web nepatří. Veřejná stránka uvádí jen lidi, kteří v týmu jsou. Regresní test teď prohledá HTML i všechny překlady a selže, když se jméno Veronika objeví znovu.

## Adresa se nevymýšlí

U Špindlerova Mlýna a food trucku nebyla ulice. Mapa ukazuje střed střediska a Kladno a text to říká. Křížový vrch má adresu z webu hotelu.

## Test není ostrý web

Testovací adresa po sloučení do `main` je `https://garath33.github.io/raclette/`. Má `noindex` a viditelný pruh. GitHub Pages jde jen z `main`.

Větev se zkouší dřív, na náhledu Cloudflare Workers. Adresa je v [pipeline](pipeline.md). U každé úpravy, kterou má autor projet sám, se ten odkaz pošle v odpovědi. Nestačí odkaz na pull request.

Ostrý web je Cloudflare Worker `raclette` na `raclettelovers.cz` / `.sk` / `.ch`. Dřívější workflow Deploy production po testech dělal `exit 1` s textem, že hosting není připojený — to už neplatí a mástilo to při merge. Po sloučení do `main` teď běží Pages (test) i `wrangler deploy` (ostrý Worker), pokud je v Actions secret `CLOUDFLARE_API_TOKEN`.

## hreflang jen na živé adresy

Budoucí domény `raclettelovers.*` se do SEO značek nedávají, dokud neodpovídají. Jinak by vyhledávač dostal odkazy do prázdna.

## Písmo z charty

Charta předepisuje Luthier a Open Sans. Open Sans je na webu. Luthier v podkladech jako soubor písma není, proto jsou nadpisy v Cormorant Garamond. Písmo se nestahuje z cizího úložiště.

## Chyba, která dostala test

Když se poloha spletla, stránka uměla ukázat špatný Point bez toho, aby si toho někdo všiml. Test „z Kladna je food truck, z Jeseníku je Křížový vrch“ to drží.

## Franchise bez vymyšlených podmínek

Veřejné podklady říkají, jak spolupráce začíná: ozvat se, domluvit schůzku a projít možnosti od částečné po kompletní spolupráci. Stará stránka Raklet Party zvala větou „Nalákejte své zákazníky na pravý raclette“. Tohle slovo na webu není. Úvod spolupráce bere větu z B2B letáku. Historie popisuje Point jako koncept spolupráce po ohlasech subdodávek a jmenuje partnera Raclette Republic.

Sekce Pro partnery (dřív Spolupráce) teď sleduje strukturu B2B letáku, ne jeden zhuštěný odstavec na téma. Úvod říká zážitek bez statisícových investic a bez šéfkuchaře, prémiový koncept s novými hosty a vyšší útratou, a tři provozní body (8 až 16 porcí, nulové úpravy, Swiss AOP z Valais). Dál jsou čtyři přínosy, tři formáty s „pro koho“ a plochou, čtyři principy partnerství, čtyři body podpory a čtyři kroky. Věta o spolupráci od částečné po kompletní v letáku není, na webu zůstává u shop-in-shop, protože starší podklad ji má a leták ji neruší. Stejně zůstává zmínka o schůzce, Pavlíně Otýpkové a referenci Raclette Republic. Leták jmenuje Eddyho Baillifarda a případnou další českou nebo slovenskou osobnost u slavnostního startu, sýry Barry, divoký pepř a Vacherin Fribourgeois, certifikaci Raclette Master a zařazení na mapu, web a do aplikace. Konkrétní částka, procento ani délka smlouvy v letáku nejsou, proto je stránka neuvádí. Slovo nalákat na webu není. V letáku je u mobilního formátu slovo Foodrack; na webu je food truck, protože tak se vozidlo jmenuje i u Pointu v Kladně. Překlep „Valis“ a „8 druhý“ se na web nepřenáší: je to Valais a sýr s osmi druhy divokého pepře. Regresní test hlídá schůzku, rozsah od částečné po kompletní, zákaz vymyšlené částky, útratu, Raclette Lovers, Vacherin, Raclette Master a zmínku Eddyho Baillifarda. Překlady kvůli tomu narostly, proto je strop `js/i18n.js` 62 kB a `js/i18n-extra.js` 128 kB. Přenosový limit 500 kB na vlastní soubor se nemění.

## Navigace říká Pro partnery

„Spolupráce“ v menu bylo moc obecné. Pro budoucí provozovatele Pointu je jasnější „Pro partnery“ (a stejný smysl v ostatních jazycích). Sekční kicker a odkazy z výhod to kopírují.

## Pro partnery je vlastní stránka

Na hlavní stránce zůstává jen teaser „Proč s námi spolupracovat“ až po CTA. Celá nabídka (formáty, Partnerství a srdce, Co od nás získáte, Jak začít, formulář) je na `pro-partnery.html`. Horní lišta Pro partnery i CTA z hero/výhod tam míří. Partnerství a srdce, Co od nás získáte a Jak začít mají odlišný layout s barvami z charty mlékárny. Ostrý Worker na Cloudflare servíruje stránku i jako `/pro-partnery` (bez `.html`). Workflow Deploy production ověřuje formulář na `/pro-partnery`, ne na homepage.

## Laiterie zůstává vlastní jméno, mlékárna je překlad

Oficiální značka je Laiterie d’Orsières. V češtině a slovenštině u prvního zmínění dává smysl doplnit obecné slovo „mlékárna / mliekareň“, aby bylo jasné, o jaký podnik jde. Samotné „Laiterie“ se nepřekládá pryč (stejně jako se nepřekládá název sýra). V popisných větách („značka mlékárny“, „vztahy s mlékárnou“) už obecné slovo bylo a zůstává.

## AOP má krátké vysvětlení

U nabídky pro partnery je edukační odstavec: AOP = chráněné označení původu, u sýra záruka místa i postupu. Není to marketingová nálepka.

## Telefon nad formulářem

Nad kontaktním formulářem je výzva vyplnit formulář nebo zavolat na +420 777 600 223.

## raclettelovers.com je první vlastní doména

Čtyři záznamy A u WebHouse míří na GitHub Pages (`185.199.108.153` až `185.199.111.153`). Parkovací adresa `86.110.243.202` je pryč. `www` je CNAME na `garath33.github.io`, apex se na `www` přesměrovává. `.cz`, `.sk` a `.ch` běží na Cloudflare Workeru. 8. října 2026 se na těchto čtyřech obsahových adresách zapnulo indexování: zdrojové HTML má `index, follow` a kanonické adresy vedou na doménu jazyka. Aliasové domény zůstávají 301 a samostatně se neindexují. `github.io` a localhost mají pruh a `noindex` dál. Bez uloženého jazyka se na `.com` otevře angličtina, jinak vyhrává jazyk zařízení a potom koncovka domény.

## Hlava krávy patří k mlékárně, ne na fotku sýra

Barevná hlava krávy je designová značka mlékárny z Valais. Na hero fotce sýra už není překrytá jako nálepka. Spolu se znakem La Laiterie d’Orsières je v pruhu dodavatele a ve footeru. Test hlídá poměr hlavy a to, že layout na mobilu, tabletu i desktopu nepřetéká.

## Hláška mapy není chyba stránky

Výkonnostní test jednou spadl na větě `Permissions policy violation: compute-pressure`. Stránka ji nevypisuje, pochází z vloženého Google Maps. Test ji teď přeskakuje, stejně jako chybějící favicon. Ostatní chyby v konzoli pořád test shodí.

## Druhé klepnutí na polohu bere nový odečet

První verze testu nechala mezi Kladnem a Jeseníkem starou polohu, protože prohlížeč směl minutu použít cache (`maximumAge`). Nové klepnutí na „Použít mou polohu" proto vždy žádá čerstvý odečet.

## Navigace nebere zmraženou GPS z prohlížeče

Prohlížečová poloha slouží jen k výběru nejbližšího Pointu a k výpočtu vzdálenosti. Odkaz do Google Maps má jen cíl (`destination`), bez `origin` s jednorázovým odečtem. Jinak Maps startoval z nepřesného pinu (Wi-Fi / timeout) místo z místa, kde člověk sedí. Živý start necháme na Google Maps (`dir_action=navigate`). Po úspěšném odečtu je tlačítko „Navigovat k …“. Když GPS selže timeoutem, zkusí se ještě jeden odečet bez vysoké přesnosti.

## Notebook v Záběhlicích neukáže ulici, výběr Pointu drží

Trenčínská 2628/10 v Záběhlicích je 50.045505, 14.4731025. Prohlížeč na notebooku bez GPS (Wi-Fi) v Google Maps ukázal start o 1,14 km severovýchodně, u Hamerského rybníka (50.0518466, 14.4857067). To není souřadnice z webu: odkaz do Maps cíl jen předá a pin „Vaše poloha“ si doplní Google. Vzdušná vzdálenost z Trenčínské na food truck v Kladně je asi 29 km, do Špindlerova Mlýna asi 110 km, na Křížový vrch asi 197 km. Stejné pořadí vychází i z pinu u rybníka. Odchylka o kilometr výběr neotočí, dokud je další Point o desítky kilometrů dál. Jízda kolem 47 km po D6 je silniční trasa, ne chyba výběru. Když prohlížeč sám hlásí přesnost horší než 300 m a odstup druhého Pointu je větší než dvojnásobek té přesnosti, stránka řekne, že pin může sedět o ulici vedle a že výběr platí. Když by chyba mohla pořadí otočit, řekne, ať se poloha zkusí znovu venku. Hláška je ve všech devíti jazycích, proto strop `js/i18n-extra.js` posouvá z 156 kB na 158 kB.

## Texty z letáku o raclette

Leták „Co je raclette“ a „Raclette půjčovna na víkend“ je na webu rozdělený po sekcích, ne vložený jako jedna stránka. Definice, slovo racler, pastviny, podávání, fondue, oblasti výroby a čísla z mléka jsou v sekci Co je raclette. Víkendová půjčovna je odstavec u e-shopu, příležitosti (kolaudace, brunch, banket, promoce) jsou u eventů, partneři TTM, Raclette House a Provins jsou pod nákupem. Martin Kábrt a Eliška Reine přibyli do kontaktů s telefony z letáku.

Překlepy se nepřenášejí: brunch, ne branch, kolaudace, ne koloudace, plnotučné, ne pinotučné, Savojsko, ne Savoyen jako jediný tvar v češtině. Věta „náš výrobní závod“ na webu není. Sýr vozíme z mlékárny Laiterie d’Orsières, závod nám nepatří. Roční spotřeba v letáku vychází 2 kg × 9 milionů jako 36 milionů kilogramů. Na webu je 18 milionů kilogramů, protože to z těch dvou čísel plyne. Pavlína zůstává Otýpková, +420 777 600 223 a info@rakletparty.cz. Leták má jiné číslo a jiný e-mail, oficiální kontakt firmy se kvůli tomu nemění. Milan zůstává český král a ambasador, ne švýcarský král.

## E-shop Raklet Party prodává sortiment, ne jen odkaz

Sekce Kde nakoupit drží sortiment e-shopu v jedné kartě E-shop Raklet Party: krátká věta, která zve podívat se na e-shop, a odrážky se sýry, grily, grily TTM na míru, kořením, půjčovnou, víny, fondue a Family WOOD. Family WOOD je značka praktických dřevěných výrobků na míru s řemeslnou elegancí. Katalog ani text značky neříká, že nově dělají rakletovací stoly, proto to web neříká. Bez cen a bez dlouhých popisů. Slovo nalákat na webu není.

## Pět dalších Pointů má adresu z webu podniku

K vizitkám přibyly Raclett'House Chez Eddy (Route de Valbord 55, 1934 Bruson), Laiterie d’Orsières (Route du Grand Saint-Bernard 3, 1937 Orsières), Laiterie du Mouret (Route de la Gruyère 6, 1724 Ferpicloz), Kavárna U modrého zvonku a Bonté sýry (Husovo náměstí 78/6, 266 01 Beroun). Telefon a web jsou ze stejné stránky. Kontaktní jméno z podkladu na vizitce není, formát Pointu zůstává název, místo, adresa, krátká věta, telefon a web. U kavárny v Opavě ulice na stránce kavárny není. Masarykova třída 342/39, 746 01 Opava je adresa minoritského kláštera se stejným webem a telefonem. Souřadnice sedí na tu adresu v mapě, ne na střed města.

Bonté v Berouně je ze Záběhlic jen asi o 1,2 km dál než food truck v Kladně. Přesný odečet pořád vybere Kladno. Odečet s chybou kolem kilometru už pořadí může otočit, proto stránka řekne, že se výběr může změnit. Dřívější věta, že odchylka o kilometr výběr nemění, platila, dokud byl další Point o desítky kilometrů dál. Texty jsou ve všech devíti jazycích a sedí na znění o autentickém švýcarském raclette, proto strop `js/i18n-extra.js` posouvá ze 176 kB na 178 kB.

## Pro partnery na ostrém webu

Schválení „Hod na ostrý web“ posílá Pro partnery, telefon nad formulářem, vysvětlení AOP a znění mlékárny Laiterie d’Orsières na `raclettelovers.*` (bez zkušebního pruhu) a na GitHub Pages. Cloudflare Worker potřebuje v `wrangler.jsonc` prázdný blok `previews`, jinak build padá.

## Každý stát v mapě bochníku je automaticky vycentrovaný výškově i do šířky

Při přepínání vlajek v mapě poboček (`#pointy`) musí být aktivní stát — a každý další stát, který v budoucnu přibude — vždy plně vycentrovaný uprostřed vnitřní plochy půlbochníku sýra jak vodorovně, tak výškově, s dostatečným odstupem od zaoblené kůrky i horní grilované krusty. Místo ručně psaných CSS posunů pro jednotlivé země počítá `RacletteEurope.cameraFor(countryId)` v `js/europe.js` obdélník a vrcholy polygonu daného státu a automaticky nastaví šířku i pozici mapy (`left`, `top`, `width`) tak, aby střed státu ležel uprostřed čisté plochy bochníku a žádný výběžek (například západní a jižní cípy Švýcarska) se nedotýkal okraje.
