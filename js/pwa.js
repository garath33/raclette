(function () {
  const installBtn = document.getElementById("pwa-install");
  const installedNote = document.getElementById("pwa-installed");
  let deferred = null;

  function standalone() {
    return window.matchMedia("(display-mode: standalone)").matches || window.navigator.standalone === true;
  }

  function ios() {
    const ua = navigator.userAgent || "";
    return /iphone|ipad|ipod/i.test(ua) || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
  }

  function mark() {
    const root = document.documentElement;
    if (standalone()) root.dataset.pwa = "installed";
    else if (ios()) root.dataset.pwa = "ios";
    else root.dataset.pwa = "android";
    if (installedNote) installedNote.hidden = !standalone();
    if (installBtn && standalone()) installBtn.hidden = true;
  }

  window.addEventListener("beforeinstallprompt", (event) => {
    event.preventDefault();
    deferred = event;
    if (installBtn && !standalone()) installBtn.hidden = false;
  });

  window.addEventListener("appinstalled", () => {
    deferred = null;
    if (installBtn) installBtn.hidden = true;
    document.documentElement.dataset.pwa = "installed";
    if (installedNote) installedNote.hidden = false;
  });

  if (installBtn) {
    installBtn.addEventListener("click", async () => {
      if (!deferred) return;
      deferred.prompt();
      await deferred.userChoice.catch(() => {});
      deferred = null;
      installBtn.hidden = true;
    });
  }

  const host = location.hostname;
  const local = host === "127.0.0.1" || host === "localhost";
  if ("serviceWorker" in navigator && window.isSecureContext && !local) {
    navigator.serviceWorker.register("sw.js").catch(() => {});
  }

  mark();
})();
