# Změny

## 2026-11-10

- Návod k instalaci začíná větou „Instalace v anonymním okně nefunguje. Otevřete stránku v běžném okně.“ Je první řádek v panelu na stránce aplikace a hned pod úvodem v sekci Uložit na plochu na hlavní stránce. Uvidí ji každý, kdo návod otevře, v anonymním i v běžném okně. Po instalaci ikony zmizí. Náhled `nahled/anonym.html` je pryč.

## 2026-11-06

- Aplikace Raclette Lovers nabízí stejných devět jazyků jako web. Kratší seznam nechával v menu jen češtinu, slovenštinu, angličtinu a francouzštinu, i když ostatní překlady už byly hotové.

## 2026-11-01

- Náhled věty, že instalace v anonymním okně nefunguje, je na `nahled/anonym.html`. Uvidí ji každý, kdo otevře návod, v anonymním i v běžném okně. Do ostrých stránek se nezapojí, dokud není schválený.

## 2026-10-31

- Testy v GitHub Actions běží na `ubuntu-24.04`. Na `ubuntu-latest` (26.04) Playwright 1.55 prohlížeč nenainstaluje a `npm test` se nespustí.
- Návod pro agenta: než host uvidí novou věc na webu, nejdřív náhled a schválení. Pravidlo je v `.cursor/rules/nahled.mdc` a ve vedení dokumentace.
- Náhled nápovědy na plochu podle telefonu je na `nahled/plocha.html`. Do ostrých stránek se nezapojí, dokud není schválený.

## 2026-10-28

- Ověření domén a pošty z veřejného DNS a HTTP. Dokumentace `.com` drží jmenné servery Cloudflare `teresa` a `tim`, ne WebHouse. SPF bez Breva a DMARC `p=none` jsou zapsané tak, jak je zóna má. Ruční doručení na `info@` do `raclettepointoriginal@gmail.com` zůstává platné.

## 2026-10-27

- Návod na schránku `info@raclettelovers.com`: jmenné servery, MX, jeden SPF pro Cloudflare a Brevo, DKIM, DMARC, SMTP do Gmailu. Web poštu neodesílá, `.env` se nemění.
- Veřejná adresa na webu je `info@raclettelovers.com`. `info@rakletparty.cz` ze stránek zmizel. E-shop a Facebook na rakletparty zůstávají.
- Příjem `info@raclettelovers.com` míří do `raclettepointoriginal@gmail.com`. Odesílání z toho Gmailu jde přes Brevo. Schránka u WebHouse se nezakládá.
