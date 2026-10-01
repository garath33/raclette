# Rozhodnutí a opravy

Krátký záznam, aby se stejná chyba neopakovala.

## Veřejný text neříká, koho jsme vyřadili

V první verzi kontaktů bylo napsané, že Veronika v seznamu není. To na web nepatří. Veřejná stránka uvádí jen lidi, kteří v týmu jsou. Regresní test teď prohledá HTML i všechny překlady a selže, když se jméno Veronika objeví znovu.

## Adresa se nevymýšlí

U Špindlerova Mlýna a food trucku nebyla ulice. Mapa ukazuje střed střediska a Kladno a text to říká. Křížový vrch má adresu z webu hotelu.

## Test není ostrý web

První verze neměla prostředí, na kterém se dá verze nejdřív otevřít. Testovací adresa je `https://garath33.github.io/raclette/`. Má `noindex` a viditelný pruh, aby se dočasná adresa nezačala tvářit jako finální doména.

GitHub u tohoto repozitáře dovolí Pages jen z větve `main`. Nasazení z funkční větve skončilo chybou ochrany prostředí a tokenem to nejde změnit. Testovací odkaz proto vznikne sloučením do `main`, ne dřív. Samostatný workflow pro ostré domény Pages nepřepisuje: dokud není připojený hosting pro `raclettelovers.*`, skončí po testech a nic nepublikuje.

## hreflang jen na živé adresy

Budoucí domény `raclettelovers.*` se do SEO značek nedávají, dokud neodpovídají. Jinak by vyhledávač dostal odkazy do prázdna.

## Písmo z charty

Charta předepisuje Luthier a Open Sans. Open Sans je na webu. Luthier v podkladech jako soubor písma není, proto jsou nadpisy v Cormorant Garamond. Písmo se nestahuje z cizího úložiště.

## Chyba, která dostala test

Když se poloha spletla, stránka uměla ukázat špatný Point bez toho, aby si toho někdo všiml. Test „z Kladna je food truck, z Jeseníku je Křížový vrch“ to drží.

## Franchise bez vymyšlených podmínek

Veřejné podklady říkají, jak spolupráce začíná: ozvat se, domluvit schůzku a projít možnosti od částečné po kompletní spolupráci. Stránka Raklet Party zve k oficiálnímu Raclette Pointu větou „Nalákejte své zákazníky na pravý raclette“. Historie popisuje Point jako koncept spolupráce po ohlasech subdodávek a jmenuje partnera Raclette Republic. Poplatky, podíl ani délka smlouvy v podkladech nejsou, proto je stránka neuvádí. Regresní test hlídá schůzku, rozsah spolupráce a to, že se v textu neobjeví vymyšlený poplatek.

## Hláška mapy není chyba stránky

Výkonnostní test jednou spadl na větě `Permissions policy violation: compute-pressure`. Stránka ji nevypisuje, pochází z vloženého Google Maps. Test ji teď přeskakuje, stejně jako chybějící favicon. Ostatní chyby v konzoli pořád test shodí.

## Druhé klepnutí na polohu bere nový odečet

První verze testu nechala mezi Kladnem a Jeseníkem starou polohu, protože prohlížeč směl minutu použít cache (`maximumAge`). Nové klepnutí na „Použít mou polohu“ proto vždy žádá čerstvý odečet.
