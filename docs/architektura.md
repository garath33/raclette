# Architektura

Statický web bez bundleru. Prohlížeč načte HTML, CSS a několik skriptů v daném pořadí.

```text
index.html
css/styles.css
js/geo.js        vzdálenost a výběr nejbližšího Pointu
js/points.js     souřadnice a odkazy Pointů
js/site.js       SEO, kanonické adresy a rozpoznání testovacího prostředí
js/i18n.js       čeština, angličtina, francouzština
js/i18n-extra.js slovenština, italština, němčina, polština, španělština, ruština
js/app.js        vykreslení vizitek, mapa, přepínač jazyka, odeslání partnerského formuláře
lib/partner-inquiry.mjs  sestavení a validace poptávky (FormSubmit → milan@raclette-original.com)
worker.js        přesměrování aliasů domén
assets/          logo, fotky, favicon
```

Partnerský formulář odešle data přes FormSubmit na `milan@raclette-original.com`. Při prvním odeslání FormSubmit pošle na tuto adresu potvrzovací e-mail — odkaz v něm je potřeba jednou potvrdit, teprve potom začnou poptávky chodit.

## Sekce

1. Úvod se dvěma cestami: nejbližší Point a franchise
2. Naše Raclette Pointy, poloha a Google Maps
3. Pro partnery: úvod z B2B letáku, krátké vysvětlení AOP, čtyři přínosy, tři formáty s plochou a „pro koho“, principy partnerství, podpora, čtyři kroky a kontaktní formulář s telefonem +420 777 600 223.
4. Reference a média
5. Příběh českého krále, včetně videa pasování
6. Kde nakoupit
7. Gastro eventy a festivaly
8. Kontakty

## Jazyk

Výchozí jazyk testovacího webu je čeština. Volba se ukládá do `localStorage` a do adresy jako `?lang=cs`. Na budoucích doménách se výchozí jazyk bude řídit doménou, viz [Domény](domeny.md).

## Mapa

Souřadnice jsou v `js/points.js`. Křížový vrch má ověřenou adresu Za Pilou 6. Špindlerův Mlýn je střed střediska, protože ulice nebyla dodaná. Food truck Martina Kábrta má základnu v Kladně, zastávka se mění podle akce.

Vzdálenost počítá vzorec haversine. Tlačítko polohy otevře trasu v Google Maps z aktuální polohy.

## Vzhled

Bílé pozadí. Stříbrná `#888B8D` a barevné kosočtverce jsou z charty Laiterie d’Orsières. Hlavní znak je Raclette Point. Text je Open Sans, jak charta uvádí. Nadpisy jsou Cormorant Garamond, protože soubor písma Luthier v podkladech není a písmo se nesmí tahat z neověřeného zdroje.
