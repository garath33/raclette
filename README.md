# Raclette Point Original

Prezentační web sítě Raclette Point. Dokumentace je ve složce [docs](docs/README.md).

Po sloučení do `main`:

- test: <https://garath33.github.io/raclette/> (pruh + noindex)
- ostrý Worker: <https://raclettelovers.cz/>, `.sk`, `.ch` (Cloudflare)

Pipeline a secret `CLOUDFLARE_API_TOKEN` jsou v [docs/pipeline.md](docs/pipeline.md).

```bash
npm ci
npm test
npm start
npm run deploy   # ostrý Worker, potřebuje CLOUDFLARE_API_TOKEN
```

Lokální náhled je na `http://127.0.0.1:4173`.
