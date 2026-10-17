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

Cloudflare Worker na `.cz`, `.sk` a `.ch` jazyk zapíše rovnou do HTML: `lang`, titulek, popis, Open Graph, texty `data-i18n` a seznam Pointů v JSON-LD. Robot bez JavaScriptu tedy na české doméně čte češtinu, ne anglický zdroj. Holá adresa (`/`, `/pro-partnery`, `/app`) se přesměruje 301 na stejnou cestu s `?lang=` jazyka domény a s příponou `.html`, která je v kanonické adrese. Odkazy mezi stránkami si `?lang=` nesou, aby proklik z české stránky neskončil na adrese bez jazyka.

`sitemap.xml` uvádí každou jazykovou verzi jako vlastní `<loc>`. Úvod a partneři mají devět jazyků, aplikace jen cs, en, fr a sk. `robots.txt` na doméně Workeru ukazuje sitemap téže domény.

JavaScript na ostré doméně nechá `index, follow` a kanonickou adresu drží na doméně daného jazyka. Na `github.io`, `localhost` a `127.0.0.1` nastaví `noindex, follow` a zkušební pruh. `github.io` se navíc přesměrovává na `www.raclettelovers.com`.

Po změně anglického znění se výchozí HTML a sitemap srovnají znovu:

```bash
node lib/bake-seo.mjs
```

Aliasové domény (`raclettepointoriginal.*`, `raclette-lovers.com`, `raclette-point-original.com` a jejich `www`) vrací 301. Samostatnou stránku k indexování nemají.
