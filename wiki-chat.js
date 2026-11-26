(function () {
  document.addEventListener("DOMContentLoaded", function () {
    if (document.getElementById("nvo-wiki-bar")) return;

    var style = document.createElement("style");
    style.textContent =
      "#nvo-wiki-bar{display:flex;flex-direction:column;gap:10px;width:calc(100% - 16px);max-width:680px;margin:12px auto;padding:12px 14px;background:#18181b;color:#f4f4f5;border:1px solid #3f3f46;border-radius:12px;font-family:system-ui,-apple-system,sans-serif;font-size:16px;line-height:1.45;box-sizing:border-box}" +
      "#nvo-wiki-bar .nvo-wiki-top{display:flex;align-items:center;justify-content:space-between;gap:8px;flex-wrap:wrap}" +
      "#nvo-wiki-bar .nvo-wiki-title{font-size:17px;font-weight:700;color:#facc15}" +
      "#nvo-wiki-bar .nvo-wiki-row{display:flex;gap:8px;flex-wrap:wrap}" +
      "#nvo-wiki-bar .nvo-wiki-input{flex:1 1 220px;min-height:42px;padding:8px 12px;border:2px solid #52525b;border-radius:8px;background:#09090b;color:#ffffff;font-size:15px;box-sizing:border-box}" +
      "#nvo-wiki-bar .nvo-wiki-btn{display:inline-flex;align-items:center;justify-content:center;min-height:42px;padding:8px 14px;border:2px solid #000000;border-radius:8px;background:#ffffff !important;color:#000000 !important;font-size:15px;font-weight:700;cursor:pointer;white-space:nowrap;text-decoration:none !important}" +
      "#nvo-wiki-bar .nvo-wiki-btn:hover,#nvo-wiki-bar .nvo-wiki-btn:focus{background:#facc15 !important;color:#000000 !important}" +
      "#nvo-wiki-bar .nvo-wiki-ans{padding:10px 12px;border-radius:8px;background:#09090b;border:1px solid #27272a;color:#f4f4f5;font-size:15px}" +
      "#nvo-wiki-bar .nvo-wiki-links{display:flex;flex-wrap:wrap;gap:8px;margin-top:8px}" +
      "#nvo-wiki-bar .nvo-wiki-link{color:#facc15;font-size:14px;font-weight:700;text-decoration:underline}";
    document.head.appendChild(style);

    var bar = document.createElement("div");
    bar.id = "nvo-wiki-bar";
    bar.setAttribute("role", "region");
    bar.setAttribute("aria-label", "Wikipédia multilingue");

    var top = document.createElement("div");
    top.className = "nvo-wiki-top";

    var title = document.createElement("span");
    title.className = "nvo-wiki-title";
    title.textContent = "Wiki Chat (toutes langues) :";
    top.appendChild(title);

    var speakBtn = document.createElement("button");
    speakBtn.type = "button";
    speakBtn.className = "nvo-wiki-btn";
    speakBtn.textContent = "Audio";
    top.appendChild(speakBtn);

    bar.appendChild(top);

    var row = document.createElement("div");
    row.className = "nvo-wiki-row";

    var input = document.createElement("input");
    input.type = "text";
    input.className = "nvo-wiki-input";
    input.placeholder = "Írj be bármit bármilyen nyelven (pl. Párizs, Cinéma)...";
    input.setAttribute("aria-label", "Kérdés vagy téma");
    row.appendChild(input);

    var sendBtn = document.createElement("button");
    sendBtn.type = "button";
    sendBtn.className = "nvo-wiki-btn";
    sendBtn.textContent = "Chercher";
    row.appendChild(sendBtn);

    bar.appendChild(row);

    var ansBox = document.createElement("div");
    ansBox.className = "nvo-wiki-ans";
    ansBox.textContent =
      "Írj be egy témát vagy kérdést bármilyen nyelven (magyarul, franciául, angolul stb.), és megkeresem a Wikipédia összefoglalóját.";
    bar.appendChild(ansBox);

    function detectLangCode(text) {
      if (/[áéíóöőúüű]/i.test(text) || /\b(mi|milyen|mikor|hol|ki|van|megy|mozi|mozik|film|filmek|párizs|franciaország|történelem)\b/i.test(text)) {
        return "hu";
      }
      if (/[àâçéèêëîïôùûüÿœ]/i.test(text) || /\b(quoi|quel|quels|quelle|quelles|qui|où|cinéma|cinémas|paris|film|films|histoire)\b/i.test(text)) {
        return "fr";
      }
      if (/[äöüß]/i.test(text) || /\b(was|wer|wo|wann|film|filme|kino|paris)\b/i.test(text)) {
        return "de";
      }
      if (/[áéíóúñ¿¡]/i.test(text) || /\b(qué|quién|dónde|cuándo|cine|película|parís)\b/i.test(text)) {
        return "es";
      }
      if (/\b(what|who|where|when|movie|movies|cinema|film|paris)\b/i.test(text)) {
        return "en";
      }
      return "fr";
    }

    function cleanQuery(raw) {
      return raw
        .replace(/^(mi a|mi az|milyen|mikor|hol|ki a|ki az|mesélj erről:|keress rá:|qu'est-ce que|qui est|c'est quoi|what is|who is)\s+/i, "")
        .replace(/[?!.]+$/g, "")
        .trim();
    }

    function speakText(text, langCode) {
      if (!("speechSynthesis" in window) || !text) return;
      window.speechSynthesis.cancel();
      var utter = new SpeechSynthesisUtterance(text);
      var map = { hu: "hu-HU", fr: "fr-FR", en: "en-US", de: "de-DE", es: "es-ES" };
      utter.lang = map[langCode] || "fr-FR";
      window.speechSynthesis.speak(utter);
    }

    function searchWiki(lang, term, fallbackLang) {
      var endpoint =
        "https://" +
        lang +
        ".wikipedia.org/w/api.php?action=query&list=search&srsearch=" +
        encodeURIComponent(term) +
        "&utf8=&format=json&origin=*";

      return fetch(endpoint)
        .then(function (r) { return r.json(); })
        .then(function (data) {
          var hits = data && data.query && data.query.search ? data.query.search : [];
          if (!hits.length) {
            if (fallbackLang && fallbackLang !== lang) {
              return searchWiki(fallbackLang, term, null);
            }
            return null;
          }
          var titleFound = hits[0].title;
          var sumUrl =
            "https://" +
            lang +
            ".wikipedia.org/api/rest_v1/page/summary/" +
            encodeURIComponent(titleFound);
          return fetch(sumUrl)
            .then(function (r) { return r.json(); })
            .then(function (sum) {
              return {
                lang: lang,
                title: sum.title || titleFound,
                extract: sum.extract || "",
                pageUrl: (sum.content_urls && sum.content_urls.desktop && sum.content_urls.desktop.page) ||
                  ("https://" + lang + ".wikipedia.org/wiki/" + encodeURIComponent(titleFound))
              };
            });
        });
    }

    function runSearch() {
      var raw = input.value.trim();
      if (!raw) return;

      var lang = detectLangCode(raw);
      var term = cleanQuery(raw) || raw;
      var isCinemaQuery = /\b(mozi|mozik|film|filmek|cinéma|cinémas|cinema|movie|movies)\b/i.test(raw);

      ansBox.textContent = "...";

      searchWiki(lang, term, lang === "fr" ? "en" : "fr")
        .then(function (res) {
          if (!res || !res.extract) {
            ansBox.textContent = "Nincs találat erre: „" + term + "”. Próbálj meg egy rövidebb kulcsszót.";
            return;
          }

          var note = "";
          if (isCinemaQuery) {
            note =
              "\n\nMegjegyzés: az élő, napi moziműsorhoz használd a hivatalos műsoroldalakat (a Wikipédia enciklopédikus összefoglalót ad).";
          }

          ansBox.innerHTML = "";
          var p = document.createElement("div");
          p.style.whiteSpace = "pre-line";
          p.textContent = res.title + " — " + res.extract + note;
          ansBox.appendChild(p);

          var linksDiv = document.createElement("div");
          linksDiv.className = "nvo-wiki-links";

          var wikiLink = document.createElement("a");
          wikiLink.className = "nvo-wiki-link";
          wikiLink.href = res.pageUrl;
          wikiLink.target = "_blank";
          wikiLink.rel = "noopener noreferrer";
          wikiLink.textContent = "Wikipédia (" + res.lang.toUpperCase() + ")";
          linksDiv.appendChild(wikiLink);

          if (isCinemaQuery) {
            var allocine = document.createElement("a");
            allocine.className = "nvo-wiki-link";
            allocine.href = "https://www.allocine.fr/seance/";
            allocine.target = "_blank";
            allocine.rel = "noopener noreferrer";
            allocine.textContent = "AlloCiné (Séances FR)";
            linksDiv.appendChild(allocine);
          }

          ansBox.appendChild(linksDiv);
          ansBox.dataset.lang = res.lang;
          ansBox.dataset.speak = res.title + ". " + res.extract;
        })
        .catch(function () {
          ansBox.textContent = "Hiba a Wikipédia elérésekor.";
        });
    }

    sendBtn.addEventListener("click", runSearch);
    input.addEventListener("keydown", function (e) {
      if (e.key === "Enter") runSearch();
    });
    speakBtn.addEventListener("click", function () {
      var toRead = ansBox.dataset.speak || ansBox.textContent;
      var l = ansBox.dataset.lang || detectLangCode(toRead);
      speakText(toRead, l);
    });

    var meteoBar = document.getElementById("fr-meteo-bar");
    var radioBar = document.getElementById("fr-radio-bar");
    var a11yPanel = document.getElementById("a11y-panel");
    var anchor = radioBar || meteoBar || a11yPanel;
    if (anchor && anchor.parentNode) {
      anchor.parentNode.insertBefore(bar, anchor);
    } else {
      document.body.appendChild(bar);
    }
  });
})();
