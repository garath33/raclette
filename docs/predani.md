# Předání webů Raclette Lovers

Stav ověřený 10. 11. 2026 z veřejného DNS a z odpovědí serverů. Jeden obsah, čtyři veřejné adresy. Zdrojový kód je v [github.com/garath33/raclette](https://github.com/garath33/raclette). Hesla, SMTP klíč a API token v repozitáři nejsou.

Podrobnosti k jednotlivým tématům jsou v [doménách](domeny.md), [e-mailu](email.md), [nasazení](pipeline.md), [SEO](seo.md) a [architektuře](architektura.md).

## Co má majitel dostat

Přístup do šesti míst. Bez nich má jen odkazy, ne správu.

1. GitHub repozitář `garath33/raclette`, včetně Actions a secretu `CLOUDFLARE_API_TOKEN`.
2. Cloudflare účet, ve kterém běží Worker `raclette`. Náhledy končí na `simunek-m.workers.dev`. DNS zóny všech domén níže jsou v tom samém účtu.
3. Registrátor `raclettelovers.com` ve WebHouse (panel [setup.sk](https://www.setup.sk)). Jmenné servery už míří na Cloudflare. Registrátoři `.cz`, `.sk` a `.ch` v podkladech uvedeni nejsou, jmenné servery mají stejné jako `.com`.
4. Gmail `raclettepointoriginal@gmail.com`.
5. Účet Brevo na bezplatném plánu.
6. Google Search Console pro `.com`, `.cz`, `.sk` a `.ch`. Sitemap je přijatá 21. 10. 2026.

Cloudflare se majiteli neotvírá rolí na celý účet. Postup, který nechá ostatní weby v tom účtu stranou, je níže v [Přístup do Cloudflare](#přístup-do-cloudflare).

## Veřejné adresy

Obsah je jeden statický web. Liší se jen to, kdo ho po DNS pošle prohlížeči, a výchozí jazyk. Holá adresa na `.cz`, `.sk` a `.ch` se přesměruje na stejnou cestu s `?lang=`.

| Adresa | Kdo servíruje | Jazyk | Index |
| --- | --- | --- | --- |
| `www.raclettelovers.com` | GitHub Pages (účet `garath33`) | angličtina; de, it, pl, es, ru přes `?lang=` | ano |
| `raclettelovers.cz` | Cloudflare Worker `raclette` | čeština | ano |
| `raclettelovers.sk` | Cloudflare Worker `raclette` | slovenština | ano |
| `raclettelovers.ch` | Cloudflare Worker `raclette` | francouzština (`fr-CH`) | ano |
| `raclettepointoriginal.com` / `.cz` / `.sk` / `.ch`, `raclette-lovers.com`, `raclette-point-original.com` a jejich `www` | Worker, trvalé přesměrování 301, cesta za doménou zůstává | jazyk cíle | ne |
| `garath33.github.io/raclette` | GitHub Pages, 301 na `www.raclettelovers.com` | — | ne |

Stránky: úvod, `/pro-partnery` a aplikace `/app` (lze přidat na plochu telefonu). Apex `raclettelovers.com` vrací 301 na `www`. Certifikát `www` je Let's Encrypt, `.cz` / `.sk` / `.ch` mají Google Trust Services. Všechny platí do 3. 1. 2027 a obnovují je hostingy samy.

## Kde se co spravuje

| Věc | Místo | Na co si dát pozor |
| --- | --- | --- |
| Kód, texty, fotky | GitHub, větev `main` | Do `main` jen to, co má jít na ostré weby. Změna jde přes pull request. |
| Anglický web a `www` | GitHub Pages, soubor `CNAME` = `raclettelovers.com` | V nastavení Pages nechat Enforce HTTPS. DNS `.com` nesmí jít přes oranžový Cloudflare proxy, jinak Pages nevydá certifikát. |
| `.cz`, `.sk`, `.ch` a aliasy | Cloudflare Worker `raclette` | Vlastní domény jsou přivázané v dashboardu. V `wrangler.jsonc` seznam domén není. `.com` ani `www` k Workeru nepřidávat, sundalo by to web z Pages. |
| DNS všech uvedených domén | Cloudflare, servery `teresa.ns.cloudflare.com` a `tim.ns.cloudflare.com` | Záznamy se needitují u registrátora. U `.com` jsou čtyři A na `185.199.108.153` až `185.199.111.153` a CNAME `www` na `garath33.github.io`, obojí DNS only. |
| Návštěvnost | Cloudflare Web Analytics, bez cookies | `.cz`, `.sk` a `.ch` měří Cloudflare sám. `www` měří kód v `js/site.js`, protože Pages na Cloudflare neběží. Localhost a náhledy se neměří. |
| Vyhledávání | Google Search Console, vlastnost typu Doména | Sitemap je u každé domény soubor `sitemap.xml`. U `.com` adresa `https://www.raclettelovers.com/sitemap.xml`. |

## Jak se změna dostane ven

Úprava se zkouší na náhledu větve, ne až po sloučení. Adresa náhledu vznikne z názvu větve: lomítka se změní na pomlčky a na konec se připojí `-raclette.simunek-m.workers.dev`. Náhled má zkušební pruh a `noindex`. Nahý `raclette.simunek-m.workers.dev` veřejný není.

Po sloučení do `main` spustí GitHub Actions testy a pak dvě nasazení. **Deploy test environment** aktualizuje GitHub Pages, tedy `www`. **Deploy production** spustí `wrangler deploy` Workeru `raclette`. Bez secretu `CLOUDFLARE_API_TOKEN` v Actions se wrangler přeskočí a ostré domény Workeru může nasadit jen Cloudflare Workers Builds napojený na stejný repozitář. Ruční opakování je v Actions u workflow Deploy production, větev `main`.

Lokální náhled: `npm ci` a `npm start`, stránka na `http://127.0.0.1:4173`. Testy: `npm test`. Na hosting se nekopírují testy, dokumentace ani `node_modules`.

## Pošta a formulář

| Tok | Jak je zapojený |
| --- | --- |
| Příjem `info@raclettelovers.com` | Cloudflare Email Routing předá dopis do `raclettepointoriginal@gmail.com`. MX jsou `route1.mx.cloudflare.net`, `route2.mx.cloudflare.net` a `route3.mx.cloudflare.net`. Catch-all je vypnutý. Schránka u WebHouse se neplatí. |
| Odeslání jako `info@` | Ze stejného Gmailu přes Brevo, server `smtp-relay.brevo.com`, port 587, STARTTLS. Odesílatel zůstává `info@`. Strop bezplatného Breva je 300 dopisů denně. SMTP klíč je jen v Gmailu a v Brevu. |
| Formulář spolupráce | Stránka ho posílá na FormSubmit, příjemce `milan@raclette-original.com`. Na `info@` formulář nemíří. První odeslání čeká na potvrzovací odkaz v té schránce. |

Web je statický a poštu sám neposílá. SPF na apexu je jen `v=spf1 include:_spf.mx.cloudflare.net ~all`. DKIM odesílání jsou CNAME `brevo1._domainkey` a `brevo2._domainkey`. DMARC je `p=none` a hlášení jdou na `rua@dmarc.brevo.com`. Doručení i odeslání z Gmailu ověřil majitel schránky 28. 10. 2026.

## Na co nesahat

- Oranžový mrak před záznamy A a CNAME u `raclettelovers.com`.
- Vlastní doména Workeru pro `raclettelovers.com` nebo `www`.
- Druhý SPF záznam vedle stávajícího.
- Druhý záznam `_dmarc`.
- Hvězdičkový CNAME.
- Starý A záznam `86.110.243.202`, kdyby se vrátil.
- Zapnutí Cloudflare Email Sending (záznamy `cf-bounce`): odesílá Brevo.
- Domény `rakletparty.cz` a `raclette-original.com`. Jsou to jiné zóny a do tohoto přesměrování nepatří.

## Co ještě není dotažené

| Bod | Stav |
| --- | --- |
| SPF a Brevo | Veřejný řádek Brevo neobsahuje. Odeslání drží DKIM. `include:spf.brevo.com` se doplní jen úpravou odemčeného TXT, druhý SPF se nezakládá. |
| DMARC | Pořád `p=none`. Na `p=quarantine` až po kontrole, že vlastní pošta má v hlavičce `dkim=pass` a `d=raclettelovers.com`. |
| Dvojí hosting | `.com` záměrně zůstává na GitHub Pages. Worker a Pages se po merge aktualizují odděleně. Sjednocení na Worker by chtělo přepsat A i CNAME `www` a teprve pak přidat doménu k Workeru. |

## Přístup do Cloudflare

Účet se teď nepřesouvá. Majitel dostane členství ve stávajícím účtu, omezené na domény Raclette. Přesun zón má smysl až ve chvíli, kdy správu předáte úplně. Přihlášení k soukromému mailu se nesdílí: majitel použije vlastní e-mail a zapne si dvoufázové ověření.

V tom účtu jsou i jiné weby. Role **Administrator** nebo **Super Administrator** na celý účet by je otevřela. Ty se nedávají.

### Pozvánka jen na tyto domény

1. V účtu Workeru `raclette` otevřete **Manage Account → Members → Invite**.
2. E-mail majitele. Rozsah není celý účet.
3. Nejpřehlednější je skupina domén, třeba „Raclette Lovers“, a do ní jen těchto deset zón: `raclettelovers.com`, `raclettelovers.cz`, `raclettelovers.sk`, `raclettelovers.ch`, `raclettepointoriginal.com`, `raclettepointoriginal.cz`, `raclettepointoriginal.sk`, `raclettepointoriginal.ch`, `raclette-lovers.com`, `raclette-point-original.com`.
4. Role ke skupině: **Domain Administrator**. Majitel spravuje DNS, certifikáty a Email Routing těchto domén. Do cizích zón se nedostane.

**Domain Administrator** má ještě čtení Workerů, firewallu a Access v celém účtu. Cizí weby v seznamu domén neuvidí, názvy a nastavení jiných Workerů ano, jen bez úprav. Když je i to moc, dejte jen **Domain DNS**. Ta umí záznamy vybraných domén a k Workerům se neváže. Poštu a certifikáty by pak dál měnil správce účtu.

### Worker a token

Nasazení Workeru se na jednu doménu omezit nedá. Role **Workers Platform Admin** by otevřela všechny Workery v účtu, nejen `raclette`. Nepřidává se.

Stávající `CLOUDFLARE_API_TOKEN` z GitHub Actions se majiteli neposílá. Když má právo na všechny zóny, je to klíč i k ostatním webům. Na zásah do DNS mu stačí dashboard. Až bude potřebovat nasazovat, vystaví si vlastní token v rámci svého členství a v secretu se vymění. Token, který si vytvoří on, umí jen to, co mu členství dovolí.

### Kdy účet přenést

Až správce z účtu odchází. Nejdřív nechat majitele členem, pak teprve zóny přenést a Worker i poštu složit znovu. Samotné DNS se zkopíruje, domény Workeru, trasy a pravidla Email Routingu ne. U `.cz`, `.sk` a `.ch` by web do nového navázání spadl a pošta `info@` by chtěla nové ověření cíle. U `.com` hrozí oranžový mrak před GitHub Pages. Změní se i název účtu v adresách náhledů a token v GitHubu přestane platit.
