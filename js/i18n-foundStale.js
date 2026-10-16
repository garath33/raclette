/* Override points.foundStale: network estimate already drives navigation; do not ask to turn location on. */
(function () {
  if (typeof TRANSLATIONS === "undefined") return;
  var texts = {
    cs: "Přibližná poloha ze sítě: nejbližší Point je {name}, asi {km}. Navigace vás navede z vaší skutečné polohy.",
    en: "Approximate network location: nearest Point is {name}, about {km}. Navigation will start from your real location.",
    fr: "Position approximative via le réseau : le Point le plus proche est {name}, à environ {km}. La navigation partira de votre position réelle.",
    sk: "Približná poloha zo siete: najbližší Point je {name}, asi {km}. Navigácia vás navedie z vašej skutočnej polohy.",
    it: "Posizione approssimativa dalla rete: il Point più vicino è {name}, a circa {km}. La navigazione partirà dalla tua posizione reale.",
    de: "Ungefähre Netzposition: nächster Point ist {name}, etwa {km}. Die Navigation startet von Ihrem echten Standort.",
    pl: "Przybliżona lokalizacja z sieci: najbliższy Point to {name}, około {km}. Nawigacja poprowadzi z Twojej rzeczywistej lokalizacji.",
    es: "Ubicación aproximada por red: el Point más cercano es {name}, a unos {km}. La navegación partirá de tu ubicación real.",
    ru: "Приблизительное положение по сети: ближайший Point — {name}, примерно {km}. Навигация начнётся с вашего реального местоположения."
  };
  Object.keys(texts).forEach(function (lang) {
    if (TRANSLATIONS[lang]) TRANSLATIONS[lang]["points.foundStale"] = texts[lang];
  });
})();
