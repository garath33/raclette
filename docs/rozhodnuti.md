# Rozhodnutí a opravy

Krátký záznam, aby se stejná chyba neopakovala.

## Veřejný text neříká, koho jsme vyřadili

V první verzi kontaktů bylo napsané, že Veronika v seznamu není. To na web nepatří. Veřejná stránka uvádí jen lidi, kteří v týmu jsou. Regresní test teď prohledá HTML i všechny překlady a selže, když se jméno Veronika objeví znovu.

## Adresa se nevymýšlí

U Špindlerova Mlýna a food trucku nebyla ulice. Mapa ukazuje střed střediska a Kladno a text to říká. Křížový vrch má adresu z webu hotelu.

## Test není ostrý web

První verze neměla prostředí, na kterém se dá verze nejdřív otevřít. Teď je testovací adresa oddělená od ručního nasazení. Test má `noindex` a viditelný pruh, aby se dočasná adresa nezačala tvářit jako finální doména.

## hreflang jen na živé adresy

Budoucí domény `raclettelovers.*` se do SEO značek nedávají, dokud neodpovídají. Jinak by vyhledávač dostal odkazy do prázdna.

## Písmo z charty

Charta předepisuje Luthier a Open Sans. Open Sans je na webu. Luthier v podkladech jako soubor písma není, proto jsou nadpisy v Cormorant Garamond. Písmo se nestahuje z cizího úložiště.

## Chyba, která dostala test

Když se poloha spletla, stránka uměla ukázat špatný Point bez toho, aby si toho někdo všiml. Test „z Kladna je food truck, z Jeseníku je Křížový vrch“ to drží.

## Druhé klepnutí na polohu bere nový odečet

První verze testu nechala mezi Kladnem a Jeseníkem starou polohu, protože prohlížeč směl minutu použít cache (`maximumAge`). Nové klepnutí na „Použít mou polohu“ proto vždy žádá čerstvý odečet.
