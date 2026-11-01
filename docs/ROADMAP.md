# Plán

## Instalace mimo anonymní okno

Čeká na schválení náhledu `nahled/anonym.html`. Věta zní: „Instalace v anonymním okně nefunguje. Otevřete stránku v běžném okně.“ Je první řádek návodu po klepnutí na Na plochu telefonu: na stránce aplikace v `#pwa-panel`, na hlavní stránce v sekci `#aplikace` hned pod úvodní větou. Do okna, které kreslí Chrome, se nevkládá. Po instalaci ikony zmizí spolu s návodem. Do úvodu vedle tří tlačítek nepatří.

## Nápověda na plochu podle telefonu

Čeká na schválení náhledu `nahled/plocha.html`. iPhone v Safari uvidí tři kroky a české video, iPhone mimo Safari nejdřív výzvu otevřít Safari, Android systémovou instalaci Chromu, počítač dvě věty. Sekce uprostřed hlavní stránky v návrhu není. Po souhlasu se náhledová stránka smaže a návod se zapojí do tlačítka Na plochu telefonu.

## Schránka info@raclettelovers.com

Návod a ověřený stav jsou v [e-mailu](email.md). Na webu je `info@raclettelovers.com`. `.env` se nemění, příjemce formuláře zůstává `milan@raclette-original.com`.

K 28. říjnu 2026 jmenné servery `.com` jsou Cloudflare, webové A a CNAME `www` míří na GitHub Pages a MX Email Routingu běží. Cíl `info@` je `raclettepointoriginal@gmail.com`, doručení i odeslání z Gmailu jsou ověřené ručně. Placený e-mail u WebHouse se nepoužívá. Worker `raclette` se na `.com` nepřidává.

Veřejný SPF má jen Cloudflare, `include:spf.brevo.com` v něm není. DMARC je `p=none` s hlášením na `rua@dmarc.brevo.com`. Obojí je popsané v e-mailu. Druhý SPF se nezakládá a `p=quarantine` se nezapíná, dokud vlastní pošta neukáže `dkim=pass`.
