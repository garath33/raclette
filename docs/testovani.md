# Testování

Příkaz `npm test` spustí všechno. Jednotlivé vrstvy jdou pustit zvlášť.

| Příkaz | Co hlídá |
| --- | --- |
| `npm run test:unit` | Jazyky, vzdálenost Pointů, SEO soubory, velikost assetů |
| `npm run test:smoke` | Načtení stránky, sekce, jazyk, nejbližší Point, aplikace Raclette Lovers |
| `npm run test:responsive` | 390, 768, 1280 a 1440 px, menu, žádný vodorovný přetok |
| `npm run test:performance` | Žádná vlastní odpověď nad 500 kB, čistá konzole, hero má prioritu |

## Smoke

Smoke ověří, že se stránka vůbec rozběhne: nadpis, tři vizitky, Martin Šimůnek, žádná zmínka o Veronice, testovací pruh, sekce aplikace Raclette Lovers a přepnutí do němčiny. Aplikace `app.html` má čtyři jazyky, osm karet bez mapy a polohu spouští až po klepnutí. Další smoke nastaví polohu u Kladna, Jeseníku a Špindlu, kontroluje výběr Pointu, tlačítko „Navigovat k …“ a že odkaz do Maps nemá `origin` ani `dir_action=navigate` (hrubý bod ve středu Prahy se nesmí stát adresou startu a Android nesmí skočit do navádění dřív, než je vidět modrá trasa). Samostatně běží odmítnutá poloha: hláška navede k zapnutí sdílení na notebooku a trasu se starým pinem neotevře. Když prohlížeč polohu nedá a `/api/where` vrátí Zličín, start navigace je tahle IP. Stejně tak aktuální IP na Zličíně přebije pin u Hamerského rybníka. Případ z notebooku v Záběhlicích (Trenčínská 10 i pin u Hamerského rybníka) musí vybrat food truck v Kladně; hrubý odečet (±1,5 km) navíc řekne, že odchylka výběr nemění.

## Regrese

Regrese je v jednotkových testech. Všech devět jazyků musí mít stejné klíče. Každý `data-i18n` na stránce musí mít překlad. Výběr nejbližšího Pointu má pevné příklady, aby se souřadnice omylem neprohodily. Veřejné HTML nesmí obsahovat jméno, které bylo z kontaktů vyřazené.

## Responsivita

Playwright otevře čtyři šířky. U každé změří, jestli stránka není širší než okno, a to i po odscrollování na kontakty. Na 390 px musí jít otevřít menu. Na 1280 px je menu rozbalené a hamburger skrytý. Zlom je 1100 px, proto se 768 px chová jako mobil.

## Výkon

Dva rozpočty:

- soubory na disku, aby do repozitáře nevlezla zbytečně velká fotka
- přenos v prohlížeči, žádný vlastní soubor nad 500 kB

Písma z Google Fonts se do limitu vlastních souborů nepočítají. Hero fotka má `fetchpriority="high"`, galerie pod ohybem má `loading="lazy"`. Hláška prohlížeče `compute-pressure` přichází z vložené mapy a test ji nepočítá jako chybu stránky.

Nový test přidávej, když se objeví chyba, která už jednou utekla. Příklad: po záměně souřadnic přibyl test „z Kladna je nejbližší food truck“.
