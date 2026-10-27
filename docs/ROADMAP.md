# Plán

## Schránka info@raclettelovers.com

Návod je v [e-mailu](email.md). Na webu už je `info@raclettelovers.com`. `.env` se nemění, příjemce formuláře zůstává `milan@raclette-original.com`.

Zbývá nastavení u WebHouse, Cloudflare, Breva a Gmailu: nejdřív přenést záznamy webu bez proxy, pak vyměnit jmenné servery, zapnout Email Routing na `info@` a odesílání přes Brevo. Cílová schránka pro přesměrování se doplní, až ji majitel řekne. Placený e-mail u WebHouse se nepoužívá. Worker `raclette` se na `.com` nepřidává.
