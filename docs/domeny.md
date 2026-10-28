# Domény a přesměrování

Zkušební adresa `https://garath33.github.io/raclette/` se přesměrovává na `https://www.raclettelovers.com/`. Kdyby se HTML na `github.io` přece jen vrátilo, JavaScript na něm nechá `noindex` a zkušební pruh.

Ostrý web je indexovatelný. `www.raclettelovers.com` servíruje GitHub Pages. `raclettelovers.cz`, `.sk` a `.ch` servíruje Cloudflare Worker `raclette`. Nasazení: merge do `main` aktualizuje obě cesty, viz [pipeline.md](pipeline.md).

## Proč .com zůstává na GitHubu a zbytek na Cloudflare

Obsah je jeden. Liší se jen to, kdo ho po DNS dotazu pošle prohlížeči.

`raclettelovers.com` má jmenné servery Cloudflare `teresa.ns.cloudflare.com` a `tim.ns.cloudflare.com`. Registrátor zůstává WebHouse, záznamy se editují ve Cloudflare. Apex má čtyři záznamy A na adresy GitHub Pages. `www` je CNAME na `garath33.github.io`. GitHub proto web rovnou servíruje a apex přesměruje na `www`. Před tyhle záznamy nepatří oranžový Cloudflare proxy: GitHub Pages za cizí proxy neumí vydat svůj certifikát.

`.cz`, `.sk`, `.ch` a starší domény (`raclettepointoriginal.*`, `raclette-lovers.com`, `raclette-point-original.com`) mají jmenné servery Cloudflare. Worker na nich buď web rovnou vrátí, nebo pošle 301 na cílovou doménu. Přesměrované adresy se neindexují, hodnocení přebírá cíl. Indexují se jen čtyři obsahové adresy: `www.raclettelovers.com` (angličtina a jazyky bez vlastní domény), `raclettelovers.cz` (čeština), `raclettelovers.sk` (slovenština) a `raclettelovers.ch` (francouzština).

Nechat `.com` na GitHubu dává smysl, dokud stačí jedna adresa a DNS už tam míří. Nevýhoda je dvojí nasazení: Pages a Worker se aktualizují odděleně. Přesun `.com` na stejný Worker by sjednotil jazyk v HTML i pro němčinu, italštinu, polštinu, španělštinu a ruštinu, které vlastní doménu nemají. Jmenné servery už na Cloudflare jsou. Zbývá apex i `www` přidat k Workeru a záznamy A i CNAME `www` přestat mířit na GitHub Pages. Před stávající záznamy A nepatří oranžová proxy, GitHub by za ní nevydal certifikát. Webové záznamy A i CNAME `www` při schránce `info@` zůstávají, viz [e-mail](email.md). Až požadavek na `.com` dorazí do Workeru, apex `raclettelovers.com` už v kódu vrací 301 na `https://www.raclettelovers.com/`.

## raclettelovers.com

Veřejný web dál servíruje GitHub Pages. Apex má čtyři záznamy A. `www` je CNAME na `garath33.github.io`, proto Pages umí `www` i přesměrování apexu na `www`.

Jmenné servery jsou od ověření 28. října 2026 `teresa.ns.cloudflare.com` a `tim.ns.cloudflare.com`. Dřívější `ns1.webhouse.sk`, `ns2.webhouse.sk` a `ns3.webhouse.sk` se nevrací. Záznamy drží Cloudflare, postup pošty je v [e-mailu](email.md). Worker `raclette` se na `.com` nepřidává.

Stránka se na `.com` otevírá anglicky, pokud návštěvník nemá uložený jazyk. Od 8. října 2026 je `index, follow`. Zkušební pruh se na téhle doméně nezobrazuje. `github.io` a localhost pruh a `noindex` mají dál.

V zóně mají být právě tyto čtyři řádky A. Třída zůstává IN, priorita se u A nevyplňuje.

| Název | Typ | Hodnota |
| --- | --- | --- |
| raclettelovers.com | A | 185.199.108.153 |
| raclettelovers.com | A | 185.199.109.153 |
| raclettelovers.com | A | 185.199.110.153 |
| raclettelovers.com | A | 185.199.111.153 |

Kdyby se starý řádek s `86.110.243.202` vrátil, smažte ho. Hvězdičkový CNAME v živé zóně není, nepřidávejte ho. Jmenné servery se znovu nemění. Další poštovní záznam se edituje jen podle [e-mailu](email.md).

## Kam se sbíhají cesty

| Zdroj | Cíl | Jazyk na cíli |
| --- | --- | --- |
| raclettepointoriginal.com | raclettelovers.com | angličtina |
| raclettepointoriginal.cz | raclettelovers.cz | čeština |
| raclettepointoriginal.sk | raclettelovers.sk | slovenština |
| raclettepointoriginal.ch | raclettelovers.ch | švýcarský web |
| raclette-point-original.com | raclettelovers.com | obranné přesměrování |
| raclette-lovers.com | raclettelovers.com | obranné přesměrování |

`www` u každé domény půjde na verzi bez `www` stejným směrem.

Švýcarský web `raclettelovers.ch` není jeden z devíti jazykových kódů. Návrh je otevřít ho německy, protože němčina je ve Švýcarsku nejrozšířenější, a nechat v přepínači francouzštinu a italštinu. Mlékárna v Orsières je francouzská, takže se to dá otočit na francouzštinu, až to potvrdíte.

Ostatní jazyky (francouzština mimo .ch, italština mimo .ch, polština, španělština, ruština) zůstávají na `raclettelovers.com` přes `?lang=`, dokud pro ně nebude vlastní doména.

## Pravidla přesměrování

Stav 301, cesta za doménou se zachová.

```text
https://raclettepointoriginal.com/*     https://raclettelovers.com/:splat
https://www.raclettepointoriginal.com/* https://raclettelovers.com/:splat
https://raclettepointoriginal.cz/*      https://raclettelovers.cz/:splat
https://www.raclettepointoriginal.cz/*  https://raclettelovers.cz/:splat
https://raclettepointoriginal.sk/*      https://raclettelovers.sk/:splat
https://www.raclettepointoriginal.sk/*  https://raclettelovers.sk/:splat
https://raclettepointoriginal.ch/*      https://raclettelovers.ch/:splat
https://www.raclettepointoriginal.ch/*  https://raclettelovers.ch/:splat
https://raclette-point-original.com/*   https://raclettelovers.com/:splat
https://www.raclette-point-original.com/* https://raclettelovers.com/:splat
https://raclette-lovers.com/*           https://raclettelovers.com/:splat
https://www.raclette-lovers.com/*       https://raclettelovers.com/:splat
```

Na GitHub Pages tahle pravidla zapnout nejdou. Až bude Cloudflare nebo jiný hosting, tenhle seznam se přenese beze změny významu.

## Ověření 28. října 2026

Všechny domény z tabulky i jejich `www` odpověděly. Cesta za doménou zůstala. Alias na `.com` skončil rovnou na `https://www.raclettelovers.com`, apex `raclettelovers.com` sám vrací 301 na `www`. Alias na `.cz`, `.sk` a `.ch` skončil na apexu té domény a Worker doplnil `?lang=cs`, `sk` nebo `fr`. Obsahové adresy otevřely úvod, `/pro-partnery` a `/app`. `https://garath33.github.io/raclette/` vrací 301 na `https://www.raclettelovers.com/`. `navrhy.html` na hostingu není, vrací 404, do ostrého webu se nekopíruje.

`www.raclettelovers.com` má v HTML `lang="en"` a odkaz `mailto:info@raclettelovers.com`. `.cz` je česky, `.sk` slovensky, `.ch` francouzsky (`lang="fr-CH"`). Čtyřicet čtyři místních souborů z úvodu na `.com` vrátilo 200. Certifikáty Cloudflare domén (Google Trust Services) i `.com` (Let's Encrypt) platí do 3. ledna 2027.

`rakletparty.cz` (Websupport, vlastní MX `mail.rakletparty.cz`) a `raclette-original.com` (Forpsi, MX Forpsi) jsou jiné zóny. Otevírají se, do tabulky přesměrování Raclette Lovers nepatří. Formulář spolupráce dál míří na `milan@raclette-original.com`.
