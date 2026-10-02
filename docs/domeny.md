# Domény a přesměrování

Teď běží zkušební web na `https://garath33.github.io/raclette/`. První vlastní doména, kterou zapojujeme, je `raclettelovers.com`. Ostatní domény počkají, dokud bude hosting umět víc adres najednou. GitHub Pages umí jednu vlastní doménu, přesměrování mezi více doménami ne.

## raclettelovers.com u WebHouse

Doména má jmenné servery `ns1.webhouse.sk`, `ns2.webhouse.sk` a `ns3.webhouse.sk`. V DNS zóně je teď záznam A na `86.110.243.202`. To je parkovací stránka WebHouse, ne tento web. Hvězdička `*.raclettelovers.com` je CNAME na `raclettelovers.com` a tu neměňte: díky ní jde `www` stejnou cestou jako adresa bez `www`.

Až se záznam A přepne na GitHub Pages, adresa otevře tento web anglicky. Pořád s pruhem „Testovací prostředí“ a s `noindex`, dokud neřeknete, že smí mezi ostrou návštěvu. Soubor `CNAME` se do publikace přidá až ve chvíli, kdy DNS opravdu míří na GitHub. Dřív by zkušební adresa `github.io` začala posílat lidi na doménu, která ještě web neukazuje.

V zóně nahraďte jedinou hodnotu A čtyřmi řádky. Třída zůstává IN, priorita se u A nevyplňuje.

| Název | Typ | Hodnota |
| --- | --- | --- |
| raclettelovers.com | A | 185.199.108.153 |
| raclettelovers.com | A | 185.199.109.153 |
| raclettelovers.com | A | 185.199.110.153 |
| raclettelovers.com | A | 185.199.111.153 |

Starý řádek s `86.110.243.202` smažte. Hvězdičkový CNAME nechte. Jmenné servery nepřepisujte.

## Kam se sbíhají cesty

| Zdroj | Cíl | Jazyk na cíli |
| --- | --- | --- |
| raclettepointoriginal.com | raclettelovers.com | angličtina |
| raclettepointoriginal.cz | raclettelovers.cz | čeština |
| raclettepointoriginal.sk | raclettelovers.sk | slovenština |
| raclettepointoriginal.ch | raclettelovers.ch | švýcarský web |
| raclette-point-original.com | raclettelovers.com | obranné přesměrování |
| raclette-lovers.com | raclettelovers.com | obranné přesměrování |

`www` u každé domény půjde na verzi bez `www` stejným směrem.

Švýcarský web `raclettelovers.ch` není jeden z devíti jazykových kódů. Návrh je otevřít ho německy, protože němčina je ve Švýcarsku nejrozšířenější, a nechat v přepínači francouzštinu a italštinu. Mlékárna v Orsières je francouzská, takže se to dá otočit na francouzštinu, až to potvrdíte.

Ostatní jazyky (francouzština mimo .ch, italština mimo .ch, polština, španělština, ruština) zůstávají na `raclettelovers.com` přes `?lang=`, dokud pro ně nebude vlastní doména.

## Pravidla přesměrování

Stav 301, cesta za doménou se zachová.

```text
https://raclettepointoriginal.com/*     https://raclettelovers.com/:splat
https://www.raclettepointoriginal.com/* https://raclettelovers.com/:splat
https://raclettepointoriginal.cz/*      https://raclettelovers.cz/:splat
https://www.raclettepointoriginal.cz/*  https://raclettelovers.cz/:splat
https://raclettepointoriginal.sk/*      https://raclettelovers.sk/:splat
https://www.raclettepointoriginal.sk/*  https://raclettelovers.sk/:splat
https://raclettepointoriginal.ch/*      https://raclettelovers.ch/:splat
https://www.raclettepointoriginal.ch/*  https://raclettelovers.ch/:splat
https://raclette-point-original.com/*   https://raclettelovers.com/:splat
https://www.raclette-point-original.com/* https://raclettelovers.com/:splat
https://raclette-lovers.com/*           https://raclettelovers.com/:splat
https://www.raclette-lovers.com/*       https://raclettelovers.com/:splat
```

Na GitHub Pages tahle pravidla zapnout nejdou. Až bude Cloudflare nebo jiný hosting, tenhle seznam se přenese beze změny významu.
