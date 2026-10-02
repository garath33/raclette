# Domény a přesměrování

Zkušební web teď běží na `https://raclettelovers.com/`. Adresa `https://garath33.github.io/raclette/` se na ni přesměruje. Ostatní domény počkají, dokud bude hosting umět víc adres najednou. GitHub Pages umí jednu vlastní doménu, přesměrování mezi více doménami ne.

## raclettelovers.com u WebHouse

Doména má jmenné servery `ns1.webhouse.sk`, `ns2.webhouse.sk` a `ns3.webhouse.sk`. Ty neměňte. Hvězdička `*.raclettelovers.com` je CNAME na `raclettelovers.com` a tu taky nechte: díky ní jde `www` stejnou cestou jako adresa bez `www`.

Čtyři záznamy A už míří na GitHub Pages. Veřejné překladače `1.1.1.1` a `8.8.8.8` je 2. října 2026 vracely pro apex i pro `www`. Parkovací adresa `86.110.243.202` je pryč. Publikace obsahuje soubor `CNAME` s jediným řádkem `raclettelovers.com`, takže GitHub Pages web servíruje na té doméně a adresu `github.io` na ni přesměruje.

Stránka se otevírá anglicky, pokud návštěvník nemá uložený jazyk. Pořád má pruh „Testovací prostředí“ a `noindex, follow`. Indexování se zapne až po výslovném potvrzení. Do té doby se na to občas připomene.

V zóně mají být právě tyto čtyři řádky A. Třída zůstává IN, priorita se u A nevyplňuje.

| Název | Typ | Hodnota |
| --- | --- | --- |
| raclettelovers.com | A | 185.199.108.153 |
| raclettelovers.com | A | 185.199.109.153 |
| raclettelovers.com | A | 185.199.110.153 |
| raclettelovers.com | A | 185.199.111.153 |

Kdyby se starý řádek s `86.110.243.202` vrátil, smažte ho. Hvězdičkový CNAME nechte. Jmenné servery nepřepisujte.

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
