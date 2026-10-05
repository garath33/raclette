# Domény a přesměrování

Zkušební web je připojený na `http://www.raclettelovers.com/`. Adresa `https://garath33.github.io/raclette/` na ni přesměrovává. HTTPS na vlastní doméně zatím nejde: GitHub pořád servíruje certifikát pro `*.github.io`, proto prohlížeč spojení odmítne a Enforce HTTPS nejde zapnout. Ostatní domény počkají, dokud bude hosting umět víc adres najednou. GitHub Pages umí jednu vlastní doménu, přesměrování mezi více doménami ne.

## Proč HTTPS nejde

Čtyři záznamy A na GitHub jsou v pořádku. Problém je hvězdička `*.raclettelovers.com` CNAME na `raclettelovers.com`.

GitHub kvůli ní vidí `www.raclettelovers.com` jako CNAME na apex, ne na `garath33.github.io`. Certifikát Let's Encrypt proto nevydá. Stejná hvězdička navíc přepíše i ověřovací jméno `_github-pages-challenge-garath33.raclettelovers.com`, takže GitHub nedokončí kontrolu DNS. Dokumentace GitHubu hvězdičkové záznamy výslovně nedoporučuje: blokují certifikát a otevírají převzetí cizích subdomén.

Řádek `*.raclettelovers.com` smažte. Místo něj přidejte jen `www` jako CNAME přímo na `garath33.github.io` (bez `/raclette`). Třída zůstává IN, priorita se u A ani CNAME nevyplňuje.

| Název | Typ | Hodnota | Co s ním |
| --- | --- | --- | --- |
| raclettelovers.com | A | 185.199.108.153 | nechte |
| raclettelovers.com | A | 185.199.109.153 | nechte |
| raclettelovers.com | A | 185.199.110.153 | nechte |
| raclettelovers.com | A | 185.199.111.153 | nechte |
| www.raclettelovers.com | CNAME | garath33.github.io | přidejte |
| `*.raclettelovers.com` | CNAME | raclettelovers.com | smažte |

Kdyby se starý řádek s `86.110.243.202` vrátil, smažte ho. Jmenné servery `ns1.webhouse.sk`, `ns2.webhouse.sk` a `ns3.webhouse.sk` nepřepisujte. Záznamy AAAA GitHub doporučuje, ale k vydání certifikátu nutné nejsou.

TTL u WebHouse je 600 sekund. Po uložení DNS počkejte aspoň deset minut. Pak v repozitáři Settings → Pages u Custom domain klikněte Remove, znovu napište `raclettelovers.com` a Save. Tím se znovu spustí žádost o certifikát. Může trvat až hodinu. Až vedle domény zezelená kontrola DNS, zapněte Enforce HTTPS. Tokeny z tohohle prostředí pole umí jen číst, uložení musí udělat vlastník.

Soubor `CNAME` v repozitáři má řádek `raclettelovers.com`. U publikace z GitHub Actions ho Pages ignoruje; kanonická adresa se bere z pole Custom domain. Teď tam je `www.raclettelovers.com`, proto apex přes HTTP skáče na `www`. Po uložení `raclettelovers.com` GitHub otočí přesměrování: `www` půjde na adresu bez `www`.

Až HTTPS naskočí, stránka se otevře anglicky, pokud návštěvník nemá uložený jazyk. Pořád má pruh „Testovací prostředí“ a `noindex, follow`. Indexování se zapne až po výslovném potvrzení.

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
