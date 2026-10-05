# Raclette Point Original

Prezentační web sítě Raclette Point. Dokumentace je ve složce [docs](docs/README.md).

Testovací adresa po sloučení do `main`: <https://garath33.github.io/raclette/>

Na té adrese zůstává pruh „Testovací prostředí“ a `noindex`. Po připojení `raclettelovers.com` GitHub tuhle adresu přesměruje. HTTPS a ostatní koncovky čekají na DNS a hosting, postup je v [docs/domeny.md](docs/domeny.md).

```bash
npm ci
npm test
npm start
```

Lokální náhled je na `http://127.0.0.1:4173`.
