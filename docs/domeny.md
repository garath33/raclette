# Domény a přesměrování

## Stav 5. října 2026

HTTPS na `raclettelovers.com` už běží. Certifikát Let's Encrypt platí pro `raclettelovers.com` i `www.raclettelovers.com` do 3. ledna 2027. Enforce HTTPS je zapnuté. HTTP i apex skáčou na `https://www.raclettelovers.com/`. V Pages je kanonická adresa `www` — to GitHub zvolil podle CNAME. Pro návštěvníka je to v pořádku.

Ostatních devět domén je u WebHouse **zaparkovaných** na `86.110.243.202`. HTTP vrací stránku „Zaparkovaná doména | WebHouse“, HTTPS na nich není. Hvězdička `*.…` u nich CNAME míří na apex.

## Jazyk na každé doméně

Přepínač nabízí všech devět jazyků a zůstane na stejné adrese (`?lang=`). Výchozí jazyk se bere ze státu v locale prohlížeče (`cs-CZ` → čeština, `de-DE` → němčina, `fr-CH` → francouzština). Když locale zemi neprozradí, padá to na koncovku: `.cz` čeština, `.sk` slovenština, `.ch` němčina, `.com` angličtina.

Skutečnou zemi podle IP DNS nepozná. Bezplatně to umí Cloudflare hlavičkou `CF-IPCountry`, až bude provoz přes něj. Do té doby je locale prohlížeče nejbližší signál bez placené služby a bez cizího geo API.

Indexování je vypnuté. Pruh „Testovací prostředí“ zůstane, dokud to někdo výslovně neschválí.

## Proč samotné DNS 301 neudělá

DNS umí říct „tato adresa je na téhle IP“. Neumí říct prohlížeči „jdi na jinou URL“. Proto placená služba Presmerovanie u WebHouse existuje: potřebujete HTTP server, certifikát a odpověď 301.

Kdybyste u `.cz` jen zkopírovali čtyři GitHub A záznamy, GitHub odpoví „There isn't a GitHub Pages site here“. Pages umí **jednu** vlastní doménu a ta už je `www.raclettelovers.com`.

Bezplatné a jednodušší než platit Presmerovanie u každé aliasové domény: **Cloudflare Pages**, účet zdarma. WebHouse zůstane registrátorem a v Setupu se jen přepíšou DNS záznamy, které Cloudflare ukáže. SSL a 301 z `_redirects` vzniknou samy. Jmenné servery WebHouse se měnit nemusí.

Dokud Cloudflare (nebo jiný hosting s víc doménami) není, `.cz` / `.sk` / `.ch` a aliasy nechte zaparkované. Parkovací A `86.110.243.202` nemazejte „do GitHubu“, web by zmizel a nahradila by ho chybová stránka GitHubu.

## raclettelovers.com — hotovo, už sahat nemusíte

| Název | Typ | Hodnota |
| --- | --- | --- |
| raclettelovers.com | A | 185.199.108.153 |
| raclettelovers.com | A | 185.199.109.153 |
| raclettelovers.com | A | 185.199.110.153 |
| raclettelovers.com | A | 185.199.111.153 |
| www.raclettelovers.com | CNAME | garath33.github.io |

Hvězdička `*.raclettelovers.com` je pryč. Jmenné servery `ns1.webhouse.sk`, `ns2.webhouse.sk`, `ns3.webhouse.sk` nechte.

## Co v Setupu u ostatních devíti (až bude Cloudflare)

V Setupu: Domény → DNS zóna → vyberte doménu. Třída IN, prioritu u A a CNAME nevyplňujte. Hvězdičkový CNAME nikde nedávejte.

Cloudflare Pages po přidání custom domain vypíše přesné hodnoty. Typicky:

**Apex** (např. `raclettelovers.cz`): smažte parkovací A `86.110.243.202`. Přidejte A / AAAA, které Cloudflare ukáže (ne GitHub `185.199…`).

**www**: smažte CNAME na apex. Přidejte CNAME na hostname projektu `*.pages.dev`, který Cloudflare ukáže.

Stejný postup u `raclettelovers.sk`, `raclettelovers.ch` a u šesti aliasů. Aliasy po připojení k témuž projektu Cloudflare přesměruje podle `_redirects` (301, cesta se zachová).

Cílové 301:

```text
https://raclettepointoriginal.com/*       https://www.raclettelovers.com/:splat
https://www.raclettepointoriginal.com/*   https://www.raclettelovers.com/:splat
https://raclettepointoriginal.cz/*        https://raclettelovers.cz/:splat
https://www.raclettepointoriginal.cz/*    https://raclettelovers.cz/:splat
https://raclettepointoriginal.sk/*        https://raclettelovers.sk/:splat
https://www.raclettepointoriginal.sk/*    https://raclettelovers.sk/:splat
https://raclettepointoriginal.ch/*        https://raclettelovers.ch/:splat
https://www.raclettepointoriginal.ch/*    https://raclettelovers.ch/:splat
https://raclette-point-original.com/*     https://www.raclettelovers.com/:splat
https://www.raclette-point-original.com/* https://www.raclettelovers.com/:splat
https://raclette-lovers.com/*             https://www.raclettelovers.com/:splat
https://www.raclette-lovers.com/*         https://www.raclettelovers.com/:splat
```

Kanonické `.cz` / `.sk` / `.ch` se v Cloudflare přidají jako custom domain bez přesměrování: mají servírovat web. `.com` může zůstat na GitHub Pages, nebo se taky přesune, ať jsou všechny čtyři na stejném hostingu.

## Kanonické adresy

| Doména | Úloha |
| --- | --- |
| www.raclettelovers.com | živý zkušební web (HTTPS) |
| raclettelovers.cz | kanonický web pro Česko, až poběží hosting |
| raclettelovers.sk | kanonický web pro Slovensko |
| raclettelovers.ch | kanonický web pro Švýcarsko |
| raclettepointoriginal.* | 301 na stejnou koncovku raclettelovers.* |
| raclette-point-original.com, raclette-lovers.com | obranné 301 na www.raclettelovers.com |
