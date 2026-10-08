# Domény a přesměrování

Zkušební adresa `https://garath33.github.io/raclette/` se přesměrovává na `https://www.raclettelovers.com/`. Kdyby se HTML na `github.io` přece jen vrátilo, JavaScript na něm nechá `noindex` a zkušební pruh.

Ostrý web je indexovatelný. `www.raclettelovers.com` servíruje GitHub Pages. `raclettelovers.cz`, `.sk` a `.ch` servíruje Cloudflare Worker `raclette`. Nasazení: merge do `main` aktualizuje obě cesty, viz [pipeline.md](pipeline.md).

## Proč .com zůstává na GitHubu a zbytek na Cloudflare

Obsah je jeden. Liší se jen to, kdo ho po DNS dotazu pošle prohlížeči.

`raclettelovers.com` má jmenné servery WebHouse. Apex má čtyři záznamy A na adresy GitHub Pages. `www` je CNAME na `garath33.github.io`. GitHub proto web rovnou servíruje a apex přesměruje na `www`. Před tyhle záznamy nepatří oranžový Cloudflare proxy: GitHub Pages za cizí proxy neumí vydat svůj certifikát.

`.cz`, `.sk`, `.ch` a starší domény (`raclettepointoriginal.*`, `raclette-lovers.com`, `raclette-point-original.com`) mají jmenné servery Cloudflare. Worker na nich buď web rovnou vrátí, nebo pošle 301 na cílovou doménu. Přesměrované adresy se neindexují, hodnocení přebírá cíl. Indexují se jen čtyři obsahové adresy: `www.raclettelovers.com` (angličtina a jazyky bez vlastní domény), `raclettelovers.cz` (čeština), `raclettelovers.sk` (slovenština) a `raclettelovers.ch` (francouzština).

Nechat `.com` na GitHubu dává smysl, dokud stačí jedna adresa a DNS už tam míří. Nevýhoda je dvojí nasazení: Pages a Worker se aktualizují odděleně. Až bude potřeba mít i `.com` ve stejném Workeru, přepne se DNS z WebHouse na Cloudflare a apex i `www` se přidají k Workeru. Do té doby se záznamy u WebHouse nemění.

## raclettelovers.com u WebHouse

Doména má jmenné servery `ns1.webhouse.sk`, `ns2.webhouse.sk` a `ns3.webhouse.sk`. Ty neměňte. Apex má čtyři záznamy A na GitHub Pages. `www` je CNAME na `garath33.github.io`, proto Pages umí `www` i přesměrování apexu na `www`.

Stránka se na `.com` otevírá anglicky, pokud návštěvník nemá uložený jazyk. Od 8. října 2026 je `index, follow`. Zkušební pruh se na téhle doméně nezobrazuje. `github.io` a localhost pruh a `noindex` mají dál.

V zóně mají být právě tyto čtyři řádky A. Třída zůstává IN, priorita se u A nevyplňuje.

| Název | Typ | Hodnota |
| --- | --- | --- |
| raclettelovers.com | A | 185.199.108.153 |
| raclettelovers.com | A | 185.199.109.153 |
| raclettelovers.com | A | 185.199.110.153 |
| raclettelovers.com | A | 185.199.111.153 |

Kdyby se starý řádek s `86.110.243.202` vrátil, smažte ho. Hvězdičkový CNAME nechte. Jmenné servery nepřepisujte.

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
