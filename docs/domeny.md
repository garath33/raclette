# Domény a přesměrování

Zkušební web: `https://garath33.github.io/raclette/` (GitHub Pages, pruh + noindex).

Ostrý web: Cloudflare Worker `raclette` na `raclettelovers.cz`, `raclettelovers.sk`, `raclettelovers.ch` (a aliasy v zónách Cloudflare). Nasazení: merge do `main` → workflow **Deploy production** (`npx wrangler deploy`), viz [pipeline.md](pipeline.md).

`raclettelovers.com` zatím ještě míří na GitHub Pages (WebHouse DNS). Není to totéž co Worker; po merge se aktualizuje spolu s Pages, ale bez přesměrovacích pravidel Workeru.

## raclettelovers.com u WebHouse

Doména má jmenné servery `ns1.webhouse.sk`, `ns2.webhouse.sk` a `ns3.webhouse.sk`. Ty neměňte. Hvězdička `*.raclettelovers.com` je CNAME na `raclettelovers.com` a tu taky nechte: díky ní jde `www` stejnou cestou jako adresa bez `www`.

Čtyři záznamy A už míří na GitHub Pages. Veřejné překladače `1.1.1.1` a `8.8.8.8` je 2. října 2026 vracely pro apex i pro `www`. Parkovací adresa `86.110.243.202` je pryč.

Soubor `CNAME` v repozitáři má řádek `raclettelovers.com`. U publikace z GitHub Actions ho Pages ignoruje. Doména se zapne ručně: v repozitáři Settings → Pages, pole Custom domain, hodnota `raclettelovers.com`, tlačítko Save. Než se to uloží, adresa vrací stránku GitHubu „There isn't a GitHub Pages site here“ a certifikát je pořád pro `*.github.io`. Po uložení může trvat až hodinu, než GitHub vydá certifikát a web na doméně otevře. Enforce HTTPS nechte zapnuté, až kontrola DNS zezelená.

Až doména web ukáže, otevře se anglicky, pokud návštěvník nemá uložený jazyk. Pořád má pruh „Testovací prostředí“ a `noindex, follow`. Indexování se zapne až po výslovném potvrzení. Do té doby se na to občas připomene.

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
