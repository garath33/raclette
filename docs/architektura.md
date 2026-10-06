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
js/app.js        vykreslení vizitek, mapa, přepínač jazyka
assets/          logo, fotky, favicon
```

## Sekce

1. Úvod se dvěma cestami: nejbližší Point a franchise
2. Naše Raclette Pointy, poloha a Google Maps
3. Spolupráce: proč Point, tři formáty partnerství a čtyři kroky, jak ji navázat. Znění je z B2B podkladu a ze starších vět Raklet Party.
4. Reference a média
5. Příběh českého krále, včetně videa pasování
6. Kde nakoupit
7. Gastro eventy a festivaly
8. Kontakty

## Jazyk

Na `localhost`, `github.io` i na `raclettelovers.*` přepínač nabízí všech devět jazyků a zůstane na stejné adrese s `?lang=`. Nejdřív se bere jazyk z nastavení telefonu nebo počítače. Když ho zařízení neřekne, platí koncovka: `.cz` čeština, `.sk` slovenština, `.ch` francouzština, `.com` angličtina. Viz [Domény](domeny.md).

## Mapa

Souřadnice jsou v `js/points.js`. Křížový vrch má ověřenou adresu Za Pilou 6. Špindlerův Mlýn je střed střediska, protože ulice nebyla dodaná. Food truck Martina Kábrta má základnu v Kladně, zastávka se mění podle akce.

Vzdálenost počítá vzorec haversine. Tlačítko polohy otevře trasu v Google Maps z aktuální polohy.

## Vzhled

Bílé pozadí. Stříbrná `#888B8D` a barevné kosočtverce jsou z charty Laiterie d’Orsières. Hlavní znak je Raclette Point. Text je Open Sans, jak charta uvádí. Nadpisy jsou Cormorant Garamond, protože soubor písma Luthier v podkladech není a písmo se nesmí tahat z neověřeného zdroje.
