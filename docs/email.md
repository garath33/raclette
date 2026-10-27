# Schránka info@raclettelovers.com

Příjem jde přes Cloudflare Email Routing do stávající schránky. Její adresa se doplní, až ji majitel řekne. Odesílání z ní jde přes bezplatný SMTP relay Brevo, odesílatel zůstává `info@raclettelovers.com`. Postup níže počítá s Gmailem a funkcí „Odesílat poštu jako“. Placený e-mail u WebHouse se nepoužívá. Web se při tom stěhuje jen v DNS: GitHub Pages dál servíruje `www.raclettelovers.com`. Worker `raclette` se na `.com` nepřidává.

Stav zóny 27. října 2026: jmenné servery `ns1.webhouse.sk`, `ns2.webhouse.sk`, `ns3.webhouse.sk`. Apex má čtyři záznamy A na GitHub Pages, `www` je CNAME na `garath33.github.io`. MX, SPF, DKIM ani DMARC v zóně nejsou. Na apexu je ověření Google Search Console.

## Co dělá kód webu

Statický web. Soubor `.env` v repozitáři není a pošta se z aplikace neodesílá. SMTP heslo Breva do HTML, JavaScriptu ani do GitHubu nepatří.

| Místo | Kam to míří |
| --- | --- |
| Eventy, kontakty Pavlíny, rychlý kontakt, patička, JSON-LD | `info@raclettelovers.com` |
| Formulář `#partner-form` na `pro-partnery.html` | `js/app.js` pošle JSON na adresu z `partnerInquiryUrl()` v `js/site.js` |
| Příjemce formuláře | `https://formsubmit.co/ajax/milan@raclette-original.com` |

`info@rakletparty.cz` na webu není. E-shop `https://www.rakletparty.cz/` a Facebook `facebook.com/rakletparty` zůstávají, to nejsou schránky. FormSubmit pošle poptávku sám. První odeslání čeká na potvrzovací odkaz v schránce `milan@raclette-original.com`. Content-Security-Policy v `index.html`, `pro-partnery.html`, `app.html` a `worker.js` už `https://formsubmit.co` povoluje.

Příjem a odesílání z `info@raclettelovers.com` neběží přes placený e-mail u WebHouse. Příjem přesměruje Cloudflare Email Routing do stávající schránky. Její adresa se doplní, až ji majitel řekne. Odesílání jde z Gmailu přes Brevo, odesílatel je pořád `info@raclettelovers.com`.

## Pořadí

Nejdřív se do Cloudflare překreslí webové záznamy. Pak se u WebHouse vymění jmenné servery. Příjem se zapne, až Cloudflare hlásí zónu Active. Ověření odesílatele v Brevu a v Gmailu přijde na `info@`, proto až po fungujícím přesměrování.

Zapíná se Email Routing. Email Sending (záznamy na `cf-bounce`) se nezapíná: odesílá Brevo.

- [ ] 1. Webové DNS ve Cloudflare, šedý mrak
- [ ] 2. Jmenné servery ve WebHouse
- [ ] 3. Cloudflare Email Routing pro `info@`
- [ ] 4. Jeden SPF záznam
- [ ] 5. Brevo: kód, DKIM, DMARC
- [ ] 6. Odesílatel a SMTP klíč v Brevu
- [ ] 7. Gmail „Odesílat poštu jako“
- [ ] 8. Zkouška hlaviček, pak DMARC `p=quarantine`

## 1. Webové DNS ve Cloudflare

Účet je ten, ve kterém už běží `raclettelovers.cz`, `.sk` a `.ch`.

1. [dash.cloudflare.com](https://dash.cloudflare.com) → Add a domain → `raclettelovers.com` → plán Free.
2. Na obrazovce jmenných serverů si opis dva řádky `něco.ns.cloudflare.com`. Do WebHouse se vloží až v kroku 2.
3. V DNS → Records nech nebo doplň přesně tyto řádky. Proxy u A a CNAME je šedý mrak (DNS only). TTL Auto.

| Typ | Název | Hodnota | Proxy |
| --- | --- | --- | --- |
| A | `@` | `185.199.108.153` | DNS only |
| A | `@` | `185.199.109.153` | DNS only |
| A | `@` | `185.199.110.153` | DNS only |
| A | `@` | `185.199.111.153` | DNS only |
| CNAME | `www` | `garath33.github.io` | DNS only |
| TXT | `@` | `google-site-verification=nYeH1HRgXRKuQs_KmDkYUvbeIylJGkXuQk_bzM-wnA0` | — |

Oranžový mrak před GitHub Pages nepatří: Pages za cizí proxy nevydá certifikát. Řádek `86.110.243.202`, kdyby ho import nabídl, smaž. Hvězdičkový záznam v živé zóně není, nepřidávej ho.

V Workers & Pages u Workeru `raclette` doménu `raclettelovers.com` ani `www` nepřidávej. `wrangler.jsonc` pro `.com` trasu nemá. Vlastní doména Workeru by web sundala z GitHub Pages.

Soubor `CNAME` v repozitáři zůstává `raclettelovers.com`.

## 2. Jmenné servery ve WebHouse

Panel: [www.setup.sk](https://www.setup.sk) → DOMÉNY → Detail domény → `raclettelovers.com` → DNS servery → Zmeniť. Po úpravě OK, jinak se výměna neuloží. Návod WebHouse: [Zmena DNS serverov](https://helpdesk.webhouse.sk/738231-Zmena-DNS-serverov-dom%C3%A9ny).

Smaž všechny tři současné servery:

```text
ns1.webhouse.sk
ns2.webhouse.sk
ns3.webhouse.sk
```

Na jejich místo vlož oba názvy z kroku 1, každý na vlastní řádek. Jsou přidělené téhle zóně, z návodu se opisovat nedají. Třetí pole nech prázdné.

Zóna ve WebHouse se po výměně přestane používat. Další záznamy se editují jen ve Cloudflare.

Čekej, až Cloudflare u domény ukáže Active. Bývá to minuty, výjimečně do 24 hodin. Web mezitím drží stejné adresy GitHub Pages na obou stranách.

Kontrola:

```text
dig +short NS raclettelovers.com
```

Odpověď jsou ty dva servery Cloudflare. Pak:

```text
dig +short A raclettelovers.com
dig +short CNAME www.raclettelovers.com
```

Čtyři adresy `185.199.108.153` až `185.199.111.153` a CNAME `garath33.github.io`. `https://www.raclettelovers.com/` se otevře jako dřív.

## 3. Příjem: Cloudflare Email Routing

Compute → Email Service → Email Routing → Onboard Domain → `raclettelovers.com`. Nech Cloudflare zapsat MX, SPF a DKIM a záznamy zamknout. Priority MX Cloudflare přidělí sám a na doručení nemají vliv. Neměň je.

Na apexu pak jsou tři MX. Dokumentované názvy:

| Typ | Název | Mail server |
| --- | --- | --- |
| MX | `@` | `route1.mx.cloudflare.net` |
| MX | `@` | `route2.mx.cloudflare.net` |
| MX | `@` | `route3.mx.cloudflare.net` |

Když průvodce ukáže jiné tři názvy `*.mx.cloudflare.net`, nech ty z průvodce. Rukou je nepřepisuj na `route1`.

DKIM pro přeposílání zapíše Cloudflare sám:

| Typ | Název | Hodnota |
| --- | --- | --- |
| TXT | `cf2024-1._domainkey` | klíč, který zapíše průvodce |

Klíč do zóny neopisuj z tohoto dokumentu. Selektor `cf2024-1._domainkey` neobsazuj záznamem z Breva.

V Email Routing:

1. Destination addresses → přidej stávající schránku, kterou majitel doplní, a klepni na odkaz v dopise, který přijde přímo do ní.
2. Routing rules → Custom address → `info` → cíl je ta ověřená schránka.
3. Catch-all nech vypnutý.

Zkouška: z jiné schránky pošli dopis na `info@raclettelovers.com`. Dorazí do Gmailu.

## 4. SPF

Veřejný DNS smí mít na jednom jméně jen jeden TXT začínající `v=spf1`. Druhý SPF oba záznamy zneplatní.

Email Routing nejdřív zamkne vlastní řádek:

```text
v=spf1 include:_spf.mx.cloudflare.net ~all
```

Odemkni ho: Email Routing → `raclettelovers.com` → Settings → u SPF záznamu Unlock. V DNS → Records ho uprav na jedinou hodnotu:

```text
v=spf1 include:_spf.mx.cloudflare.net include:spf.brevo.com ~all
```

| Typ | Název | Hodnota |
| --- | --- | --- |
| TXT | `@` | `v=spf1 include:_spf.mx.cloudflare.net include:spf.brevo.com ~all` |

Pravidla, která ten řádek drží:

- začíná `v=spf1`, končí `~all`
- oba `include:` jsou oddělené mezerou, bez čárky a bez uvozovek navíc (Cloudflare uvozovky doplní sám)
- `include:spf.sendinblue.com` nepřidávej, je to starší název stejných adres
- TXT pro Google (`google-site-verification=…`) a TXT `brevo-code:…` jsou další záznamy vedle SPF, neslepují se do něj

Oba `include:` jsou dohromady dva DNS dotazy z povolených deseti. `spf.brevo.com` i `_spf.mx.cloudflare.net` už pod sebou další `include:` nemají.

Bezplatný Brevo u sdílených adres SPF na obálce nepoužívá: obálka zůstává na doméně Breva a DMARC se skládá z DKIM. `include:spf.brevo.com` v tomhle řádku je schválně, ať je odesílací rozsah Breva na doméně uvedený spolu s Cloudflare. Doručení do schránky drží DKIM v dalším kroku. Vypnutí Email Routingu tento SPF smaže, po novém zapnutí se řádek musí složit znovu.

## 5. Brevo: kód, DKIM, DMARC

Účet Brevo na bezplatném plánu. Settings → Senders, Domains, IPs → Domains → Add a domain → `raclettelovers.com` → Authenticate the domain yourself. Automatické napojení na WebHouse po výměně serverů už DNS needituje.

Z obrazovky Breva zkopíruj hodnoty do Cloudflare. Cíl CNAME a text klíče jsou u každého účtu jiné. Z návodu se nedají opsat.

### Brevo kód

| Typ | Název | Hodnota |
| --- | --- | --- |
| TXT | `@` | `brevo-code:` a za tím kód z Breva |

### DKIM pro odesílání

Brevo ukáže jednu z těchto dvou sad. Zapiš tu, kterou vidíš. Vedle ní zůstává cloudflareový `cf2024-1._domainkey`.

Novější účet, dva CNAME (klíč 2048 bitů):

| Typ | Název | Cíl |
| --- | --- | --- |
| CNAME | `brevo1._domainkey` | cíl z pole DKIM 1, tvar `b1.….dkim.brevo.com` |
| CNAME | `brevo2._domainkey` | cíl z pole DKIM 2, tvar `b2.….dkim.brevo.com` |

Starší účet, jeden TXT (klíč 1024 bitů):

| Typ | Název | Hodnota |
| --- | --- | --- |
| TXT | `mail._domainkey` | celé `k=rsa;p=…` z Breva |

U CNAME nech šedý mrak. Do cíle nedávej `https://` ani mezeru. Když je řetězec delší než 255 znaků, Cloudflare ho rozdělí sám.

### DMARC

Jeden TXT. Druhý záznam `_dmarc` celou politiku zruší.

Nejdřív, než zkouška v kroku 8 ukáže `dkim=pass`:

| Typ | Název | Hodnota |
| --- | --- | --- |
| TXT | `_dmarc` | `v=DMARC1; p=none; rua=mailto:info@raclettelovers.com,mailto:rua@dmarc.brevo.com; fo=1; adkim=r; aspf=r` |

`p=none` jen sbírá hlášení. Gmail, Yahoo a Microsoft u odesílatelů chtějí v DMARC značku `rua`. Adresa `rua@dmarc.brevo.com` je ta, kterou Brevo do záznamu dává. Hlášení na `info@` přijdou přesměrováním do Gmailu.

Když Brevo nabídne náhradu existujícího DMARC, nech tento řádek a druhý nezakládej.

Po zelené zkoušce z kroku 8 stejný TXT přepiš na:

```text
v=DMARC1; p=quarantine; rua=mailto:info@raclettelovers.com,mailto:rua@dmarc.brevo.com; fo=1; adkim=r; aspf=r; pct=100
```

`p=quarantine` schová nepodepsané padělky. Vlastní pošta s `dkim=pass` a `d=raclettelovers.com` dál chodí do schránky. `p=reject` až ve chvíli, kdy hlášení za několik dní neukazují vaši vlastní poštu jako selhanou.

V Brevu pak Authenticate this email domain. Stav Authenticated může naskočit během minut, nejpozději do 48 hodin.

## 6. Odesílatel a SMTP v Brevu

SMTP & API (Transactional):

| Položka | Hodnota |
| --- | --- |
| Server | `smtp-relay.brevo.com` |
| Port | `587` |
| Zabezpečení | STARTTLS |
| Přihlašovací jméno | SMTP login z Breva |
| Heslo | SMTP klíč z Breva |

SMTP login není adresa `smtp-relay.brevo.com` a není to e-mail schránky. SMTP klíč není klíč k API ani heslo do účtu Brevo. Bezplatný strop je 300 dopisů za den.

Senders → Add a sender → `info@raclettelovers.com`. Potvrzovací dopis přijde přes Email Routing do Gmailu. Bez klepnutí na odkaz Brevo odeslání z té adresy odmítne.

## 7. Gmail „Odesílat poštu jako“

V osobním Gmailu, kam chodí přesměrovaná pošta: Nastavení → Zobrazit všechna nastavení → Účty a import → Odesílat poštu jako → Přidat další e-mailovou adresu.

| Pole | Hodnota |
| --- | --- |
| Jméno | Raclette Lovers |
| E-mail | `info@raclettelovers.com` |
| Považovat jako alias | zaškrtnuté |
| SMTP server | `smtp-relay.brevo.com` |
| Port | `587` |
| Uživatelské jméno | SMTP login z Breva |
| Heslo | SMTP klíč z Breva |
| Zabezpečené připojení | TLS |

Gmail pošle kód na `info@raclettelovers.com`. Přijde do stejné schránky. Vlož ho.

Ve stejné záložce nastav „Při odpovědi na zprávu“ na odpověď ze stejné adresy, na kterou zpráva přišla. Při novém dopise vyber odesílatele `info@raclettelovers.com`.

## 8. Zkouška

Pošli z Gmailu jako `info@raclettelovers.com` dopis na adresu mimo tento Gmail. V přijaté zprávě otevři originál. U doručené pošty mají být:

```text
dkim=pass header.d=raclettelovers.com
spf=pass
dmarc=pass header.from=raclettelovers.com
```

SPF u Breva sedí na doméně obálky Breva. DMARC projde díky DKIM, `adkim=r`. Když `dkim=pass` chybí, DKIM z kroku 5 v Cloudflare nesedí s obrazovkou Breva. Po `dkim=pass` přepiš DMARC na `p=quarantine` z kroku 5.

Příjem ověř opačně: dopis zvenku na `info@raclettelovers.com` je v Gmailu.

```text
dig +short MX raclettelovers.com
dig +short TXT raclettelovers.com
dig +short TXT _dmarc.raclettelovers.com
dig +short TXT cf2024-1._domainkey.raclettelovers.com
dig +short CNAME brevo1._domainkey.raclettelovers.com
dig +short CNAME brevo2._domainkey.raclettelovers.com
```

U staršího DKIM Breva je poslední dotaz `dig +short TXT mail._domainkey.raclettelovers.com`. V TXT na apexu je právě jeden řetězec `v=spf1`.

## Web a prostředí

Úprava `.env` není potřeba: soubor v projektu není a runtime poštu nečte. Jediné `process.env` v repozitáři je příznak CI v Playwrighti. `CLOUDFLARE_API_TOKEN` je secret nasazení Workeru, k poště se neváže.

Formulář spolupráce nech na FormSubmit a na `milan@raclette-original.com`. Přesměrování na `info@` by chtělo změnu `partnerInquiryUrl()` v `js/site.js`, nový test a jedno potvrzení FormSubmit v Gmailu. Do prohlížeče se SMTP Breva nedává.
