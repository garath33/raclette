# Ověření modelu

Před větším úkolem nebo novou feature agent nejdřív v odpovědi zhodnotí, jestli na něj stačí model zvolený v Cursoru. Drobná oprava, úprava dokumentace a postup podle hotového návodu se bez toho obejdou.

Název feature dosadí a odpoví na otázku:

> Než začneme, zhodnoť, zda je tento úkol (implementace [název feature]) adekvátní pro aktuálně zvolený model v Cursoru, nebo zda by pro komplexní architekturu / psaní kódu / refaktoring byl vhodnější jiný model (např. přechod na silnější model pro návrh architektury a lehčí model pro drobné úpravy). Navrhni optimální rozdělení.

Návrh rozdělení je v té samé odpovědi, ještě před úpravou kódu. Silnější model na architekturu a lehčí na drobné úpravy, když to dává smysl. Agent sám na jiný model nepřechází.

Stejné pravidlo má pořád v `.cursor/rules/model.mdc`.
