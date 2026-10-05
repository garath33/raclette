# Domény a přesměrování

## Nové okno Cursor (když je kontext plný)

1. Otevřete **nový Cloud Agent** na repo `garath33/raclette`, větev `cursor/domain-locales-32be`, PR [#7](https://github.com/garath33/raclette/pull/7).
2. Do prvního vzkazu vložte blok níže. Historii starého chatu kopírovat nemusíte — stav je v gitu a v tomto souboru.

```text
Pokračuj v PR https://github.com/garath33/raclette/pull/7 (větev cursor/domain-locales-32be).
Čti docs/domeny.md. Cíl: HTTPS na raclettelovers.cz přes Cloudflare Worker raclette, zdarma, bez WebHouse Presmerovanie.

Hotovo: .com HTTPS na GitHub Pages (DNS u WebHouse NEMĚNIT). .cz zóna Active, NS teresa.ns + tim.ns. Všechny jazyky na každé doméně (?lang=), default ze země v locale. Indexace vypnutá.

Teď: Workers Builds raclette musí být zelený. wrangler.jsonc má assets z public/ a previews {}. V package.json je wrangler 4.147 (preview potřebuje 4.135+). Pak v dashboardu Worker Settings → Domains & Routes přidat raclettelovers.cz a www.raclettelovers.cz. Token v Secrets umí DNS, custom domain Workeru ne.

Další až po živém .cz: stejné NS u .sk a .ch (screenshot Cloudflare: přidat teresa/tim, smazat ns1–3.webhouse.sk). .com NIKDY.
```

3. Starý chat nechte otevřený jen jako archiv. Pracujte výhradně v novém.

## Screenshot Cloudflare: jmenné servery teresa / tim

Tohle **není** tabulka DNS záznamů (A/CNAME). Je to výměna **jmenných serverů u WebHouse**. Cloudflare tím přebírá DNS zónu.

**raclettelovers.cz — už hotovo**, zóna je Active. Znovu to neměňte.

**raclettelovers.com — nedělejte.** Tam běží GitHub Pages s HTTPS.

Až budete převádět `.sk` / `.ch` / aliasy, u WebHouse u **té** domény:

A. Najděte sekci jmenných serverů (ne DNS záznamy).
B. Přidejte `teresa.ns.cloudflare.com` a `tim.ns.cloudflare.com`.
C. Smažte `ns1.webhouse.sk`, `ns2.webhouse.sk`, `ns3.webhouse.sk`.
D. Uložte. Počkejte, až Cloudflare u zóny napíše Active (minuty až hodiny).

## Stav 5. října 2026

HTTPS na `raclettelovers.com` už běží. Certifikát Let's Encrypt platí pro `raclettelovers.com` i `www.raclettelovers.com` do 3. ledna 2027. Enforce HTTPS je zapnuté. HTTP i apex skáčou na `https://www.raclettelovers.com/`. Veřejně `https://www.raclettelovers.com/` vrací 200 a apex 301 na `www`. V Pages je kanonická adresa `www` — to GitHub zvolil podle CNAME. Pro návštěvníka je to v pořádku. WebHouse DNS u `.com` **nemente** (4× A `185.199…` a `www` CNAME na `garath33.github.io`). Překladač `1.1.1.1` to pořád tak vrací.

Zóna Cloudflare `raclettelovers.cz` je **Active** (od 5. října 2026, 11:18 UTC). Jmenné servery `teresa.ns.cloudflare.com` a `tim.ns.cloudflare.com` už vidí i `1.1.1.1`. Account ID `b38b6a7c241110835172a51e1c65684f`, Zone ID `2a78787dacdba88894c9e17938f124cc`. API token v Cursor Secrets je platný (`GET /user/tokens/verify` → active).

DNS zóny `.cz` je prázdné. Přes API se smazaly zbytky parkování, které v zóně ještě byly: A `86.110.243.202`, CNAME `*` → `raclettelovers.cz` a CNAME `www` → `raclettelovers.cz`. Apex proto zatím neodpovídá — to je správně, dokud Worker nepřipojí custom domain a záznamy nevytvoří sám. WebHouse DNS u `.com` se neměnil.

GitHub je propojený (účet `garath33`, od 5. října 2026, 11:40 UTC). Průvodce založil **Worker** `raclette`, ne klasický Pages projekt. Production na `main` běží `npx wrangler deploy` a je zelená. PR větve běží `npx wrangler preview` (potřebuje Wrangler 4.135+ v `package.json` a blok `previews` ve `wrangler.jsonc`). Bez toho preview padá hned. `wrangler.jsonc` nahrává gitovanou složku `public/` (~1,1 MiB). `_redirects` je v `public/` v tomto PR; na `main` ten soubor ještě není.

Token v Cursor Secrets umí DNS. Custom domain Workeru s ním přidat nejde (`Authentication error` na `/workers/domains`). Zbývá kliknout je v dashboardu, krok 4. Nový build spouští push do větve, kterou Worker staví, nebo **Retry deployment**.

Ostatní domény (`.sk`, `.ch`, aliasy) ještě čekají — u WebHouse zůstávají zaparkované na `86.110.243.202`. Placené Presmerovanie u WebHouse neplatit.

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

`_redirects` je v `public/`, až bude v brané větvi. Na `main` ten soubor ještě není, takže `www` na apex začne skákat až po sloučení.

### 4. Připojit raclettelovers.cz — až bude Workers Builds zelený

Až check **Workers Builds: raclette** na PR #7 zezelená, otevřete [Worker raclette](https://dash.cloudflare.com/b38b6a7c241110835172a51e1c65684f/workers/services/view/raclette/production) → **Settings** → **Domains & Routes** → **Add** → **Custom domain**.

1. `raclettelovers.cz` → **Add domain**
2. `www.raclettelovers.cz` → **Add domain**

Cloudflare záznam v zóně `.cz` vytvoří sám. Token v Secrets na Workers domains nesáhne. `_redirects` po sloučení tohoto PR pošle `www` na adresu bez `www`. Do té doby obě adresy ukážou stejný web.

Až u obou uvidíte **Active**, otevřete `https://raclettelovers.cz/`. Certifikát vystaví Cloudflare. Výchozí jazyk bude čeština, pokud prohlížeč hlásí Česko, jinak podle locale; přepínač nechá všech devět jazyků na `.cz`.

### 5. Další domény, až .cz poběží

Stejný postup zóna + jmenné servery + Custom domain:

1. `raclettelovers.sk`
2. `raclettelovers.ch`
3. šest aliasů (`raclettepointoriginal.*`, `raclette-lovers.com`, `raclette-point-original.com`) — ty jen proto, aby Cloudflare mohl poslat 301 z `_redirects`

`.com` na GitHub Pages nechte. Až budou `.cz` / `.sk` / `.ch` v pořádku, můžeme ho taky převést, není to nutný další krok.

Kdyby u `.cz` po aktivaci jmenných serverů stále svítila stará parkovací stránka, v Cloudflare DNS ještě zbyl A `86.110.243.202`. Smažte ho a v Pages znovu potvrďte custom domain.

Cílové 301 aliasů (až budou ty domény taky zónami na Cloudflare a custom domain stejného Pages projektu):

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
