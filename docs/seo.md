# SEO

Ostré domény se indexují. Zkušební adresy ne.

## Co je na stránce

- unikátní `title` a `description` v každém jazyce
- kanonická adresa s `?lang=`
- `hreflang` pro cs, en, fr, sk, it, de, pl, es, ru a `x-default` na angličtinu
- Open Graph a Twitter karta, obrázek je fotka servisu
- JSON-LD `Organization` pro Raclette Point Original.cz s.r.o.
- `sitemap.xml` a `robots.txt`
- textové alternativy obrázků a jedna úroveň nadpisů v sekcích

Výchozí HTML má `index, follow`. Kanonická adresa angličtiny a jazyků bez vlastní domény je `https://www.raclettelovers.com/`. Čeština je `https://raclettelovers.cz/`, slovenština `https://raclettelovers.sk/`, francouzština `https://raclettelovers.ch/`. Cloudflare Worker stejné pravidlo zapíše i do odpovědi `.cz`, `.sk` a `.ch`, aby ho viděl robot bez JavaScriptu.

JavaScript na ostré doméně nechá `index, follow` a kanonickou adresu přepíše na doménu daného jazyka. Na `github.io`, `localhost` a `127.0.0.1` nastaví `noindex, follow` a zkušební pruh. `github.io` se navíc přesměrovává na `www.raclettelovers.com`.

Aliasové domény (`raclettepointoriginal.*`, `raclette-lovers.com`, `raclette-point-original.com` a jejich `www`) vrací 301. Samostatnou stránku k indexování nemají.
