# Domény a přesměrování

## Stav 5. října 2026

HTTPS na `raclettelovers.com` už běží. Certifikát Let's Encrypt platí pro `raclettelovers.com` i `www.raclettelovers.com` do 3. ledna 2027. Enforce HTTPS je zapnuté. HTTP i apex skáčou na `https://www.raclettelovers.com/`. V Pages je kanonická adresa `www` — to GitHub zvolil podle CNAME. Pro návštěvníka je to v pořádku. WebHouse DNS u `.com` **nemente** (4× A `185.199…` a `www` CNAME na `garath33.github.io`).

Zóna Cloudflare pro `raclettelovers.cz` je založená: parkovací A a hvězdička smazané. Právě teď se u WebHouse jen u `.cz` přepisují jmenné servery na `teresa.ns.cloudflare.com` a `tim.ns.cloudflare.com`. Ostatní domény (`.sk`, `.ch`, aliasy) ještě čekají — u WebHouse zůstávají zaparkované na `86.110.243.202`. Placené Presmerovanie u WebHouse neplatit.

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

Smazáno:

- A `raclettelovers.cz` → `86.110.243.202`
- CNAME `*` → `raclettelovers.cz`

Kdyby v tabulce ještě zbýval CNAME `www` → `raclettelovers.cz`, smažte ho taky. Tabulka má být prázdná, dokud Pages nepřipojíte custom domain (Cloudflare záznamy vytvoří sám).

### 2. Aktivovat zónu (jmenné servery jen u .cz) — právě teď

Cloudflare ukázal:

| Jmenný server |
| --- |
| `teresa.ns.cloudflare.com` |
| `tim.ns.cloudflare.com` |

U WebHouse otevřete **jen** `raclettelovers.cz` (ne `.com`):

1. Domény → Detail `raclettelovers.cz` → **DNS servery** → Změnit
2. Smažte `ns1.webhouse.sk`, `ns2.webhouse.sk`, `ns3.webhouse.sk`
3. Vložte přesně `teresa.ns.cloudflare.com` a `tim.ns.cloudflare.com`
4. Uložte

Počkejte, až Cloudflare u zóny napíše **Active**. Může to trvat od minut po pár hodin. DNS zónu `.cz` od teď editujete v Cloudflare, ne ve WebHouse.

Zóna `raclettelovers.com` ve WebHouse zůstává:

| Název | Typ | Hodnota |
| --- | --- | --- |
| raclettelovers.com | A | 185.199.108.153 |
| raclettelovers.com | A | 185.199.109.153 |
| raclettelovers.com | A | 185.199.110.153 |
| raclettelovers.com | A | 185.199.111.153 |
| www.raclettelovers.com | CNAME | garath33.github.io |

### 3. Vytvořit Cloudflare Pages (web) — až zóna Active

Až Cloudflare u `raclettelovers.cz` napíše **Active**: v levém menu **Workers & Pages** → **Create** → **Pages** → **Import an existing Git repository** → GitHub `garath33/raclette`.

Nastavení sestavení:

| Pole | Hodnota |
| --- | --- |
| Production branch | `main` |
| Framework preset | None |
| Build command | `mkdir -p _site && cp index.html robots.txt sitemap.xml _redirects _site/ && cp -a css js assets _site/` |
| Build output directory | `_site` |
| Root directory | (prázdné) |

Poprvé se objeví adresa `něco.pages.dev`. Otevřete ji: má to být stejný zkušební web jako na GitHubu, s pruhem Testovací prostředí.

### 4. Připojit raclettelovers.cz

V projektu Pages: **Custom domains** → **Set up a domain** → `raclettelovers.cz` → Continue. Cloudflare záznam CNAME na apex vytvoří sám (flattening).

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
