# Architektura

Statický web bez bundleru. Prohlížeč načte HTML, CSS a několik skriptů v daném pořadí.

```text
index.html
app.html         aplikace Raclette Lovers — hledání nejbližšího Pointu
manifest.webmanifest  zástupce na plochu telefonu
sw.js            service worker pro instalaci PWA
css/styles.css
js/geo.js        vzdálenost a výběr nejbližšího Pointu
js/points.js     souřadnice, adresy a odkazy Pointů
js/site.js       SEO, kanonické adresy a rozpoznání testovacího prostředí
js/i18n.js       čeština, angličtina, francouzština
js/i18n-extra.js slovenština, italština, němčina, polština, španělština, ruština
js/i18n-app.js   texty aplikace a návodu na plochu
js/app.js        vykreslení vizitek, mapa, přepínač jazyka, odeslání partnerského formuláře
js/lovers-app.js stránka aplikace: poloha až po klepnutí, jazyky cs/sk/en/fr
js/pwa.js        instalace zástupce a service worker
lib/partner-inquiry.mjs  sestavení a validace poptávky (FormSubmit → milan@raclette-original.com)
worker.js        přesměrování aliasů domén
assets/          logo, ikony aplikace, fotky, favicon
```

Partnerský formulář odešle data přes FormSubmit na `milan@raclette-original.com`. Při prvním odeslání FormSubmit pošle na tuto adresu potvrzovací e-mail — odkaz v něm je potřeba jednou potvrdit, teprve potom začnou poptávky chodit.

## Sekce

1. Úvod se dvěma cestami: nejbližší Point, aplikace Raclette Lovers a franchise
2. Naše Raclette Pointy, poloha a Google Maps
3. Aplikace Raclette Lovers: zástupce na plochu telefonu a návod pro iPhone i Android
4. Pro partnery: úvod z B2B letáku, krátké vysvětlení AOP, čtyři přínosy, tři formáty s plochou a „pro koho“, principy partnerství, podpora, čtyři kroky a kontaktní formulář se dvěma telefony: Pavlína Otýpková +420 777 600 223 pro Česko a Slovensko, Milan Kolář +41 76 608 39 83 pro Švýcarsko.
5. Reference a média
6. Co je raclette: název, pastviny, podávání, původ chuti a čtyři čísla z výroby
7. Příběh českého krále, včetně videa pasování
8. Kde nakoupit, včetně víkendové půjčovny a partnerů TTM, Raclette House a Provins
9. Gastro eventy a festivaly, včetně příležitostí, kdy si raclette dát
10. Kontakty, včetně mistra raclette show Martina Kábrta a manažerky eventů Elišky Reine

## Jazyk

Výchozí jazyk testovacího webu je čeština. Volba se ukládá do `localStorage` a do adresy jako `?lang=cs`. Na budoucích doménách se výchozí jazyk bude řídit doménou, viz [Domény](domeny.md). Aplikace Raclette Lovers nabízí jen češtinu, slovenštinu, angličtinu a francouzštinu.

## Mapa

Mapa poboček v sekci Naše Raclette Pointy je vykreslená v uřízlém půlbochníku sýra (`js/europe.js`, `css/styles.css`). Zvolená země (a každý další stát, který v budoucnu přibude) se pomocí `RacletteEurope.cameraFor(countryId)` automaticky vycentruje přesně doprostřed vnitřní plochy bochníku jak vodorovně (`50 %` šířky), tak výškově (střed čisté plochy sýra mezi grilovanou krustou nahoře a spodní kůrkou), a měřítko se spočítá z obrysu státu tak, aby se žádný cíp (včetně výběžků Švýcarska) nikdy nepřiblížil ke kůrce ani k hornímu řezu.

Souřadnice jsou v `js/points.js`. Křížový vrch má ověřenou adresu Za Pilou 6. Špindlerův Mlýn je střed střediska, protože ulice nebyla dodaná. Food truck Martina Kábrta má základnu v Kladně, zastávka se mění podle akce. Další Pointy mají adresu z webu podniku: Raclett'House Chez Eddy, Laiterie d’Orsières, Laiterie du Mouret, Kavárna U modrého zvonku a Bonté sýry.

Vzdálenost počítá vzorec haversine. Tlačítko polohy vybere nejbližší Point podle odečtu z prohlížeče. Na telefonu a tabletu se IP z `/api/where` nepoužije: IP operátora často sedí u jiného města (Zličín přes CGNAT může vypadat jako Jeseník) a stránka místo falešné pobočky řekne, ať se zapne GPS. Na notebooku, když je sdílení vypnuté nebo pin nesedí na IP (víc než 8 km), zůstává odhad z Cloudflare. Odkaz do Google Maps má jen cíl. Souřadnice se do startu nedávají: notebook bez GPS často hlásí střed Prahy a Maps z toho udělají cizí podnik, třeba pragERLEBNIS na Staroměstském náměstí. V Mapách startuje Vaše poloha. Bez odečtu na notebooku se navigace neotevře a stránka řekne, jak zapnout sdílení polohy. Když prohlížeč hlásí přesnost horší než 300 m, stránka porovná tu chybu s odstupem druhého Pointu.

## Vzhled

Bílé pozadí. Stříbrná `#888B8D` a barevné kosočtverce jsou z charty Laiterie d’Orsières. Hlavní znak je Raclette Point. Text je Open Sans, jak charta uvádí. Nadpisy jsou Cormorant Garamond, protože soubor písma Luthier v podkladech není a písmo se nesmí tahat z neověřeného zdroje.
