# Domény a přesměrování

Vaše rozdělení je správné: kanonická adresa podle trhu, stará značka a spojovníkové názvy jen jako 301. Lepší uspořádání z toho nedělám. Úpravy proti prvnímu náčrtu jsou jen ty, které Google a prohlížeče čekají.

## Cílové uspořádání

Čtyři adresy web opravdu servírují. Ostatních šest na ně trvale skáče. `www` vždy na verzi bez `www`. Stav 301, cesta za lomítkem se zachová.

| Doména | Úloha | Výchozí jazyk |
| --- | --- | --- |
| raclettelovers.cz | kanonický web pro Česko | čeština |
| raclettelovers.sk | kanonický web pro Slovensko | slovenština |
| raclettelovers.com | kanonický web pro ostatní země | angličtina |
| raclettelovers.ch | kanonický web pro Švýcarsko | němčina, v přepínači francouzština a italština |
| raclettepointoriginal.cz | 301 na raclettelovers.cz | — |
| raclettepointoriginal.sk | 301 na raclettelovers.sk | — |
| raclettepointoriginal.com | 301 na raclettelovers.com | — |
| raclettepointoriginal.ch | 301 na raclettelovers.ch | — |
| raclette-point-original.com | obranné 301 na raclettelovers.com | — |
| raclette-lovers.com | obranné 301 na raclettelovers.com | — |

Na `.ch` se z jazyka prohlížeče bere jen `de`, `fr` nebo `it`. Jinak němčina. Francouzština z Orsières zůstává v přepínači; výchozí němčina držíme, dokud to neotočíte.

Polština, španělština a ruština nemají vlastní koncovku, zůstanou na `raclettelovers.com` jako `?lang=pl`, `?lang=es`, `?lang=ru`. Čeština, slovenština, němčina, francouzština a italština z přepínače skáčou na svou kanonickou doménu, ne na `?lang=` na cizí koncovce. Tím nevzniknou duplicity.

`hreflang` x-default míří na `raclettelovers.com`. To je záchytná síť pro návštěvníka, jehož jazyk nemáme.

Indexování je pořád vypnuté. Pruh „Testovací prostředí“ zůstane na všech `raclettelovers.*`, dokud to někdo výslovně neschválí.

## Proč ne GitHub Pages pro všech deset

GitHub Pages umí jednu vlastní doménu. Teď je to `www.raclettelovers.com`. Další hostname na stejných IP dostane stránku „There isn't a GitHub Pages site here“. DNS A záznam u `.cz` na GitHub proto nestačí.

V Setupu u WebHouse je u všech deseti řádků „vypnuto“. To není DNS. Je to služba webu nebo přesměrování, která se musí zapnout zvlášť. Sama o sobě HTTPS na GitHub Pages nezapne.

## Co kliknout teď u WebHouse

Nejdřív dokončete HTTPS na `.com`: smažte hvězdičku `*.raclettelovers.com`, přidejte `www.raclettelovers.com` CNAME na `garath33.github.io`, v Settings → Pages uložte `raclettelovers.com`. Podrobnosti jsou níže.

Pak u šesti aliasů zapněte službu **Presmerovanie** (Nastavení u dané domény). Cíl je HTTPS adresa z tabulky, **bez maskování**. Maskování je rámeček, Google ho bere špatně a certifikát na něm nebývá. Kde jde zvolit kód, dejte 301.

| Doména v Setupu | Cíl přesměrování |
| --- | --- |
| raclettepointoriginal.com | https://raclettelovers.com/ |
| raclettepointoriginal.cz | https://raclettelovers.cz/ |
| raclettepointoriginal.sk | https://raclettelovers.sk/ |
| raclettepointoriginal.ch | https://raclettelovers.ch/ |
| raclette-point-original.com | https://raclettelovers.com/ |
| raclette-lovers.com | https://raclettelovers.com/ |

Dokud `.cz`, `.sk` a `.ch` web neservírují, WebHouse u nich umí dočasně totéž přesměrování na `.com` s jazykem v adrese. Tím domény nejsou mrtvé, ale kanonický web to ještě není:

| Dočasný cíl, než poběží vlastní hosting | |
| --- | --- |
| raclettelovers.cz | https://raclettelovers.com/?lang=cs |
| raclettelovers.sk | https://raclettelovers.com/?lang=sk |
| raclettelovers.ch | https://raclettelovers.com/?lang=de |

Až budou čtyři kanonické adresy opravdu servírovat web, tahle tři dočasná přesměrování smažte.

## Hosting, který umí víc domén

Aby `.cz`, `.sk`, `.com` a `.ch` ukazovaly stejný web s jazykem podle hostitele, je potřeba Cloudflare Pages, Netlify nebo Cloudflare před GitHub Pages. GitHub Pages to neunese.

Doporučení je Cloudflare, účet zdarma. WebHouse zůstane registrátorem. U každé kanonické domény se v Cloudflare přidá custom domain a SSL vznikne samo. Soubor `_redirects` v kořeni repozitáře už obsahuje 301 pro `www`, starou značku a spojovníkové názvy. Aliasům se v Cloudflare taky přidá doména, pravidlo je přesměruje.

Jmenné servery WebHouse (`ns1.webhouse.sk` a další) se mění až v tomhle kroku, ne dřív. Hvězdičkové CNAME nikde nedávejte.

## raclettelovers.com u WebHouse (HTTPS)

Čtyři záznamy A na GitHub jsou v pořádku. Problém je hvězdička `*.raclettelovers.com` CNAME na `raclettelovers.com`.

GitHub kvůli ní vidí `www.raclettelovers.com` jako CNAME na apex, ne na `garath33.github.io`. Certifikát Let's Encrypt proto nevydá. Stejná hvězdička navíc přepíše i ověřovací jméno `_github-pages-challenge-garath33.raclettelovers.com`. Dokumentace GitHubu hvězdičkové záznamy výslovně nedoporučuje.

Řádek `*.raclettelovers.com` smažte. Místo něj přidejte jen `www` jako CNAME přímo na `garath33.github.io` (bez `/raclette`). Třída zůstává IN, priorita se u A ani CNAME nevyplňuje.

| Název | Typ | Hodnota | Co s ním |
| --- | --- | --- | --- |
| raclettelovers.com | A | 185.199.108.153 | nechte |
| raclettelovers.com | A | 185.199.109.153 | nechte |
| raclettelovers.com | A | 185.199.110.153 | nechte |
| raclettelovers.com | A | 185.199.111.153 | nechte |
| www.raclettelovers.com | CNAME | garath33.github.io | přidejte |
| `*.raclettelovers.com` | CNAME | raclettelovers.com | smažte |

Kdyby se starý řádek s `86.110.243.202` vrátil, smažte ho. Záznamy AAAA GitHub doporučuje, ale k vydání certifikátu nutné nejsou.

TTL u WebHouse je 600 sekund. Po uložení DNS počkejte aspoň deset minut. Pak v repozitáři Settings → Pages u Custom domain klikněte Remove, znovu napište `raclettelovers.com` a Save. Tím se znovu spustí žádost o certifikát. Může trvat až hodinu. Až vedle domény zezelená kontrola DNS, zapněte Enforce HTTPS. Tokeny z tohohle prostředí pole umí jen číst, uložení musí udělat vlastník.

Soubor `CNAME` v repozitáři má řádek `raclettelovers.com`. U publikace z GitHub Actions ho Pages ignoruje. Teď je v poli Custom domain `www.raclettelovers.com`, proto apex přes HTTP skáče na `www`. Po uložení `raclettelovers.com` GitHub otočí přesměrování na adresu bez `www`.

## Pravidla přesměrování

Stav 301, cesta za doménou se zachová. Stejný seznam je v `_redirects`.

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
https://www.raclettelovers.com/*        https://raclettelovers.com/:splat
https://www.raclettelovers.cz/*         https://raclettelovers.cz/:splat
https://www.raclettelovers.sk/*         https://raclettelovers.sk/:splat
https://www.raclettelovers.ch/*         https://raclettelovers.ch/:splat
```
