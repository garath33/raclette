# Pipeline

Změna nejdřív projde testy, potom se objeví na testovací adrese. Na ostrý web se nedostane, dokud to někdo výslovně neschválí.

```text
větev cursor/…  →  CI a testy na pull requestu
                         ↓
                  sloučení do main
                         ↓
                  testy znovu + GitHub Pages (test, noindex)
                         ↓
                  schválení člověkem po otevření odkazu
                         ↓
                  ruční workflow NASADIT, až bude ostrý hosting
```

## Testovací prostředí

GitHub u tohoto repozitáře pustí Pages jen z větve `main`. Z funkční větve proto odkaz nevznikne, i když testy projdou. Až se změna sloučí do `main`, workflow `Deploy test environment` udělá tohle:

1. Jednotkové testy, smoke, responsivita a výkon.
2. Když testy projdou, sestaví se složka `_site` jen z veřejných souborů.
3. GitHub Pages ji vystaví na `https://garath33.github.io/raclette/`.

Na té adrese je černý pruh „Testovací prostředí“ a stránka má `noindex`, aby ji vyhledávače nebraly jako ostrý web.

Sloučení do `main` zapne jen tuhle testovací adresu. Nezapne `raclettelovers.*` ani `raclettepointoriginal.*`.

## Ostré nasazení

Workflow `Deploy production` se nespouští při pushi. Jde ho spustit jen ručně, jen z větve `main`, a do pole potvrzení se musí napsat `NASADIT`.

I potom se nic nepublikuje. Workflow znovu pustí testy a skončí chybou s vysvětlením, že ostrý hosting ještě není připojený. GitHub Pages se tím nemění. Až budou domény `raclettelovers.*`, tenhle krok se napojí na hosting, který umí víc domén najednou. GitHub Pages umí jednu veřejnou adresu, proto teď slouží jako provizorní test.

## Lokální běh

```bash
npm ci
npm start
```

Stránka je na `http://127.0.0.1:4173`. Poloha v prohlížeči funguje na localhostu, ne při otevření souboru z disku.

## Co se do testovacího webu nekopíruje

Testy, `node_modules` a tahle dokumentace zůstávají v repozitáři. Na Pages jdou jen `index.html`, `css`, `js`, `assets`, `robots.txt` a `sitemap.xml`.
