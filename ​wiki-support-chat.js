(function () {
  function initSupportChat() {
    if (document.getElementById("nvo-support-chat-wrap")) return;
    if (!document.body) return;

    var style = document.createElement("style");
    style.id = "nvo-support-chat-style";
    style.textContent =
      "#nvo-bubble-btn{position:fixed !important;right:16px !important;bottom:16px !important;z-index:2147483647 !important;display:inline-flex !important;visibility:visible !important;opacity:1 !important;align-items:center !important;justify-content:center !important;min-width:64px !important;min-height:64px !important;padding:0 18px !important;border:2px solid #000000 !important;border-radius:999px !important;background:#ffffff !important;color:#000000 !important;font-family:system-ui,-apple-system,sans-serif !important;font-size:16px !important;font-weight:700 !important;cursor:pointer !important;box-shadow:0 8px 24px rgba(0,0,0,.65) !important;box-sizing:border-box !important;pointer-events:auto !important}" +
      "#nvo-bubble-btn.is-hidden{display:none !important}" +
      "#nvo-bubble-btn:hover,#nvo-bubble-btn:focus{background:#facc15 !important;color:#000000 !important}" +
      "#nvo-support-backdrop{display:none;position:fixed !important;inset:0 !important;z-index:2147483647 !important;background:rgba(0,0,0,.72);padding:12px;box-sizing:border-box;overflow-y:auto}" +
      "#nvo-support-backdrop.is-open{display:flex !important;align-items:flex-end;justify-content:flex-end}" +
      "@media (max-width:540px){#nvo-support-backdrop.is-open{align-items:center;justify-content:center}}" +
      "#nvo-support-win{width:100%;max-width:440px;height:78vh;max-height:620px;display:flex;flex-direction:column;background:#18181b;color:#f4f4f5;border:1px solid #52525b;border-radius:14px;overflow:hidden;font-family:system-ui,-apple-system,sans-serif;box-shadow:0 14px 36px rgba(0,0,0,.75);box-sizing:border-box}" +
      "#nvo-support-head{display:flex;align-items:center;justify-content:space-between;gap:8px;padding:12px 14px;background:#09090b;border-bottom:1px solid #27272a}" +
      "#nvo-support-title{font-size:17px;font-weight:700;color:#facc15}" +
      "#nvo-support-close{min-width:40px;min-height:40px;border:1px solid #71717a;border-radius:8px;background:#27272a !important;color:#ffffff !important;font-size:20px;font-weight:700;cursor:pointer;line-height:1}" +
      "#nvo-support-close:hover,#nvo-support-close:focus{background:#facc15 !important;color:#000000 !important}" +
      "#nvo-support-messages{flex:1 1 auto;overflow-y:auto;padding:14px;display:flex;flex-direction:column;gap:10px;background:#111114}" +
      ".nvo-msg-user{align-self:flex-end;max-width:85%;padding:10px 12px;border-radius:12px 12px 2px 12px;background:#27272a;color:#ffffff;font-size:15px;line-height:1.45;border:1px solid #3f3f46;word-wrap:break-word}" +
      ".nvo-msg-bot{align-self:flex-start;max-width:90%;padding:10px 12px;border-radius:12px 12px 12px 2px;background:#09090b;color:#f4f4f5;font-size:15px;line-height:1.45;border:1px solid #27272a;word-wrap:break-word}" +
      ".nvo-msg-bot-title{font-weight:700;color:#facc15;margin-bottom:4px;font-size:15px}" +
      ".nvo-msg-link{display:inline-block;margin-top:8px;color:#facc15;font-size:14px;font-weight:700;text-decoration:underline}" +
      "#nvo-support-foot{display:flex;gap:8px;padding:12px;background:#09090b;border-top:1px solid #27272a;flex-wrap:wrap}" +
      "#nvo-support-input{flex:1 1 180px;min-height:44px;padding:8px 12px;border:2px solid #52525b;border-radius:8px;background:#18181b;color:#ffffff;font-size:16px;box-sizing:border-box}" +
      "#nvo-support-send{min-height:44px;padding:8px 14px;border:2px solid #000000;border-radius:8px;background:#ffffff !important;color:#000000 !important;font-size:15px;font-weight:700;cursor:pointer;white-space:nowrap}" +
      "#nvo-support-send:hover,#nvo-support-send:focus{background:#facc15 !important;color:#000000 !important}";
    document.head.appendChild(style);

    var wrap = document.createElement("div");
    wrap.id = "nvo-support-chat-wrap";

    var bubbleBtn = document.createElement("button");
    bubbleBtn.type = "button";
    bubbleBtn.id = "nvo-bubble-btn";
    bubbleBtn.setAttribute("aria-label", "Ouvrir le chat / Open chat");
    bubbleBtn.textContent = "Chat";
    wrap.appendChild(bubbleBtn);

    var backdrop = document.createElement("div");
    backdrop.id = "nvo-support-backdrop";

    var win = document.createElement("div");
    win.id = "nvo-support-win";
    win.setAttribute("role", "dialog");
    win.setAttribute("aria-modal", "true");
    win.setAttribute("aria-labelledby", "nvo-support-title");

    var head = document.createElement("div");
    head.id = "nvo-support-head";

    var title = document.createElement("span");
    title.id = "nvo-support-title";
    title.textContent = "Wiki Chat";
    head.appendChild(title);

    var closeBtn = document.createElement("button");
    closeBtn.type = "button";
    closeBtn.id = "nvo-support-close";
    closeBtn.setAttribute("aria-label", "Fermer / Close");
    closeBtn.textContent = "×";
    head.appendChild(closeBtn);

    win.appendChild(head);

    var messages = document.createElement("div");
    messages.id = "nvo-support-messages";
    win.appendChild(messages);

    var foot = document.createElement("div");
    foot.id = "nvo-support-foot";

    var input = document.createElement("input");
    input.type = "text";
    input.id = "nvo-support-input";
    input.placeholder = "Ask / Demande (any language)...";
    input.setAttribute("aria-label", "Question");
    foot.appendChild(input);

    var sendBtn = document.createElement("button");
    sendBtn.type = "button";
    sendBtn.id = "nvo-support-send";
    sendBtn.textContent = "Envoyer / Send";
    foot.appendChild(sendBtn);

    win.appendChild(foot);
    backdrop.appendChild(win);
    wrap.appendChild(backdrop);
    document.body.appendChild(wrap);

    function addUserMsg(text) {
      var el = document.createElement("div");
      el.className = "nvo-msg-user";
      el.textContent = text;
      messages.appendChild(el);
      messages.scrollTop = messages.scrollHeight;
    }

    function addBotMsg(heading, text, url, linkLabel) {
      var el = document.createElement("div");
      el.className = "nvo-msg-bot";

      if (heading) {
        var h = document.createElement("div");
        h.className = "nvo-msg-bot-title";
        h.textContent = heading;
        el.appendChild(h);
      }

      var body = document.createElement("div");
      body.textContent = text;
      el.appendChild(body);

      if (url) {
        var a = document.createElement("a");
        a.className = "nvo-msg-link";
        a.href = url;
        a.target = "_blank";
        a.rel = "noopener noreferrer";
        a.textContent = linkLabel || "Wikipédia";
        el.appendChild(a);
      }

      messages.appendChild(el);
      messages.scrollTop = messages.scrollHeight;
      return el;
    }

    addBotMsg(
      "Wikipédia Assistant",
      "Bonjour ! Pose ta question dans n'importe quelle langue. / Hello! Ask your question in any language."
    );

    function openChat() {
      backdrop.classList.add("is-open");
      bubbleBtn.classList.add("is-hidden");
      input.focus();
    }

    function closeChat() {
      backdrop.classList.remove("is-open");
      bubbleBtn.classList.remove("is-hidden");
      bubbleBtn.focus();
    }

    bubbleBtn.addEventListener("click", openChat);
    closeBtn.addEventListener("click", closeChat);
    backdrop.addEventListener("click", function (e) {
      if (e.target === backdrop) closeChat();
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && backdrop.classList.contains("is-open")) {
        closeChat();
      }
    });

    function detectLangCode(text) {
      if (/[áéíóöőúüű]/i.test(text) || /\b(mi|milyen|mikor|hol|ki|van|megy|mozi|mozik|film|filmek|párizs|franciaország)\b/i.test(text)) {
        return "hu";
      }
      if (/[àâçéèêëîïôùûüÿœ]/i.test(text) || /\b(quoi|quel|quels|quelle|quelles|qui|où|cinéma|cinémas|paris|film|films)\b/i.test(text)) {
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
      return "en";
    }

    function cleanQuery(raw) {
      return raw
        .replace(/^(mi a|mi az|milyen|mikor|hol|ki a|ki az|qu'est-ce que|qui est|c'est quoi|quel est|quelle est|what is|who is|where is)\s+/i, "")
        .replace(/[?!.]+$/g, "")
        .trim();
    }

    function searchWikiLang(lang, term) {
      var searchUrl =
        "https://" +
        lang +
        ".wikipedia.org/w/api.php?action=query&list=search&srsearch=" +
        encodeURIComponent(term) +
        "&utf8=&format=json&origin=*";

      return fetch(searchUrl)
        .then(function (r) {
          if (!r.ok) throw new Error("HTTP " + r.status);
          return r.json();
        })
        .then(function (data) {
          var hits = data && data.query && data.query.search ? data.query.search : [];
          if (!hits.length) return null;

          var foundTitle = hits[0].title;
          var sumUrl =
            "https://" +
            lang +
            ".wikipedia.org/api/rest_v1/page/summary/" +
            encodeURIComponent(foundTitle);

          return fetch(sumUrl)
            .then(function (r) {
              if (!r.ok) throw new Error("HTTP " + r.status);
              return r.json();
            })
            .then(function (sum) {
              if (!sum || !sum.extract) return null;
              return {
                lang: lang,
                title: sum.title || foundTitle,
                extract: sum.extract,
                pageUrl:
                  (sum.content_urls &&
                    sum.content_urls.desktop &&
                    sum.content_urls.desktop.page) ||
                  "https://" + lang + ".wikipedia.org/wiki/" + encodeURIComponent(foundTitle)
              };
            });
        });
    }

    function queryMultiLangWiki() {
      var raw = input.value.trim();
      if (!raw) return;

      addUserMsg(raw);
      input.value = "";

      var primaryLang = detectLangCode(raw);
      var term = cleanQuery(raw) || raw;
      var fallbacks = ["fr", "en", "hu", "de", "es"].filter(function (l) {
        return l !== primaryLang;
      });
      var order = [primaryLang].concat(fallbacks);

      var loadingBubble = addBotMsg(null, "Recherche / Searching...");

      function tryNext(idx) {
        if (idx >= order.length) {
          loadingBubble.remove();
          addBotMsg(
            "Wikipédia",
            "Aucun résultat / No result found for « " + term + " »."
          );
          return;
        }

        var lang = order[idx];
        searchWikiLang(lang, term)
          .then(function (res) {
            if (res) {
              loadingBubble.remove();
              addBotMsg(
                res.title,
                res.extract,
                res.pageUrl,
                "Wikipédia (" + res.lang.toUpperCase() + ")"
              );
            } else {
              tryNext(idx + 1);
            }
          })
          .catch(function () {
            tryNext(idx + 1);
          });
      }

      tryNext(0);
    }

    sendBtn.addEventListener("click", queryMultiLangWiki);
    input.addEventListener("keydown", function (e) {
      if (e.key === "Enter") queryMultiLangWiki();
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initSupportChat);
  } else {
    initSupportChat();
  }
})();
