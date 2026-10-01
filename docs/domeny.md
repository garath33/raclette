# Domény a přesměrování

Teď běží jen provizorní test na `https://garath33.github.io/raclette/`. Domény níže se zapojí, až bude hosting, který jich umí obsloužit víc najednou. GitHub Pages to neumí.

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
