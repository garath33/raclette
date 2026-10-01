# Testování

Příkaz `npm test` spustí všechno. Jednotlivé vrstvy jdou pustit zvlášť.

| Příkaz | Co hlídá |
| --- | --- |
| `npm run test:unit` | Jazyky, vzdálenost Pointů, SEO soubory, velikost assetů |
| `npm run test:smoke` | Načtení stránky, sekce, jazyk, nejbližší Point |
| `npm run test:responsive` | 390, 768, 1280 a 1440 px, menu, žádný vodorovný přetok |
| `npm run test:performance` | Žádná vlastní odpověď nad 500 kB, čistá konzole, hero má prioritu |

## Smoke

Smoke ověří, že se stránka vůbec rozběhne: nadpis, tři vizitky, Martin Šimůnek, žádná zmínka o Veronice, testovací pruh a přepnutí do němčiny. Druhý smoke nastaví polohu u Kladna a u Jeseníku a kontroluje, že se vybere správný Point a mapa.

## Regrese

Regrese je v jednotkových testech. Všech devět jazyků musí mít stejné klíče. Každý `data-i18n` na stránce musí mít překlad. Výběr nejbližšího Pointu má pevné příklady, aby se souřadnice omylem neprohodily. Veřejné HTML nesmí obsahovat jméno, které bylo z kontaktů vyřazené.

## Responsivita

Playwright otevře čtyři šířky. U každé změří, jestli stránka není širší než okno, a to i po odscrollování na kontakty. Na 390 px musí jít otevřít menu. Na 1280 px je menu rozbalené a hamburger skrytý. Zlom je 1100 px, proto se 768 px chová jako mobil.

## Výkon

Dva rozpočty:

- soubory na disku, aby do repozitáře nevlezla zbytečně velká fotka
- přenos v prohlížeči, žádný vlastní soubor nad 500 kB

Písma z Google Fonts se do limitu vlastních souborů nepočítají. Hero fotka má `fetchpriority="high"`, galerie pod ohybem má `loading="lazy"`.

Nový test přidávej, když se objeví chyba, která už jednou utekla. Příklad: po záměně souřadnic přibyl test „z Kladna je nejbližší food truck“.
