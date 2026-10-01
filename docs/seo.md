# SEO

Testovací web má SEO značky připravené, ale vyhledávačům se schválně neukazuje jako ostrá stránka.

## Co je na stránce

- unikátní `title` a `description` v každém jazyce
- kanonická adresa s `?lang=`
- `hreflang` pro cs, en, fr, sk, it, de, pl, es, ru a `x-default` na češtinu
- Open Graph a Twitter karta, obrázek je fotka servisu
- JSON-LD `Organization` pro Raclette Point Original.cz s.r.o.
- `sitemap.xml` a `robots.txt`
- textové alternativy obrázků a jedna úroveň nadpisů v sekcích

JavaScript po změně jazyka přepíše titulek, popis, kanonickou adresu, Open Graph a `hreflang` na aktuální adresu prohlížeče. Statické značky v HTML míří na GitHub Pages, aby je viděl i robot bez JavaScriptu.

## Proč je na testu noindex

GitHub Pages je dočasná adresa. Kdyby ji Google zaindexoval a později vznikly domény `raclettelovers.cz` a další, vznikly by duplicity. Na `github.io`, `localhost` a `127.0.0.1` je proto `noindex, follow`. Až se schválí ostrá verze na finální doméně, `js/site.js` na té doméně nastaví `index, follow`.

`hreflang` teď vede jen na adresy, které opravdu existují. Budoucí domény se do značek doplní, až budou odpovídat, ne dřív.
