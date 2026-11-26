(function () {
  document.addEventListener("DOMContentLoaded", function () {
    if (document.getElementById("a11y-panel")) return;

    var zoomLevels = [100, 120, 140, 160];
    var zoomIndex = 0;

    var style = document.createElement("style");
    style.textContent =
      "body{padding-bottom:165px !important}" +
      "#a11y-panel{position:fixed;left:8px;right:8px;bottom:84px;z-index:99999;display:flex;gap:8px;flex-wrap:wrap;justify-content:center;align-items:flex-end;padding:10px;border-radius:12px;background:#111827;box-shadow:0 4px 18px rgba(0,0,0,.5);font-family:system-ui,-apple-system,sans-serif;box-sizing:border-box}" +
      "#a11y-panel .a11y-ctrl{display:inline-flex;align-items:center;justify-content:center;min-height:42px;padding:9px 13px;border:2px solid #000000;border-radius:8px;background:#ffffff !important;color:#000000 !important;font-size:13px;font-weight:700;line-height:1.2;text-decoration:none !important;cursor:pointer;white-space:nowrap;transition:padding .15s ease,font-size .15s ease}" +
      "#a11y-panel .a11y-ctrl.a11y-grow{padding-top:16px;padding-bottom:14px;font-size:14px}" +
      "#a11y-panel .a11y-ctrl[aria-pressed=\"true\"]{background:#facc15 !important;color:#000000 !important}" +
      "html.a11y-contrast,html.a11y-contrast body{background:#000000 !important;color:#ffffff !important}" +
      "html.a11y-contrast a:not(.a11y-ctrl){color:#fde047 !important}";
    document.head.appendChild(style);

    var panel = document.createElement("div");
    panel.id = "a11y-panel";
    panel.setAttribute("role", "region");
    panel.setAttribute("aria-label", "Accessibilité");

    function createBtn(id, label, onPress) {
      var btn = document.createElement("button");
      btn.type = "button";
      btn.id = id;
      btn.className = "a11y-ctrl";
      btn.setAttribute("aria-pressed", "false");
      btn.textContent = label;
      btn.addEventListener("click", function () {
        btn.classList.toggle("a11y-grow");
        onPress(btn);
      });
      panel.appendChild(btn);
      return btn;
    }

    function getText() {
      var sel = window.getSelection ? window.getSelection().toString().trim() : "";
      if (sel) return sel;
      var rootEl = document.querySelector("main") || document.body;
      var clone = rootEl.cloneNode(true);
      clone.querySelectorAll("#a11y-panel,script,style,noscript").forEach(function (el) {
        el.remove();
      });
      return (clone.innerText || "").replace(/\s+/g, " ").trim();
    }

    createBtn("a11y-speak-btn", "Lire la page", function (btn) {
      if (!("speechSynthesis" in window)) return;
      if (window.speechSynthesis.speaking) {
        window.speechSynthesis.cancel();
        btn.setAttribute("aria-pressed", "false");
        btn.textContent = "Lire la page";
        return;
      }
      var txt = getText();
      if (!txt) return;

      var utter = new SpeechSynthesisUtterance(txt);
      utter.lang = "fr-FR";
      var reset = function () {
        btn.setAttribute("aria-pressed", "false");
        btn.textContent = "Lire la page";
      };
      utter.onend = reset;
      utter.onerror = reset;

      btn.setAttribute("aria-pressed", "true");
      btn.textContent = "Arrêter";
      window.speechSynthesis.speak(utter);
    });

    createBtn("a11y-font-btn", "Texte +", function (btn) {
      zoomIndex = (zoomIndex + 1) % zoomLevels.length;
      var currentPct = zoomLevels[zoomIndex];
      document.documentElement.style.fontSize = currentPct === 100 ? "" : currentPct + "%";

      if (zoomIndex === 0) {
        btn.setAttribute("aria-pressed", "false");
        btn.textContent = "Texte +";
      } else if (zoomIndex < zoomLevels.length - 1) {
        btn.setAttribute("aria-pressed", "true");
        btn.textContent = "Texte +" + zoomIndex;
      } else {
        btn.setAttribute("aria-pressed", "true");
        btn.textContent = "Texte +" + zoomIndex + " (Reset)";
      }
    });

    createBtn("a11y-contrast-btn", "Contraste +", function (btn) {
      var on = document.documentElement.classList.toggle("a11y-contrast");
      btn.setAttribute("aria-pressed", String(on));
    });

    document.body.appendChild(panel);
  });
})();
