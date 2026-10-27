# Plán

## Schránka info@raclettelovers.com

Návod je v [e-mailu](email.md). V repozitáři se kvůli ní nemění kód, `.env` ani příjemce formuláře.

Zbývá nastavení u WebHouse, Cloudflare, Breva a Gmailu: nejdřív přenést záznamy webu bez proxy, pak vyměnit jmenné servery, zapnout Email Routing na `info@` a odesílání přes Brevo. Worker `raclette` se na `.com` nepřidává.
