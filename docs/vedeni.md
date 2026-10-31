# Vedení dokumentace

Tahle složka je mapa projektu. Nový postup, který se má příště zopakovat stejně, sem patří. Jednorázová oprava bez nového pravidla stačí krátkým odstavcem v [rozhodnutích](rozhodnuti.md).

## Jak psát

Česky, krátce, jako ostatní soubory tady. Žádný marketing. Každý nový dokument dostane řádek v tabulce [README](README.md), jinak se ztratí.

Postup polohy je v [poloze](poloha.md). Větve, testy a ostrý web jsou v [pipeline](pipeline.md). Ověření modelu před větším úkolem je v [modelu](model.md).

## Málo souborů

Úprava sahá jen na soubory, které úkol mění, a čte jen to, bez čeho tu změnu nejde trefit. Velké a nesouvisející soubory se neotevírají: překlady, fotky, styly, worker, staré commity. Test se pouští ten, který změna může rozbít. Celý `npm test` až před odevzdáním.

Celý projekt se neindexuje pořád. V kořeni je `.cursorignore`. Agent ty složky nesmí číst:

```
node_modules/
.next/
dist/
build/
package-lock.json
test-results/
playwright-report/
blob-report/
playwright/.cache/
_site/
.wrangler/
*.log
.git/
```

První blok je povinný základ (závislosti, sestavené výstupy, zámek balíčků). Zbytek jsou vygenerované složky tohodle repozitáře, které v gitu stejně nejsou, plus logy a celá historie v `.git/`. Nová těžká složka, kterou úkol nepotřebuje, patří sem, ne do čtení agenta.

Krátké pravidlo má agent pořád v `.cursor/rules/prace.mdc`. Delší znění (kontext, kód, dokumentace) je v kořenovém `.cursorrules`. Tahle stránka je jejich čitelná podoba.

## Pull request

Každá úprava jde do vlastní větve a pull requestu. V odpovědi je odkaz na ten request, aby se dal projet. Do `main` se nestrká, dokud není řečeno, že to má jít na ostrý web. Náhled větve je v [pipeline](pipeline.md).

## Náhled před schválením

Než se schválí něco, co host na webu uvidí, agent nejdřív ukáže náhled. Obrázek nebo samostatná stránka ve vzhledu webu, česky. Když se výsledek liší podle telefonu nebo počítače, je v náhledu každý stav. Do `index.html`, `app.html` a ostatních ostrých stránek se to zapíše až po výslovném souhlasu. Drobná oprava, dokumentace a postup podle hotového návodu náhled nepotřebují. Krátké pravidlo je v `.cursor/rules/nahled.mdc`.
