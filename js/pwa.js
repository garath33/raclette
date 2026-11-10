(function () {
  const installBtn = document.getElementById("pwa-install");
  const installedNote = document.getElementById("pwa-installed");
  const panel = document.getElementById("pwa-panel");
  const section = document.getElementById("aplikace");
  let deferred = null;

  function standalone() {
    return window.matchMedia("(display-mode: standalone)").matches || window.navigator.standalone === true;
  }

  function ios() {
    const ua = navigator.userAgent || "";
    return /iphone|ipad|ipod/i.test(ua) || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
  }

  function showHowTo() {
    if (panel) {
      if (!panel.hidden && !deferred) {
        panel.hidden = true;
        if (installBtn) installBtn.setAttribute("aria-expanded", "false");
        return;
      }
      panel.hidden = false;
      if (installBtn) installBtn.setAttribute("aria-expanded", "true");
      panel.scrollIntoView({ behavior: "smooth", block: "nearest" });
      return;
    }
    if (section) {
      section.classList.add("is-open");
      if (installBtn) installBtn.setAttribute("aria-expanded", "true");
      section.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }

  function mark() {
    const root = document.documentElement;
    if (standalone()) root.dataset.pwa = "installed";
    else if (ios()) root.dataset.pwa = "ios";
    else root.dataset.pwa = "android";
    if (installedNote) installedNote.hidden = !standalone();
    if (installBtn && standalone()) {
      installBtn.hidden = true;
      if (panel) panel.hidden = true;
    }
  }

  async function installOrExplain() {
    if (standalone()) return;
    showHowTo();
    if (!deferred) return;
    const promptEvent = deferred;
    deferred = null;
    try {
      promptEvent.prompt();
      await promptEvent.userChoice;
    } catch (e) {
      /* prohlížeč instalaci nenabídl, věta v panelu zůstává */
    }
  }

  window.addEventListener("beforeinstallprompt", (event) => {
    event.preventDefault();
    deferred = event;
  });

  window.addEventListener("appinstalled", () => {
    deferred = null;
    document.documentElement.dataset.pwa = "installed";
    if (installBtn) installBtn.hidden = true;
    if (installedNote) installedNote.hidden = false;
    if (panel) panel.hidden = false;
  });

  if (installBtn) {
    installBtn.addEventListener("click", (event) => {
      event.preventDefault();
      installOrExplain();
    });
  }

  const host = location.hostname;
  const local = host === "127.0.0.1" || host === "localhost";
  if ("serviceWorker" in navigator && window.isSecureContext && !local) {
    navigator.serviceWorker.register("sw.js").catch(() => {});
  }

  mark();
  if (location.hash === "#na-plochu" || location.hash === "#aplikace") {
    showHowTo();
  }
})();
