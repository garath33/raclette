# Domény a přesměrování

## Nové okno Cursor (když je kontext plný)

1. Otevřete **nový Cloud Agent** na repo `garath33/raclette`, větev `cursor/domain-locales-32be`, PR [#7](https://github.com/garath33/raclette/pull/7).
2. Do prvního vzkazu vložte blok níže. Historii starého chatu kopírovat nemusíte — stav je v gitu a v tomto souboru.

```text
Pokračuj v PR https://github.com/garath33/raclette/pull/7 (větev cursor/domain-locales-32be).
Čti docs/domeny.md. Cíl: HTTPS a 301 aliasů přes Cloudflare Worker raclette, zdarma, bez WebHouse Presmerovanie.

Hotovo: .com zůstává na GitHub Pages, DNS u WebHouse NEMĚNIT. .cz .sk .ch jsou Active a https:// vrací 200. www na těchto třech vrací 301 na apex. Aliasy bez cz/ch pointoriginal jsou Active a 301 jde na správný cíl. Worker raclette má custom domain apex+www. 301 dělá worker.js (Workers _redirects absolutní URL neumí). DNSSEC u WebHouse nezapínat. Prázdná tabulka DNS v průvodci je správně.

Hotovo i aliasy: 6. října 2026 ráno jsou všechny zóny Active, 1.1.1.1 i 8.8.8.8 vrací Cloudflare a HTTPS 301 sedí. .com NIKDY. DNSSEC nezapínat, do DNS tabulky nic nepřidávat.
```

3. Starý chat nechte otevřený jen jako archiv. Pracujte výhradně v novém.

## Screenshot Cloudflare: jmenné servery teresa / tim

Tohle **není** tabulka DNS záznamů (A/CNAME). Je to výměna **jmenných serverů u WebHouse**. Cloudflare tím přebírá DNS zónu.

**raclettelovers.cz, .sk, .ch a většina aliasů — už hotovo.** Zóny jsou Active. Znovu to neměňte.

**raclettelovers.com — nedělejte.** Tam běží GitHub Pages s HTTPS.

Smazání všech řádků A/AAAA/CNAME na druhé stránce průvodce Cloudflare bylo správně. Ty řádky byly staré parkování (`86.110.243.202`). Worker po připojení domény doplní vlastní záznam sám (v tabulce je pak jen `AAAA` `100::`, proxied). Nic dalšího do DNS tabulky nepište a GitHub adresy `185.199…` tam nekopírujte.

6. října 2026 ráno už jsou Active i `raclettepointoriginal.cz` (od 5. října 13:18 UTC) a `raclettepointoriginal.ch` (od 5. října 13:42 UTC). Veřejné DNS u obou vrací teresa/tim a adresy Cloudflare. Věta „Doména není zajištěna pomocí DNSSEC“ znamená, že DNSSEC je vypnuté. Tlačítko **Přidat** nemačkejte. Červená věta „Editace DNS zóny je zakázaná“ po přepnutí jmenných serverů je v pořádku: zónu od té chvíle drží Cloudflare.

Až budete převádět další doménu, u WebHouse u **té** domény:

A. Najděte sekci jmenných serverů (ne DNS záznamy).
B. Přidejte `teresa.ns.cloudflare.com` a `tim.ns.cloudflare.com`.
C. Smažte `ns1.webhouse.sk`, `ns2.webhouse.sk`, `ns3.webhouse.sk`.
D. Uložte. Počkejte, až Cloudflare u zóny napíše Active (minuty až hodiny).

## Stav 5. října 2026

HTTPS na `raclettelovers.com` už běží. Certifikát Let's Encrypt platí pro `raclettelovers.com` i `www.raclettelovers.com` do 3. ledna 2027. Enforce HTTPS je zapnuté. HTTP i apex skáčou na `https://www.raclettelovers.com/`. Veřejně `https://www.raclettelovers.com/` vrací 200 a apex 301 na `www`. V Pages je kanonická adresa `www` — to GitHub zvolil podle CNAME. Pro návštěvníka je to v pořádku. WebHouse DNS u `.com` **nemente** (4× A `185.199…` a `www` CNAME na `garath33.github.io`). Překladač `1.1.1.1` to pořád tak vrací.

Zóna Cloudflare `raclettelovers.cz` je **Active** (od 5. října 2026, 11:18 UTC). Jmenné servery `teresa.ns.cloudflare.com` a `tim.ns.cloudflare.com` už vidí i `1.1.1.1`. Account ID `b38b6a7c241110835172a51e1c65684f`, Zone ID `2a78787dacdba88894c9e17938f124cc`. API token v Cursor Secrets je platný (`GET /user/tokens/verify` → active).

`https://raclettelovers.cz/`, `https://raclettelovers.sk/` a `https://raclettelovers.ch/` vrací 200. `www` na těchto třech vrací 301 na apex. Certifikát `.cz` je Google Trust Services, `.sk` Let's Encrypt, oba do 3. ledna 2027. WebHouse DNS u `.com` se neměnil.

GitHub je propojený (účet `garath33`, od 5. října 2026, 11:40 UTC). Průvodce založil **Worker** `raclette`, ne klasický Pages projekt. Production na `main` běží `npx wrangler deploy`. PR větve běží `npx wrangler preview` (Wrangler 4.135+ a blok `previews`). `wrangler.jsonc` nahrává složku `public/` a vstup `worker.js`. `run_worker_first` je zapnuté, jinak alias ukáže web místo 301.

Workers soubor `_redirects` s absolutní URL odmítne (chyba 100324). Proto `public/_redirects` v assetech není. Živé 301 jsou v `worker.js`. Kořenové `_redirects` zůstává pro testy a pro GitHub Pages, na Worker se nenahrává.

Token umí DNS, Workers Scripts a připojení custom domain. Zónu založit neumí. Placené Presmerovanie u WebHouse neplatit. DNSSEC nezapínat.

Na Workeru `raclette` jsou apex i `www` pro `.cz`, `.sk`, `.ch`, `raclette-lovers.com`, `raclette-point-original.com`, `raclettepointoriginal.com`, `.sk`, `.cz` a `.ch`. V DNS každé zóny jsou jen proxied `AAAA` `100::`. Veřejný překladač z toho udělá adresy Cloudflare (`104.21…` / `172.67…`).

6. října 2026 ráno jsou Active všechny aliasy včetně `raclettepointoriginal.cz` a `raclettepointoriginal.ch`. HTTPS 301 je ověřené na veřejném DNS u `1.1.1.1` i `8.8.8.8`, cesta v adrese se zachová a certifikát projde. Do DNS tabulky nic nedoplňujte.

## Jazyk na každé doméně

Přepínač nabízí všech devět jazyků a zůstane na stejné adrese (`?lang=`). Výchozí jazyk se bere ze státu v locale prohlížeče (`cs-CZ` → čeština, `de-DE` → němčina, `fr-CH` → francouzština). Když locale zemi neprozradí, padá to na koncovku: `.cz` čeština, `.sk` slovenština, `.ch` němčina, `.com` angličtina.

Skutečnou zemi podle IP DNS nepozná. Bezplatně to umí Cloudflare hlavičkou `CF-IPCountry`, až bude provoz přes něj. Do té doby je locale prohlížeče nejbližší signál bez placené služby a bez cizího geo API.

Indexování je vypnuté. Pruh „Testovací prostředí“ zůstane, dokud to někdo výslovně neschválí.

## Proč samotné DNS 301 neudělá

DNS umí říct „tato adresa je na téhle IP“. Neumí říct prohlížeči „jdi na jinou URL“. Proto placená služba Presmerovanie u WebHouse existuje: potřebujete HTTP server, certifikát a odpověď 301.

Kdybyste u `.cz` jen zkopírovali čtyři GitHub A záznamy, GitHub odpoví „There isn't a GitHub Pages site here“. Pages umí **jednu** vlastní doménu a ta už je `www.raclettelovers.com`.

Bezplatné a jednodušší než platit Presmerovanie u každé aliasové domény: **Cloudflare Pages**. Apex (adresa bez `www`) u Cloudflare Pages jde jen když je doména zóna na Cloudflare a jmenné servery míří na Cloudflare. WebHouse zůstane registrátorem. DNS zónu `.com` u WebHouse **nemente** — tam už GitHub Pages s HTTPS běží.

## Krok za krokem: raclettelovers.cz (právě teď)

Zóna `raclettelovers.cz` je v Cloudflare založená. Parkovací A `86.110.243.202` a hvězdičkový CNAME `*` už jsou smazané. GitHub adresy `185.199…` z WebHouse zóny `.com` sem **nepřepisujte**. DNS zónu `.com` u WebHouse **nemente**.

### 1. Smazat parkování v Cloudflare — hotovo

Smazáno přes API 5. října 2026 (v zóně ještě byly, i když dřívější poznámka je měla za pryč):

- A `raclettelovers.cz` → `86.110.243.202`
- CNAME `*` → `raclettelovers.cz`
- CNAME `www` → `raclettelovers.cz`

Tabulka je prázdná, dokud Worker nepřipojí custom domain (Cloudflare záznamy vytvoří sám).

### 2. Aktivovat zónu (jmenné servery jen u .cz) — hotovo

U WebHouse jsou u `raclettelovers.cz` jmenné servery `teresa.ns.cloudflare.com` a `tim.ns.cloudflare.com`. Cloudflare u zóny píše **Active**. DNS zóny `.cz` se od teď edituje v Cloudflare, ne ve WebHouse. `.com` se neměnila.

Zóna `raclettelovers.com` ve WebHouse zůstává:

| Název | Typ | Hodnota |
| --- | --- | --- |
| raclettelovers.com | A | 185.199.108.153 |
| raclettelovers.com | A | 185.199.109.153 |
| raclettelovers.com | A | 185.199.110.153 |
| raclettelovers.com | A | 185.199.111.153 |
| www.raclettelovers.com | CNAME | garath33.github.io |

### 3. Worker raclette — GitHub propojený, build nesmí nahrát node_modules

Účet `garath33` je v Cloudflare Connections. Worker se jmenuje `raclette`. `package.json` drží `wrangler` 4.147 (preview potřebuje 4.135+). `wrangler.jsonc` nahrává jen složku `public/` (web v gitu, ~1,1 MiB) a obsahuje prázdný `previews` blok. Kořen s `node_modules` a binárkou `workerd` (128 MiB) se do assetů nesmí dostat — limit je 25 MiB.

V dashboardu u Workeru nechte Deploy command `npx wrangler deploy`. Build command nechte prázdný. Nový push na tuhle větev spustí build znovu.

301 nedělá soubor `_redirects` v assetech. Dělá je `worker.js`. Příští Workers Build na `main` ten skript smaže, pokud `main` pořád nemá `worker.js` a `run_worker_first`.

### 4. Připojit raclettelovers.cz — hotovo

Na Workeru `raclette` jsou `raclettelovers.cz` i `www.raclettelovers.cz`. Apex vrací 200, `www` vrací 301 na apex.

### 5. Další domény

Stejný postup (zóna ve Free plánu, jmenné servery teresa/tim, prázdná DNS tabulka, custom domain apex + www) je hotový pro:

1. `raclettelovers.sk` a `raclettelovers.ch` — Active, HTTPS 200, `www` 301 na apex
2. `raclette-lovers.com`, `raclette-point-original.com`, `raclettepointoriginal.com` a `raclettepointoriginal.cz` / `.sk` / `.ch` — Active, 301 na cíl níže

Žádný A/CNAME řádek nedoplňujte.

`.com` na GitHub Pages nechte.

Cílové 301 (už je má `worker.js`):

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
| raclettelovers.cz | kanonický web pro Česko (HTTPS) |
| raclettelovers.sk | kanonický web pro Slovensko |
| raclettelovers.ch | kanonický web pro Švýcarsko |
| raclettepointoriginal.* | 301 na stejnou koncovku raclettelovers.* |
| raclette-point-original.com, raclette-lovers.com | obranné 301 na www.raclettelovers.com |
