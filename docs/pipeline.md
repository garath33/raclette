# Pipeline

Změna nejdřív projde testy, potom se objeví na testovací adrese. Na ostrý web se nedostane, dokud to někdo výslovně neschválí.

```text
větev cursor/…  →  CI a testy  →  GitHub Pages (test)
                                      ↓
                               schválení člověkem
                                      ↓
                         větev main + ruční workflow NASADIT
```

## Testovací prostředí

Workflow `Deploy test environment` běží při pushi do větve `cursor/raclette-point-web-22c6`.

1. Jednotkové testy, smoke, responsivita a výkon.
2. Když testy projdou, sestaví se složka `_site` jen z veřejných souborů.
3. GitHub Pages ji vystaví na `https://garath33.github.io/raclette/`.

Na té adrese je černý pruh „Testovací prostředí“ a stránka má `noindex`, aby ji vyhledávače nebraly jako ostrý web.

## Ostré nasazení

Workflow `Deploy production` se nespouští při pushi. Jde ho spustit jen ručně, jen z větve `main`, a do pole potvrzení se musí napsat `NASADIT`.

Dokud nepřijde schválení testovací verze, tohle workflow se nespouští. Až budou domény `raclettelovers.*`, ostrý provoz se přesune z GitHub Pages na hosting, který umí víc domén najednou. GitHub Pages umí jednu veřejnou adresu, proto teď slouží jako provizorní test.

## Lokální běh

```bash
npm ci
npm start
```

Stránka je na `http://127.0.0.1:4173`. Poloha v prohlížeči funguje na localhostu, ne při otevření souboru z disku.

## Co se do testovacího webu nekopíruje

Testy, `node_modules` a tahle dokumentace zůstávají v repozitáři. Na Pages jdou jen `index.html`, `css`, `js`, `assets`, `robots.txt` a `sitemap.xml`.
