(function () {
  function runWikiPanel() {
    if (document.getElementById("nvo-fr-wiki-box")) return;
    if (!document.body) return;

    var st = document.createElement("style");
    st.textContent =
      "#nvo-fr-wiki-box{width:calc(100% - 16px);max-width:680px;margin:12px auto;padding:12px 14px;background:#18181b;color:#f4f4f5;border:1px solid #3f3f46;border-radius:12px;font-family:system-ui,-apple-system,sans-serif;font-size:16px;line-height:1.45;box-sizing:border-box}" +
      "#nvo-fr-wiki-top{display:flex;align-items:center;justify-content:space-between;gap:10px;flex-wrap:wrap}" +
      "#nvo-fr-wiki-lbl{font-size:17px;font-weight:700;color:#facc15}" +
      "#nvo-fr-wiki-toggle{min-height:40px;padding:7px 14px;border:2px solid #000000;border-radius:8px;background:#ffffff;color:#000000;font-size:15px;font-weight:700;cursor:pointer}" +
      "#nvo-fr-wiki-toggle:hover,#nvo-fr-wiki-toggle:focus{background:#facc15;color:#000000}" +
      "#nvo-fr-wiki-body{display:none;margin-top:12px;padding-top:12px;border-top:1px solid #27272a}" +
      "#nvo-fr-wiki-body.open{display:block}" +
      "#nvo-fr-wiki-intro{margin-bottom:10px;padding:10px 12px;border-radius:8px;background:#09090b;border:1px solid #27272a;font-size:15px}" +
      "#nvo-fr-wiki-form{display:flex;gap:8px;flex-wrap:wrap;margin-bottom:10px}" +
      "#nvo-fr-wiki-q{flex:1 1 180px;min-height:42px;padding:8px 12px;border:2px solid #52525b;border-radius:8px;background:#09090b;color:#ffffff;font-size:16px;box-sizing:border-box}" +
      "#nvo-fr-wiki-go{min-height:42px;padding:8px 14px;border:2px solid #000000;border-radius:8px;background:#ffffff;color:#000000;font-size:15px;font-weight:700;cursor:pointer}" +
      "#nvo-fr-wiki-go:hover,#nvo-fr-wiki-go:focus{background:#facc15;color:#000000}" +
      "#nvo-fr-wiki-out{padding:10px 12px;border-radius:8px;background:#09090b;border:1px solid #27272a;font-size:15px}" +
      "#nvo-fr-wiki-out a{display:inline-block;margin-top:8px;color:#facc15;font-weight:700;text-decoration:underline}";
    document.head.appendChild(st);

    var box = document.createElement("div");
    box.id = "nvo-fr-wiki-box";
    box.setAttribute("role", "region");
    box.setAttribute("aria-label", "Wikipédia");

    var top = document.createElement("div");
    top.id = "nvo-fr-wiki-top";

    var lbl = document.createElement("span");
    lbl.id = "nvo-fr-wiki-lbl";
    lbl.textContent = "Wikipédia :";
    top.appendChild(lbl);

    var toggleBtn = document.createElement("button");
    toggleBtn.type = "button";
    toggleBtn.id = "nvo-fr-wiki-toggle";
    toggleBtn.textContent = "Ouvrir / Open";
    top.appendChild(toggleBtn);

    box.appendChild(top);

    var body = document.createElement("div");
    body.id = "nvo-fr-wiki-body";

    var intro = document.createElement("div");
    intro.id = "nvo-fr-wiki-intro";
    intro.textContent =
      "Bonjour ! Pose ta question dans n'importe quelle langue. / Hello! Ask your question in any language.";
    body.appendChild(intro);

    var form = document.createElement("div");
    form.id = "nvo-fr-wiki-form";

    var input = document.createElement("input");
    input.type = "text";
    input.id = "nvo-fr-wiki-q";
    input.placeholder = "Paris, Cinéma, Hongrie...";
    form.appendChild(input);

    var goBtn = document.createElement("button");
    goBtn.type = "button";
    goBtn.id = "nvo-fr-wiki-go";
    goBtn.textContent = "OK";
    form.appendChild(goBtn);

    body.appendChild(form);

    var out = document.createElement("div");
    out.id = "nvo-fr-wiki-out";
    out.textContent = "—";
    body.appendChild(out);

    box.appendChild(body);

    var radioBar = document.getElementById("fr-radio-bar");
    var meteoBar = document.getElementById("fr-meteo-bar");
    var a11yPanel = document.getElementById("a11y-panel");
    var anchor = radioBar || meteoBar || a11yPanel;

    if (anchor && anchor.parentNode) {
      anchor.parentNode.insertBefore(box, anchor);
    } else {
      document.body.appendChild(box);
    }

    toggleBtn.addEventListener("click", function () {
      var isOpen = body.classList.toggle("open");
      toggleBtn.textContent = isOpen ? "Fermer / Close" : "Ouvrir / Open";
      if (isOpen) input.focus();
    });

    function pickLang(txt) {
      if (/[áéíóöőúüű]/i.test(txt)) return "hu";
      if (/[àâçéèêëîïôùûüÿœ]/i.test(txt)) return "fr";
      if (/[äöüß]/i.test(txt)) return "de";
      if (/[áéíóúñ¿¡]/i.test(txt)) return "es";
      return "en";
    }

    function searchLang(lang, term) {
      var u1 =
        "https://" +
        lang +
        ".wikipedia.org/w/api.php?action=query&list=search&srsearch=" +
        encodeURIComponent(term) +
        "&utf8=&format=json&origin=*";
      return fetch(u1)
        .then(function (r) { return r.json(); })
        .then(function (d) {
          var arr = d && d.query && d.query.search ? d.query.search : [];
          if (!arr.length) return null;
          var t = arr[0].title;
          var u2 =
            "https://" +
            lang +
            ".wikipedia.org/api/rest_v1/page/summary/" +
            encodeURIComponent(t);
          return fetch(u2)
            .then(function (r) { return r.json(); })
            .then(function (s) {
              if (!s || !s.extract) return null;
              return {
                lang: lang,
                title: s.title || t,
                extract: s.extract,
                url:
                  (s.content_urls && s.content_urls.desktop && s.content_urls.desktop.page) ||
                  "https://" + lang + ".wikipedia.org/wiki/" + encodeURIComponent(t)
              };
            });
        });
    }

    function doSearch() {
      var q = input.value.trim();
      if (!q) return;
      out.textContent = "...";
      var order = [pickLang(q), "fr", "en", "hu"].filter(function (v, i, a) {
        return a.indexOf(v) === i;
      });

      function step(i) {
        if (i >= order.length) {
          out.textContent = "Aucun résultat / No result.";
          return;
        }
        searchLang(order[i], q)
          .then(function (res) {
            if (!res) return step(i + 1);
            out.innerHTML = "";
            var head = document.createElement("strong");
            head.textContent = res.title + " (" + res.lang.toUpperCase() + ")";
            var p = document.createElement("div");
            p.style.marginTop = "4px";
            p.textContent = res.extract;
            var link = document.createElement("a");
            link.href = res.url;
            link.target = "_blank";
            link.rel = "noopener noreferrer";
            link.textContent = "Wikipédia";
            out.appendChild(head);
            out.appendChild(p);
            out.appendChild(link);
          })
          .catch(function () {
            step(i + 1);
          });
      }
      step(0);
    }

    goBtn.addEventListener("click", doSearch);
    input.addEventListener("keydown", function (e) {
      if (e.key === "Enter") doSearch();
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", runWikiPanel);
  } else {
    runWikiPanel();
  }
})();
