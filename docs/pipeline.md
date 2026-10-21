# Pipeline

```text
větev cursor/…  →  náhled na *.workers.dev (hned po pushi, ještě před sloučením)
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

Cloudflare **Workers Builds** (napojený na GitHub) nasadí stejnou větev ještě jednou jako náhled. Ostré domény se tím nemění.

## Náhled k otestování

Autor webu zkouší změny na náhledu větve, ne až po sloučení do `main`. GitHub Pages se aktualizuje jen z `main`. U každé úpravy, kterou má projít v prohlížeči, patří do odpovědi odkaz na náhled.

Adresa se skládá z názvu větve: lomítka se změní na pomlčky, na konec se připojí `-raclette.simunek-m.workers.dev`.

| Větev | Náhled |
| --- | --- |
| `cursor/dairy-menu-designs-bccf` | <https://cursor-dairy-menu-designs-bccf-raclette.simunek-m.workers.dev/> |

Česky: přidej `?lang=cs`. Partneři jsou na `/pro-partnery?lang=cs`. Náhled má zkušební pruh a `noindex`. Nahý `raclette.simunek-m.workers.dev` není veřejný (`workers_dev` je vypnuté), platí jen adresa větve. Po pushi chvíli trvá, než Workers Builds stránku přebuduje.

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

## Lokální náhled

```bash
npm ci
npm start
```

Stránka je na `http://127.0.0.1:4173`.

## Po ostrém nasazení

Po sloučení do `main` a nasazení na ostré domény se v odpovědi zopakuje registrace `sitemap.xml` v Google Search Console. Kroky a stav jsou v [SEO](seo.md). Připomínka končí, až je v tom dokumentu datum potvrzení.

## Co se na hosting nekopíruje

Testy, `node_modules`, dokumentace a konfigurace zůstávají v gitu. Worker bere veřejné soubory podle `wrangler.jsonc` a `.assetsignore`.
