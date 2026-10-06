# Rozhodnutí a opravy

Krátký záznam, aby se stejná chyba neopakovala.

## Veřejný text neříká, koho jsme vyřadili

V první verzi kontaktů bylo napsané, že Veronika v seznamu není. To na web nepatří. Veřejná stránka uvádí jen lidi, kteří v týmu jsou. Regresní test teď prohledá HTML i všechny překlady a selže, když se jméno Veronika objeví znovu.

## Adresa se nevymýšlí

U Špindlerova Mlýna a food trucku nebyla ulice. Mapa ukazuje střed střediska a Kladno a text to říká. Křížový vrch má adresu z webu hotelu.

## Test není ostrý web

První verze neměla prostředí, na kterém se dá verze nejdřív otevřít. Testovací adresa je `https://garath33.github.io/raclette/`. Má `noindex` a viditelný pruh, aby se dočasná adresa nezačala tvářit jako finální doména.

GitHub u tohoto repozitáře dovolí Pages jen z větve `main`. Nasazení z funkční větve skončilo chybou ochrany prostředí a tokenem to nejde změnit. Testovací odkaz proto vznikne sloučením do `main`, ne dřív. Samostatný workflow pro ostré domény Pages nepřepisuje: dokud není připojený hosting pro `raclettelovers.*`, skončí po testech a nic nepublikuje.

## hreflang jen na živé adresy

Budoucí domény `raclettelovers.*` se do SEO značek nedávají, dokud neodpovídají. Jinak by vyhledávač dostal odkazy do prázdna.

## Písmo z charty

Charta předepisuje Luthier a Open Sans. Open Sans je na webu. Luthier v podkladech jako soubor písma není, proto jsou nadpisy v Cormorant Garamond. Písmo se nestahuje z cizího úložiště.

## Chyba, která dostala test

Když se poloha spletla, stránka uměla ukázat špatný Point bez toho, aby si toho někdo všiml. Test „z Kladna je food truck, z Jeseníku je Křížový vrch“ to drží.

## Franchise bez vymyšlených podmínek

Veřejné podklady říkají, jak spolupráce začíná: ozvat se, domluvit schůzku a projít možnosti od částečné po kompletní spolupráci. Stará stránka Raklet Party zvala větou „Nalákejte své zákazníky na pravý raclette“. Tohle slovo na webu není. Úvod spolupráce bere větu z B2B letáku. Historie popisuje Point jako koncept spolupráce po ohlasech subdodávek a jmenuje partnera Raclette Republic.

Sekce Pro partnery (dřív Spolupráce) teď sleduje strukturu B2B letáku, ne jeden zhuštěný odstavec na téma. Úvod říká zážitek bez statisícových investic a bez šéfkuchaře, prémiový koncept s novými hosty a vyšší útratou, a tři provozní body (8 až 16 porcí, nulové úpravy, Swiss AOP z Valais). Dál jsou čtyři přínosy, tři formáty s „pro koho“ a plochou, čtyři principy partnerství, čtyři body podpory a čtyři kroky. Věta o spolupráci od částečné po kompletní v letáku není, na webu zůstává u shop-in-shop, protože starší podklad ji má a leták ji neruší. Stejně zůstává zmínka o schůzce, Pavlíně Otýpkové a referenci Raclette Republic. Leták jmenuje Eddyho Baillifarda a případnou další českou nebo slovenskou osobnost u slavnostního startu, sýry Barry, divoký pepř a Vacherin Fribourgeois, certifikaci Raclette Master a zařazení na mapu, web a do aplikace. Konkrétní částka, procento ani délka smlouvy v letáku nejsou, proto je stránka neuvádí. Slovo nalákat na webu není. V letáku je u mobilního formátu slovo Foodrack; na webu je food truck, protože tak se vozidlo jmenuje i u Pointu v Kladně. Překlep „Valis“ a „8 druhý“ se na web nepřenáší: je to Valais a sýr s osmi druhy divokého pepře. Regresní test hlídá schůzku, rozsah od částečné po kompletní, zákaz vymyšlené částky, útratu, Raclette Lovers, Vacherin, Raclette Master a zmínku Eddyho Baillifarda. Překlady kvůli tomu narostly, proto je strop `js/i18n.js` 60 kB a `js/i18n-extra.js` 128 kB. Přenosový limit 500 kB na vlastní soubor se nemění.

## Navigace říká Pro partnery

„Spolupráce“ v menu bylo moc obecné. Pro budoucí provozovatele Pointu je jasnější „Pro partnery“ (a stejný smysl v ostatních jazycích). Sekční kicker a odkazy z výhod to kopírují.

## Laiterie zůstává vlastní jméno, mlékárna je překlad

Oficiální značka je Laiterie d’Orsières. V češtině a slovenštině u prvního zmínění dává smysl doplnit obecné slovo „mlékárna / mliekareň“, aby bylo jasné, o jaký podnik jde. Samotné „Laiterie“ se nepřekládá pryč (stejně jako se nepřekládá název sýra). V popisných větách („značka mlékárny“, „vztahy s mlékárnou“) už obecné slovo bylo a zůstává.

## AOP má krátké vysvětlení

U nabídky pro partnery je edukační odstavec: AOP = chráněné označení původu, u sýra záruka místa i postupu. Není to marketingová nálepka.

## Telefon nad formulářem

Nad kontaktním formulářem je výzva vyplnit formulář nebo zavolat na +420 777 600 223.

## raclettelovers.com je první vlastní doména

Čtyři záznamy A u WebHouse míří na GitHub Pages (`185.199.108.153` až `185.199.111.153`). Parkovací adresa `86.110.243.202` je pryč. Ostrý web běží na Cloudflare Workeru a na `raclettelovers.*`. Schválení „commitni na ostrý web“ sundává z těchto domén zkušební pruh i `noindex`. `github.io` a localhost pruh mají dál. Bez uloženého jazyka se na `.com` otevře angličtina, jinak vyhrává jazyk zařízení a potom koncovka domény.

## Hlava krávy patří k mlékárně, ne na fotku sýra

Barevná hlava krávy je designová značka mlékárny z Valais. Na hero fotce sýra už není překrytá jako nálepka. Spolu se znakem La Laiterie d’Orsières je v pruhu dodavatele a ve footeru. Test hlídá poměr hlavy a to, že layout na mobilu, tabletu i desktopu nepřetéká.

## Hláška mapy není chyba stránky

Výkonnostní test jednou spadl na větě `Permissions policy violation: compute-pressure`. Stránka ji nevypisuje, pochází z vloženého Google Maps. Test ji teď přeskakuje, stejně jako chybějící favicon. Ostatní chyby v konzoli pořád test shodí.

## Druhé klepnutí na polohu bere nový odečet

První verze testu nechala mezi Kladnem a Jeseníkem starou polohu, protože prohlížeč směl minutu použít cache (`maximumAge`). Nové klepnutí na „Použít mou polohu“ proto vždy žádá čerstvý odečet.

## Pro partnery na ostrém webu

Schválení „Hod na ostrý web“ posílá Pro partnery, telefon nad formulářem, vysvětlení AOP a znění mlékárny Laiterie d’Orsières na `raclettelovers.*` (bez zkušebního pruhu) a na GitHub Pages. Cloudflare Worker potřebuje v `wrangler.jsonc` prázdný blok `previews`, jinak build padá.
