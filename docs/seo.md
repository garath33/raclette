# SEO

Ostré domény se indexují. Zkušební adresy ne.

## Co je na stránce

- unikátní `title` a `description` v každém jazyce
- kanonická adresa s `?lang=`
- `hreflang` pro cs, en, fr, sk, it, de, pl, es, ru a `x-default` na angličtinu
- Open Graph a Twitter karta, obrázek je fotka servisu
- JSON-LD `Organization` pro Raclette Point Original.cz s.r.o. a na úvodu seznam Pointů
- stránka aplikace `app.html` s vlastním title, hreflang jen cs/en/fr/sk a `manifest.webmanifest`
- `sitemap.xml` a `robots.txt`
- textové alternativy obrázků a jedna úroveň nadpisů v sekcích

Výchozí HTML je anglicky a má `index, follow`. Angličtina je jazyk `www.raclettelovers.com`, které servíruje GitHub Pages a Worker ho nevidí. Kanonická adresa angličtiny a jazyků bez vlastní domény je `https://www.raclettelovers.com/?lang=en`. Čeština je `https://raclettelovers.cz/?lang=cs`, slovenština `https://raclettelovers.sk/?lang=sk`, francouzština `https://raclettelovers.ch/?lang=fr`.

Cloudflare Worker na `.cz`, `.sk` a `.ch` jazyk zapíše rovnou do HTML: `lang`, titulek, popis, Open Graph, texty `data-i18n` a seznam Pointů v JSON-LD. Robot bez JavaScriptu tedy na české doméně čte češtinu, ne anglický zdroj. Holá adresa (`/`, `/pro-partnery`, `/app`) se přesměruje 301 na stejnou cestu s `?lang=` jazyka domény. Přípona `.html` se v přesměrování nepřidává: Cloudflare ji z adresy zase sundá a obě pravidla by se zacyklila. Kanonická značka dál ukazuje na soubor s `.html`. Odkazy mezi stránkami si `?lang=` nesou, aby proklik z české stránky neskončil na adrese bez jazyka.

`sitemap.xml` na každé doméně uvádí jako `<loc>` jen adresy té domény. Ostatní jazyky jsou v ní dál jako `hreflang`. Úvod a partneři mají devět jazyků, aplikace jen cs, en, fr a sk. Soubor v gitu je verze pro `www.raclettelovers.com`. Worker na `.cz`, `.sk` a `.ch` pošle sitemap té domény. `robots.txt` na doméně Workeru ukazuje sitemap téže domény.

JavaScript na ostré doméně nechá `index, follow` a kanonickou adresu drží na doméně daného jazyka. Na `github.io`, `localhost` a `127.0.0.1` nastaví `noindex, follow` a zkušební pruh. `github.io` se navíc přesměrovává na `www.raclettelovers.com`. Náhled na `*.workers.dev` má v HTML `noindex` a s `?lang=` ukáže text toho jazyka.

Po změně anglického znění se výchozí HTML a sitemap srovnají znovu:

```bash
node lib/bake-seo.mjs
```

Aliasové domény (`raclettepointoriginal.*`, `raclette-lovers.com`, `raclette-point-original.com` a jejich `www`) vrací 301. Samostatnou stránku k indexování nemají.

Každá veřejná stránka má právě jeden `h1`. Sekce mají `h2` a `h3`. U obrázku je `alt`. U čistě ozdobné linky je `alt` prázdný. Složité ARIA se nepřidává.

## Bezpečnost

HTTPS vynucuje hosting. Worker navíc přesměruje `http` na `https` a posílá `Strict-Transport-Security`. U GitHub Pages pro `www.raclettelovers.com` má být v nastavení zapnuté Enforce HTTPS.

Každá odpověď Workeru nese `X-Content-Type-Options: nosniff` a `Content-Security-Policy`. Stejná politika bez `frame-ancestors` je v HTML jako meta značka, protože tuhle hlavičku GitHub Pages z repozitáře nenastaví. Povolené je vlastní písmo a skript, odeslání poptávky na formsubmit.co, vložené YouTube a mapa Google.

## Výkon

Fotky na úvodu mají vedle JPEG i WebP a AVIF. Prohlížeč vezme první formát, který umí. Hero AVIF se přednačítá, ostatní fotky mají `loading="lazy"`. Open Sans a Cormorant Garamond leží ve `fonts/` (latin, latin-ext, cyrillic) a připojí je `css/fonts.css`. Veřejné stránky z Google Fonts nic nenačítají. `navrhy.html` se na hosting nekopíruje.

## Měření bez cookies

Návštěvnost měří Cloudflare Web Analytics. Je zdarma a bez cookies. Plausible ani Umami se nepoužívají.

Cloudflare přijme měřicí kód jen na doméně, pro kterou byl vydaný, a na jejích subdoménách. `.cz`, `.sk`, `.ch` a `.com` jsou čtyři různé koncovky, proto má každá vlastní kód v `js/site.js`. Stránka ho vloží na úvodu, na partnerech i v aplikaci, ale jen když je návštěvník na ostré doméně. Localhost, `github.io` a náhled `workers.dev` se neměří.

Kódy v `ANALYTICS_TOKEN` jsou zatím prázdné. Token nasazení Workeru nemá oprávnění Account Settings Write, kterým se měření v Cloudflare zakládá. Jakmile v objektu kód je, stejná stránka ho načte všude, kde ta doména běží.

## Google Search Console

Stav: potvrzeno 21. 10. 2026. Sitemap je v Google Search Console přijatá. Připomínku už neopakuj.

1. Otevři [Google Search Console](https://search.google.com/search-console) a přihlas se účtem, který má web spravovat.
2. Přidej vlastnost typu Doména pro `raclettelovers.cz`, `raclettelovers.sk`, `raclettelovers.ch` a `raclettelovers.com`. Ověření je TXT záznam v DNS. U Cloudflare ho vlož do zóny té domény.
3. V každé vlastnosti otevři Soubory sitemap a odešli `sitemap.xml`. Adresa je `https://<doména>/sitemap.xml`. Na `.com` je to `https://www.raclettelovers.com/sitemap.xml`.
4. V souboru jsou jen adresy té domény. Odkazy `hreflang` na ostatní jazyky tam zůstat mohou. Hláška „Adresa URL není povolena“ znamená, že v `<loc>` je cizí doména. To se po nasazení téhle úpravy ztratí. Sitemap pak v konzoli odeber a přidej znovu, ať ji Google přečte hned.
5. Za pár dní otevři stránku Stránky a zkontroluj, že se adresy začaly indexovat. Když ověření nebo sitemap selže, pošli chybu zpět. Opravuje se soubor na webu, ne účet v konzoli.
