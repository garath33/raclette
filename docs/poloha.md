# Poloha

Jedno klepnutí na „Najdi nejbližší Raclette point.“ Spustí se dva odečty najednou. Dialog zapnutí polohy na Androidu zůstává.

## Pořadí

1. Hned hrubá poloha ze sítě. Wi-Fi a mobilní síť (`enableHighAccuracy: false`). Bývá to stovky metrů až pár kilometrů. Jakmile dorazí, stránka ukáže nejbližší Point. Na satelit se nečeká.
2. Ve stejném klepnutí přesná poloha. GPS (`enableHighAccuracy: true`) přes `watchPosition`. Android proto může ukázat dialog „Přesnost určování polohy“. Ten dialog se nevypíná.
3. Když pozdější odečet zpřesní polohu aspoň o 30 metrů, stránka sama přepočítá nejbližší Point. Další klepnutí není potřeba.
4. Dokud nepřijde první odečet, hrubá poloha se ptá znovu každé 3 sekundy, nejvýš 24 sekund. Zapnutí polohy v dialogu tedy stačí jednou.
5. Chyba jednoho odečtu (dialog se zavře, GPS ještě nemá signál) druhý neruší. Sledování skončí, jen když je oprávnění odmítnuté, nebo když za 24 sekund nepřijde nic.

Síť je rychlá a uvnitř domu často jediná dostupná. GPS je venku přesnější, ale první vteřiny po zapnutí nic nevrátí a zavření dialogu ten požadavek někdy zruší. Proto se síť ukáže hned a GPS běží dál.

## Co se nepoužívá

Telefon a tablet neberou polohu z IP (`/api/where`). IP operátora často sedí v jiném městě. Notebook smí IP použít, když prohlížeč polohu nedá, nebo je prohlížečový bod od IP dál než 8 km.

Odkaz do Google Maps má jen cíl. Start je „Vaše poloha“ v Mapách, ne jednorázový pin z webu.

## Hlášky

| Stav | Klíč |
| --- | --- |
| Oprávnění je, ale za čas nic nepřišlo | `points.timeout` |
| Prohlížeč polohu zamítl | `points.deniedSite` |
| Nainstalovaná aplikace polohu nemá | `points.needGpsInstalled` |
| Prohlížeč se ještě neptal | `points.needGpsPrompt` |

## Kde to v kódu je

`readMobileWatch` v `js/geo.js`. Stránka i aplikace po přesnějším odečtu volají `onRefine` a znovu spočítají nejbližší Point (`js/app.js`, `js/lovers-app.js`). Po změně JavaScriptu se zvedne verze v `sw.js`, jinak telefon zůstane u staré kopie.
