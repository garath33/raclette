# Změny

## 2026-10-28

- Ověření domén a pošty z veřejného DNS a HTTP. Dokumentace `.com` drží jmenné servery Cloudflare `teresa` a `tim`, ne WebHouse. SPF bez Breva a DMARC `p=none` jsou zapsané tak, jak je zóna má. Ruční doručení na `info@` do `raclettepointoriginal@gmail.com` zůstává platné.

## 2026-10-27

- Návod na schránku `info@raclettelovers.com`: jmenné servery, MX, jeden SPF pro Cloudflare a Brevo, DKIM, DMARC, SMTP do Gmailu. Web poštu neodesílá, `.env` se nemění.
- Veřejná adresa na webu je `info@raclettelovers.com`. `info@rakletparty.cz` ze stránek zmizel. E-shop a Facebook na rakletparty zůstávají.
- Příjem `info@raclettelovers.com` míří do `raclettepointoriginal@gmail.com`. Odesílání z toho Gmailu jde přes Brevo. Schránka u WebHouse se nezakládá.
