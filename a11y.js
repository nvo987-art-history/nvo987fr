(function () {
  document.addEventListener("DOMContentLoaded", function () {
    if (document.getElementById("a11y-panel")) return;

    var style = document.createElement("style");
    style.textContent =
      "#a11y-panel{position:fixed;left:8px;right:8px;bottom:8px;z-index:99999;display:flex;gap:6px;flex-wrap:wrap;justify-content:center;align-items:center;padding:8px;border-radius:10px;background:#111827;box-shadow:0 4px 16px rgba(0,0,0,.45);font-family:system-ui,-apple-system,sans-serif;box-sizing:border-box}" +
      "#a11y-panel .a11y-ctrl{display:inline-flex;align-items:center;justify-content:center;padding:6px 10px;border:2px solid #000000;border-radius:6px;background:#ffffff !important;color:#000000 !important;font-size:12px;font-weight:700;line-height:1.2;text-decoration:none !important;cursor:pointer;white-space:nowrap}" +
      "#a11y-panel .a11y-ctrl[aria-pressed=\"true\"]{background:#facc15 !important;color:#000000 !important}" +
      "html.a11y-font{font-size:120%}" +
      "html.a11y-contrast,html.a11y-contrast body{background:#000000 !important;color:#ffffff !important}" +
      "html.a11y-contrast a:not(.a11y-ctrl){color:#fde047 !important}";
    document.head.appendChild(style);

    var panel = document.createElement("div");
    panel.id = "a11y-panel";
    panel.setAttribute("role", "region");
    panel.setAttribute("aria-label", "Accessibilité");

    var link = document.createElement("a");
    link.id = "a11y-body-link";
    link.href = "#a11y-speak-btn";
    link.className = "a11y-ctrl";
    link.textContent = "Lecture audio";
    link.addEventListener("click", function (e) {
      e.preventDefault();
      var speakBtn = document.getElementById("a11y-speak-btn");
      if (speakBtn) {
        speakBtn.focus();
        speakBtn.click();
      }
    });
    panel.appendChild(link);

    function createBtn(id, label, onPress) {
      var btn = document.createElement("button");
      btn.type = "button";
      btn.id = id;
      btn.className = "a11y-ctrl";
      btn.setAttribute("aria-pressed", "false");
      btn.textContent = label;
      btn.addEventListener("click", function () {
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
      var on = document.documentElement.classList.toggle("a11y-font");
      btn.setAttribute("aria-pressed", String(on));
    });

    createBtn("a11y-contrast-btn", "Contraste +", function (btn) {
      var on = document.documentElement.classList.toggle("a11y-contrast");
      btn.setAttribute("aria-pressed", String(on));
    });

    document.body.appendChild(panel);
  });
})();
