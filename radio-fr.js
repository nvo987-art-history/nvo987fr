(function () {
  document.addEventListener("DOMContentLoaded", function () {
    if (document.getElementById("fr-radio-bar")) return;

    var stations = [
      { name: "France Culture", url: "https://www.radiofrance.fr/franceculture" },
      { name: "FIP", url: "https://www.radiofrance.fr/fip" },
      { name: "France Inter", url: "https://www.radiofrance.fr/franceinter" },
      { name: "France Info", url: "https://www.radiofrance.fr/franceinfo" },
      { name: "RFI", url: "https://www.rfi.fr/fr/" }
    ];

    var style = document.createElement("style");
    style.textContent =
      "#fr-radio-bar{display:flex;flex-wrap:wrap;align-items:center;justify-content:center;gap:8px;width:calc(100% - 16px);max-width:680px;margin:12px auto;padding:12px 14px;background:#18181b;color:#f4f4f5;border:1px solid #3f3f46;border-radius:12px;font-family:system-ui,-apple-system,sans-serif;font-size:16px;line-height:1.4;box-sizing:border-box}" +
      "#fr-radio-bar .fr-radio-title{font-size:17px;font-weight:700;color:#facc15;margin-right:4px}" +
      "#fr-radio-bar .fr-radio-btn{display:inline-flex;align-items:center;justify-content:center;min-height:40px;padding:8px 13px;border:2px solid #000000;border-radius:8px;background:#ffffff !important;color:#000000 !important;font-size:15px;font-weight:700;text-decoration:none !important;white-space:nowrap}" +
      "#fr-radio-bar .fr-radio-btn:hover,#fr-radio-bar .fr-radio-btn:focus{background:#facc15 !important;color:#000000 !important}";
    document.head.appendChild(style);

    var bar = document.createElement("div");
    bar.id = "fr-radio-bar";
    bar.setAttribute("role", "region");
    bar.setAttribute("aria-label", "Radios françaises");

    var title = document.createElement("span");
    title.className = "fr-radio-title";
    title.textContent = "Radio FR :";
    bar.appendChild(title);

    stations.forEach(function (st) {
      var a = document.createElement("a");
      a.href = st.url;
      a.target = "_blank";
      a.rel = "noopener noreferrer";
      a.className = "fr-radio-btn";
      a.textContent = st.name;
      bar.appendChild(a);
    });

    var meteoBar = document.getElementById("fr-meteo-bar");
    var a11yPanel = document.getElementById("a11y-panel");
    var anchor = meteoBar || a11yPanel;
    if (anchor && anchor.parentNode) {
      anchor.parentNode.insertBefore(bar, anchor);
    } else {
      document.body.appendChild(bar);
    }
  });
})();
