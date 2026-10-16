# Přidání překladů celeb.ig

Do `index.html` (a případně dalších stránek, které načítají i18n) **hned za** `
<script src="js/i18n-extra.js"></script>`
vložit:

```html
  <script src="js/i18n-ig.js"></script>
```

Skript doplní klíč `celeb.ig` do všech 9 jazyků, aby test „každý data-i18n klíč ze stránky je přeložený“ prošel.
