# Domény a přesměrování

## Stav 5. října 2026

HTTPS na `raclettelovers.com` už běží. Certifikát Let's Encrypt platí pro `raclettelovers.com` i `www.raclettelovers.com` do 3. ledna 2027. Enforce HTTPS je zapnuté. HTTP i apex skáčou na `https://www.raclettelovers.com/`. Veřejně `https://www.raclettelovers.com/` vrací 200 a apex 301 na `www`. V Pages je kanonická adresa `www` — to GitHub zvolil podle CNAME. Pro návštěvníka je to v pořádku. WebHouse DNS u `.com` **nemente** (4× A `185.199…` a `www` CNAME na `garath33.github.io`). Překladač `1.1.1.1` to pořád tak vrací.

Zóna Cloudflare `raclettelovers.cz` je **Active** (od 5. října 2026, 11:18 UTC). Jmenné servery `teresa.ns.cloudflare.com` a `tim.ns.cloudflare.com` už vidí i `1.1.1.1`. Account ID `b38b6a7c241110835172a51e1c65684f`, Zone ID `2a78787dacdba88894c9e17938f124cc`. API token v Cursor Secrets je platný (`GET /user/tokens/verify` → active).

DNS zóny `.cz` je prázdné. Přes API se smazaly zbytky parkování, které v zóně ještě byly: A `86.110.243.202`, CNAME `*` → `raclettelovers.cz` a CNAME `www` → `raclettelovers.cz`. Apex proto zatím neodpovídá — to je správně, dokud Worker nepřipojí custom domain a záznamy nevytvoří sám. WebHouse DNS u `.com` se neměnil.

GitHub je propojený (účet `garath33`, od 5. října 2026, 11:40 UTC). Průvodce založil **Worker** `raclette`, ne klasický Pages projekt. Příkaz nasazení je `npx wrangler deploy`. První production build spadl: bez `wrangler.jsonc` si Wrangler vzal jako soubory celý repozitář a narazil na `node_modules/workerd/bin/workerd` (128 MiB, limit je 25 MiB). V repozitáři je teď `wrangler.jsonc` a `.assetsignore`, které `node_modules`, git, dokumentaci a testy vynechají. `_redirects` Wrangler dál bere jako pravidla přesměrování.

Token v Cursor Secrets umí DNS. Workers Builds a nasazení Workeru s ním nejdou (`403` a „No access to the specified service“), takže nový build se spouští v dashboardu tlačítkem **Retry deployment**, až je tahle oprava ve větvi, kterou Worker staví (`main`).

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

Tabulka je prázdná, dokud Pages nepřipojí custom domain (Cloudflare záznamy vytvoří sám).

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

### 3. Worker raclette — GitHub propojený, první build spadl

Účet `garath33` je v Cloudflare Connections. Worker se jmenuje `raclette` a nasazuje se příkazem `npx wrangler deploy`. Build command nechte prázdný: web leží v kořeni (`index.html`, `css`, `js`, `assets`) a `wrangler.jsonc` to tak má.

První build skončil chybou „Asset too large“ na `node_modules/workerd`. Ta binárka vznikla tím, že Wrangler při chybějící konfiguraci nainstaloval sám sebe do repozitáře a pak ho celý nahrál. `.assetsignore` ji vynechá. Po commitu téhle opravy do `main` otevřete Worker `raclette` → **Deployments** → **Retry deployment**.

`_redirects` se jako obyčejný soubor nenahrává. Wrangler ho pošle zvlášť jako pravidla. Na `main` ten soubor ještě není, je v tomto PR, takže `www` na apex začne skákat až po sloučení.

### 4. Připojit raclettelovers.cz — až build zezelená

Ve Workeru `raclette`: **Settings** → **Domains & Routes** → **Add** → **Custom domain** → `raclettelovers.cz`. Stejně `www.raclettelovers.cz`. Cloudflare záznam v zóně `.cz` vytvoří sám. Token v Secrets na Workers domains nesáhne, tenhle krok je v dashboardu.

Stejně přidejte `www.raclettelovers.cz`. Soubor `_redirects` po sloučení do `main` pošle `www` na adresu bez `www`.

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
