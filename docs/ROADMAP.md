# Plán

## Schránka info@raclettelovers.com

Návod a ověřený stav jsou v [e-mailu](email.md). Na webu je `info@raclettelovers.com`. `.env` se nemění, příjemce formuláře zůstává `milan@raclette-original.com`.

K 28. říjnu 2026 jmenné servery `.com` jsou Cloudflare, webové A a CNAME `www` míří na GitHub Pages a MX Email Routingu běží. Cíl `info@` je `raclettepointoriginal@gmail.com`, doručení i odeslání z Gmailu jsou ověřené ručně. Placený e-mail u WebHouse se nepoužívá. Worker `raclette` se na `.com` nepřidává.

Veřejný SPF má jen Cloudflare. Pošta kvůli tomu chodí dál. Volitelný přepis toho jednoho TXT o `include:spf.brevo.com` je v [e-mailu](email.md). DMARC nech na `p=none`, dokud originál odeslaného dopisu neukáže `dkim=pass`.
