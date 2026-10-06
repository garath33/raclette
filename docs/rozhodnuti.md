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

Veřejné podklady říkají, jak spolupráce začíná: ozvat se, domluvit schůzku a projít možnosti od částečné po kompletní spolupráci. Stará stránka Raklet Party zvala větou „Nalákejte své zákazníky na pravý raclette“. Na webu je místo toho „Nabídněte svým zákazníkům ten nejlepší raclette“, protože slovo nalákat zní jako lákadlo. Historie popisuje Point jako koncept spolupráce po ohlasech subdodávek a jmenuje partnera Raclette Republic.

B2B podklad k partnerství tyhle věty doplňuje, nenahrazuje je. Jsou v něm tři formáty (shop-in-shop, mobilní Point, kontejner nebo kiosek), čtyři kroky od kontaktu po slavnostní start a jméno Eddyho Baillifarda jako švýcarského krále, který může přijet podle domluvy. Podklad výslovně říká, že se neplatí statisícové ani milionové vstupní poplatky za licenci a že měsíční partnerský poplatek se domlouvá podle velikosti Pointu, typu provozovny a lokality. Konkrétní částka, procento ani délka smlouvy v podkladu nejsou, proto je stránka neuvádí. V podkladu je u mobilního formátu slovo Foodrack; na webu je food truck, protože tak se vozidlo jmenuje i u Pointu v Kladně. Regresní test hlídá schůzku, rozsah od částečné po kompletní, zákaz vymyšlené částky a zmínku Eddyho Baillifarda.

## raclettelovers.com je první vlastní doména

Čtyři záznamy A u WebHouse míří na GitHub Pages a `www` je CNAME na `garath33.github.io`. HTTPS na `www.raclettelovers.com` běží, certifikát kryje i apex, Enforce HTTPS je zapnuté. Apex skáče na `www`. DNS zónu `.com` u WebHouse nemente. Pro `.cz` (a později `.sk` / `.ch` / aliasy) jde provoz přes Cloudflare Pages: jmenné servery jen u té domény přepíšete na Cloudflare (`teresa.ns.cloudflare.com`, `tim.ns.cloudflare.com` u `raclettelovers.cz`). Placené Presmerovanie u WebHouse neplatit. Přepínač nabízí všechny jazyky na každé doméně. Nejdřív se bere jazyk z nastavení telefonu nebo počítače, jinak koncovka: `.cz` čeština, `.sk` slovenština, `.ch` francouzština, `.com` angličtina. Než výslovně potvrdíte indexování, zůstane zkušební pruh a `noindex`.

## Hlava krávy se nesmí natáhnout do sloupu

U obrázku bylo v HTML výška 875 px a v CSS jen šířka. Prohlížeč proto nechal výšku atributu a hlavu roztáhl do vysokého pruhu, který na stránce vypadal jako useknutá krabička. CSS teď nastavuje `height: auto` a poměr 723:875.

Samotný poměr nestačil. Hlava a kulaté logo byly přilepené k rámu sloupce, zatímco fotka uprostřed tabletu byla menší a vycentrovaná. Na šířce kolem 768 px proto hlava visela ve volném místě vedle kruhu a na úzkém mobilu se kruh zploštil, protože výška fotky byla natvrdo 300 px. Rám vizuálu je teď čtverec stejně velký jako fotka a obě značky se kotví k jeho rohům v procentech. Test hlídá poměr hlavy, kruhovou fotku a to, že se hlava s fotkou překrývá.

## Hláška mapy není chyba stránky

Výkonnostní test jednou spadl na větě `Permissions policy violation: compute-pressure`. Stránka ji nevypisuje, pochází z vloženého Google Maps. Test ji teď přeskakuje, stejně jako chybějící favicon. Ostatní chyby v konzoli pořád test shodí.

## Druhé klepnutí na polohu bere nový odečet

První verze testu nechala mezi Kladnem a Jeseníkem starou polohu, protože prohlížeč směl minutu použít cache (`maximumAge`). Nové klepnutí na „Použít mou polohu“ proto vždy žádá čerstvý odečet.
