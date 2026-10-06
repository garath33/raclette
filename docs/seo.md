# SEO

Testovací web má SEO značky připravené, ale vyhledávačům se schválně neukazuje jako ostrá stránka.

## Co je na stránce

- unikátní `title` a `description` v každém jazyce
- kanonická adresa s `?lang=` na aktuální doméně
- `hreflang` pro cs, en, fr, sk, it, de, pl, es, ru a `x-default` na angličtinu na stejné doméně
- Open Graph a Twitter karta, obrázek je fotka servisu
- JSON-LD `Organization` pro Raclette Point Original.cz s.r.o.
- `sitemap.xml` a `robots.txt`
- textové alternativy obrázků a jedna úroveň nadpisů v sekcích

JavaScript po změně jazyka přepíše titulek, popis, kanonickou adresu, Open Graph a `hreflang` na stejné doméně s `?lang=`. Přepínač nabízí všech devět jazyků a na jinou koncovku neskáče. Statické značky v HTML pořád míří na GitHub Pages, aby je viděl i robot bez JavaScriptu, dokud ostré domény neodpovídají.

## Proč je na testu noindex

GitHub Pages je dočasná adresa. Kdyby ji Google zaindexoval a později vznikly domény `raclettelovers.cz` a další, vznikly by duplicity. Na `github.io`, `localhost`, `127.0.0.1` i na `raclettelovers.*` je proto `noindex, follow`, dokud indexování někdo výslovně neschválí.

`hreflang` ve zdrojovém HTML teď vede jen na adresy, které opravdu existují. Kanonické domény se do statických značek doplní, až budou odpovídat.
