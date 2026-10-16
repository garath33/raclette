// Doplnění klíče celeb.ig pro Instagram kartu v sekci Reference.
// Načítá se po i18n.js a i18n-extra.js.
(function () {
  if (typeof TRANSLATIONS === "undefined") return;
  const ig = {
    cs: "Sledujte nás na Instagramu",
    en: "Follow us on Instagram",
    fr: "Suivez-nous sur Instagram",
    sk: "Sledujte nás na Instagrame",
    it: "Seguiteci su Instagram",
    de: "Folgen Sie uns auf Instagram",
    pl: "Śledźcie nas na Instagramie",
    es: "Síguenos en Instagram",
    ru: "Следите за нами в Instagram"
  };
  Object.keys(ig).forEach(function (lang) {
    if (TRANSLATIONS[lang]) {
      TRANSLATIONS[lang]["celeb.ig"] = ig[lang];
    }
  });
})();
