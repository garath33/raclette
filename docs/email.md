# E-mail info@raclettelovers.com

Veřejný kontakt na webu je pořád `info@rakletparty.cz`. Adresa `info@raclettelovers.com` se na web doplní až ve chvíli, kdy na ni přijde zkušební zpráva a dorazí do osobní schránky.

Kontrola 15. října 2026: `raclettelovers.com` má jmenné servery `ns1.webhouse.sk`, `ns2.webhouse.sk` a `ns3.webhouse.sk`. Apex má čtyři záznamy A na GitHub Pages, `www` je CNAME na `garath33.github.io`. Záznamy MX a TXT v zóně nejsou. Pošta na `info@raclettelovers.com` proto dnes nemá kam přijít.

## Proč se jmenné servery nemění

Návod s Cloudflare Email Routing začíná přepisem jmenných serverů z WebHouse na Cloudflare. To sem nepatří.

Cloudflare Email Routing umí přijímat poštu jen v zóně, kterou drží Cloudflare. `www.raclettelovers.com` přitom servíruje GitHub Pages právě proto, že DNS zůstává u WebHouse a záznamy A a CNAME nejsou za cizí proxy. Přesun jmenných serverů by web shodil, kdyby se ty záznamy nepřeneseny jedna ku jedné a nenechaly šedé (bez proxy). Až bude `.com` na stejném Workeru jako `.cz`, `.sk` a `.ch`, jmenné servery se přepnou. Do té doby se kvůli poště nemění. Podrobnosti jsou v [domeny.md](domeny.md).

Příjem i odesílání jdou zařídit ve stávající zóně u WebHouse. Smysl návodu zůstává: příjem zdarma do osobní schránky, odesílání z Gmailu pod hlavičkou `info@raclettelovers.com`. Mění se jen nástroj na příjem.

| Část | Nástroj | Proč |
| --- | --- | --- |
| Příjem `info@` | ImprovMX, bezplatný tarif | Stačí dva MX záznamy u WebHouse, jmenné servery se nehýbou |
| Odesílání z Gmailu | Brevo SMTP, bezplatný tarif | WebHouse bez placeného mailhostingu nemá odchozí SMTP pro tuhle doménu |
| Web | Beze změny, dokud pošta nefunguje | Jinak by návštěvník psal na adresu, která poštu odmítne |

Partnerský formulář na `pro-partnery.html` dál posílá poptávky přes FormSubmit na `milan@raclette-original.com`. To je jiný kanál než veřejný kontakt.

## Co musí doplnit člověk s přístupem do účtů

Z repozitáře se Setup WebHouse, ImprovMX, Brevo ani Gmail otevřít nedají. Níže je pořadí, které se v těch účtech provede. Webové záznamy (čtyři A, CNAME `www`, jmenné servery, hvězdičkový CNAME) se při tom nemažou a nepřepisují.

### 1. Schránka, kam má pošta spadnout

Než se založí alias, je potřeba znát cílovou adresu, nejspíš Gmail. Bez ní ImprovMX nemá kam přeposílat a ověřovací odkaz nemá kam přijít.

### 2. ImprovMX, jen alias `info`

1. Účet na [improvmx.com](https://improvmx.com/), bezplatný tarif (jedna doména, aliasy, stovky přeposlaných zpráv denně).
2. Přidat doménu `raclettelovers.com`.
3. Alias `info` → cílová schránka z kroku 1. Akce je Forward. Hromadný alias na všechno před zavináčem nezapínat, jinak na schránku spadne i spam na náhodné adresy.
4. V cílové schránce potvrdit ověřovací odkaz od ImprovMX.

### 3. DNS u WebHouse

Setup → Domény → DNS zóna → `raclettelovers.com`. Nový řádek: název `@`, typ podle tabulky. U MX se priorita a server píšou do hodnoty, oddělené mezerou, server končí tečkou. U TXT se hodnota píše v uvozovkách. Tak to popisuje nápověda WebHouse k DNS zóně.

| Název | Typ | Hodnota |
| --- | --- | --- |
| @ | MX | `10 mx1.improvmx.com.` |
| @ | MX | `20 mx2.improvmx.com.` |
| @ | TXT | `"v=spf1 include:spf.improvmx.com include:spf.brevo.com ~all"` |

SPF smí být na doméně jen jeden. Kdyby Brevo ukázal vlastní řádek začínající `v=spf1`, nepřidává se druhý. `include:spf.brevo.com` se dopíše do řádku výše. Ostatní TXT (ověřovací kód Brevo, DKIM, DMARC) jsou další řádky a SPF to nejsou.

Po uložení má `dig MX raclettelovers.com` ukázat `mx1.improvmx.com` a `mx2.improvmx.com`. Čtyři adresy A a CNAME `www` mají zůstat, jaké jsou.

### 4. Brevo, odesílání

1. Účet na [brevo.com](https://www.brevo.com/), bezplatný tarif.
2. Odesílatel: jméno firmy a adresa `info@raclettelovers.com`.
3. V části pro ověření domény zkopírovat záznamy, které Brevo ukáže (ověřovací kód, DKIM, DMARC). Hodnoty jsou vázané na účet, do zóny se neopisují odjinud.
4. Stejné řádky přidat ve WebHouse jako TXT nebo CNAME, přesně podle názvu a typu z Breva. Proxy se tu neřeší, zóna není na Cloudflare.
5. V Brevo ověření domény potvrdit, až se záznamy načtou.
6. V SMTP & API si poznamenat server, port, login a SMTP klíč. Do repozitáře ani do chatu s heslem nepatří.

SMTP pro Gmail:

| Pole | Hodnota |
| --- | --- |
| Server | `smtp-relay.brevo.com` |
| Port | `587` |
| Zabezpečení | TLS |
| Uživatel | přihlašovací e-mail účtu Brevo |
| Heslo | SMTP klíč z Breva, ne heslo k účtu |

### 5. Gmail, odesílat jako

Na počítači: Nastavení → Zobrazit všechna nastavení → Účty a import → Odesílat poštu jako → Přidat další e-mailovou adresu.

- Jméno: Raclette Point Original, nebo jméno člověka, který poštu vyřizuje.
- Adresa: `info@raclettelovers.com`.
- Považovat za alias.
- Server, uživatel, heslo a port z tabulky výše.

Gmail pošle kód na `info@raclettelovers.com`. Díky kroku 2 a 3 přijde do cílové schránky. Kód se opíše a potvrdí.

### 6. Zkouška, než se sáhne na web

1. Z jiné schránky, než je ta cílová, poslat zprávu na `info@raclettelovers.com`. Má přijít do cíle, předmět i příloha v celku.
2. Z Gmailu odpovědět a v poli Od vybrat `info@raclettelovers.com`. Zpráva má odejít a u příjemce nepadnout do spamu.
3. Když odpověď ve spamu je, v Brevo ještě není ověřená doména (DKIM).

## Až zkouška projde, výměna na webu

Jedna náhrada `info@rakletparty.cz` → `info@raclettelovers.com` v těchto místech:

- `index.html` — schema.org `email`, tlačítko v Eventech, e-mail u Pavlíny Otýpkové, rychlý kontakt, patička
- `pro-partnery.html` — schema.org `email` a patička
- `docs/rozhodnuti.md` — věta, že veřejný kontakt je `info@rakletparty.cz`

Telefon +420 777 600 223, e-shop `www.rakletparty.cz` a příjemce formuláře `milan@raclette-original.com` se touhle výměnou nemění.

## Až .com přejde na Cloudflare

Až se jmenné servery `.com` opravdu přepnou kvůli Workeru, MX a TXT se do nové zóny přenesou se stejnými hodnotami. ImprovMX může zůstat. Cloudflare Email Routing dává smysl až v té chvíli, a to místo ImprovMX, ne navíc: dvě sady MX vedle sebe by poštu rozdělily.
