# Pipeline

```text
větev cursor/…  →  CI + Cloudflare Workers preview na pull requestu
                         ↓
                  sloučení / push do main
                         ↓
        ┌────────────────┴────────────────┐
        ↓                                 ↓
  GitHub Pages                         Cloudflare Worker
  www.raclettelovers.com           raclettelovers.cz / .sk / .ch
  github.io → přesměrování na www  aliasy → 301 na cílovou doménu
  obsah se indexuje                obsah se indexuje
```

## Proč dřív „commit and merge“ nevypadalo jako publikace

1. Workflow **Deploy production** po testech **záměrně končil chybou** (`exit 1`) s textem, že ostrý hosting není připojený — i když Worker `raclette` už běžel.
2. Dokumentace tvrdila totéž, takže merge vypadal jako „jen test“.
3. Ostrý provoz je na **Cloudflare Workeru**, ne na GitHub Pages. Pages aktualizuje zkušební `github.io` (a zatím i `www.raclettelovers.com`, které na Pages ještě míří).

## Co se stane po sloučení do `main`

1. **CI** — unit + e2e testy.
2. **Deploy test environment** — GitHub Pages. `github.io` se přesměruje na `https://www.raclettelovers.com/`. Obsah na `www` se indexuje. Pruh a `noindex` zůstávají jen když se HTML otevře přímo na `github.io` nebo na localhostu.
3. **Deploy production** — `npx wrangler deploy` Workeru `raclette` na ostré domény Cloudflare (`.cz`, `.sk`, `.ch` a aliasy). Vyžaduje secret `CLOUDFLARE_API_TOKEN`.

Cloudflare **Workers Builds** (napojený na GitHub) může nasadit paralelní build z `main` nebo z PR jako preview. Spolehlivá cesta z repozitáře je workflow výše.

## Secret pro ostré nasazení

V GitHubu: **Settings → Secrets and variables → Actions → New repository secret**

| Name | Value |
| --- | --- |
| `CLOUDFLARE_API_TOKEN` | API token s právem upravit Workers (stejný typ jako v Cursor Secrets) |

Bez secretu workflow Deploy production **přeskočí** `wrangler deploy` (varování v logu) a jen ověří, že ostré domény odpovídají. Token už může být v Cursor Secrets — do Actions ho zkopíruj zvlášť, ať Actions nasazuje samo a nespoléhá jen na Workers Builds.

## Ruční znovunasazení

Actions → **Deploy production** → Run workflow (větev `main`).

Lokálně (s tokenem v prostředí):

```bash
npm ci
npx wrangler deploy
```

## Agent: vždy dva kroky a jasný stav PR

Po změnách kódu agent **nesmí** tvrdit, že je věc na ostrém webu, dokud neproběhne sloučení do `main` a nasazení Workeru.

1. **Commit + push + PR** — agent oznámí výsledek: že PR vznikl/aktualizoval se, URL PR, a zda CI na větvi PR doběhlo (nebo že na výsledek CI ještě čeká). Samotný push na feature větev **není** produkce.
2. **Nahrát na ostro** — agent se **výslovně zeptá**, jestli má sloučit PR do `main` a nasadit Cloudflare Worker (`raclettelovers.*`). Teprve po souhlasu („nahrát na ostro“, „na produkci“ atd.) merge + deploy provede a nahlásí výsledek (commit na `main`, stav CI, ověření živého webu).

Když CI selže, agent to řekne hned a na produkci se neptá, dokud není oprava hotová.

## Lokální náhled

```bash
npm ci
npm start
```

Stránka je na `http://127.0.0.1:4173`.

## Co se na hosting nekopíruje

Testy, `node_modules`, dokumentace a konfigurace zůstávají v gitu. Worker bere veřejné soubory podle `wrangler.jsonc` a `.assetsignore`.
