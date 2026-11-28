(function () {
  function initCultureParis() {
    if (document.getElementById("fr-culture-paris-bar")) return;
    if (!document.body) return;

    var portals = [
      { name: "Que Faire à Paris", url: "https://www.paris.fr/quefaire" },
      { name: "Paris je t'aime", url: "https://parisjetaime.com/" },
      { name: "L'Officiel", url: "https://www.offi.fr/" },
      { name: "Culture.gouv.fr", url: "https://www.culture.gouv.fr/" }
    ];

    var style = document.createElement("style");
    style.id = "fr-culture-paris-style";
    style.textContent =
      "#fr-culture-paris-bar{display:flex;flex-direction:column;gap:10px;width:calc(100% - 16px);max-width:680px;margin:12px auto;padding:12px 14px;background:#18181b;color:#f4f4f5;border:1px solid #3f3f46;border-radius:12px;font-family:system-ui,-apple-system,sans-serif;font-size:16px;box-sizing:border-box}" +
      "#fr-culture-paris-bar .fr-cul-top{display:flex;align-items:center;gap:10px;flex-wrap:wrap}" +
      "#fr-culture-paris-bar .fr-cul-badge{padding:4px 10px;border-radius:6px;background:#facc15;color:#000000;font-size:13px;font-weight:800;letter-spacing:0.03em;text-transform:uppercase;flex-shrink:0}" +
      "#fr-culture-paris-bar .fr-cul-msg{color:#f4f4f5;font-size:15px;font-weight:600;text-decoration:none;line-height:1.4;flex:1 1 220px}" +
      "#fr-culture-paris-bar .fr-cul-msg:hover,#fr-culture-paris-bar .fr-cul-msg:focus{color:#facc15;text-decoration:underline}" +
      "#fr-culture-paris-bar .fr-cul-counter{font-size:12px;color:#a1a1aa;font-weight:700}" +
      "#fr-culture-paris-bar .fr-cul-links{display:flex;flex-wrap:wrap;align-items:center;justify-content:center;gap:8px 10px;border-top:1px solid #27272a;padding-top:10px}" +
      "#fr-culture-paris-bar .fr-cul-links a{padding:6px 12px;border:2px solid #000000;border-radius:8px;background:#27272a;color:#ffffff;font-size:14px;font-weight:700;text-decoration:none}" +
      "#fr-culture-paris-bar .fr-cul-links a:hover,#fr-culture-paris-bar .fr-cul-links a:focus{background:#facc15;color:#000000}";
    document.head.appendChild(style);

    var bar = document.createElement("div");
    bar.id = "fr-culture-paris-bar";
    bar.setAttribute("role", "region");
    bar.setAttribute("aria-label", "Actualités culturelles à Paris");

    var top = document.createElement("div");
    top.className = "fr-cul-top";

    var badge = document.createElement("span");
    badge.className = "fr-cul-badge";
    badge.textContent = "Culture Paris";

    var msg = document.createElement("a");
    msg.className = "fr-cul-msg";
    msg.href = "https://www.paris.fr/quefaire";
    msg.target = "_blank";
    msg.rel = "noopener noreferrer";
    msg.textContent = "Chargement de l'agenda culturel de Paris...";

    var counter = document.createElement("span");
    counter.className = "fr-cul-counter";

    top.appendChild(badge);
    top.appendChild(msg);
    top.appendChild(counter);
    bar.appendChild(top);

    var linksRow = document.createElement("div");
    linksRow.className = "fr-cul-links";

    portals.forEach(function (item) {
      var a = document.createElement("a");
      a.href = item.url;
      a.target = "_blank";
      a.rel = "noopener noreferrer";
      a.textContent = item.name;
      linksRow.appendChild(a);
    });

    bar.appendChild(linksRow);

    var anchor =
      document.getElementById("fr-services-bar") ||
      document.getElementById("fr-arts-bar") ||
      document.getElementById("fr-radio-bar") ||
      document.getElementById("fr-meteo-bar") ||
      document.getElementById("a11y-panel");

    if (anchor && anchor.parentNode) {
      anchor.parentNode.insertBefore(bar, anchor.nextSibling);
    } else {
      document.body.appendChild(bar);
    }

    var events = [];
    var currentIndex = 0;
    var paused = false;

    function renderEvent(index) {
      var ev = events[index];
      if (!ev) return;
      msg.textContent = ev.title;
      msg.href = ev.url;
      counter.textContent = (index + 1) + "/" + events.length;
    }

    bar.addEventListener("mouseenter", function () {
      paused = true;
    });
    bar.addEventListener("mouseleave", function () {
      paused = false;
    });
    bar.addEventListener("focusin", function () {
      paused = true;
    });
    bar.addEventListener("focusout", function () {
      paused = false;
    });

    setInterval(function () {
      if (paused || events.length < 2) return;
      currentIndex = (currentIndex + 1) % events.length;
      renderEvent(currentIndex);
    }, 6000);

    var apiUrl =
      "https://opendata.paris.fr/api/explore/v2.1/catalog/datasets/que-faire-a-paris-/records?limit=6&order_by=updated_at%20desc";

    fetch(apiUrl, { cache: "no-store" })
      .then(function (res) {
        if (!res.ok) throw new Error("HTTP " + res.status);
        return res.json();
      })
      .then(function (data) {
        var results = Array.isArray(data.results) ? data.results : [];
        events = results
          .filter(function (r) {
            return r && r.title;
          })
          .map(function (r) {
            var place = r.address_name ? " — " + r.address_name : "";
            return {
              title: r.title + place,
              url: r.url || "https://www.paris.fr/quefaire"
            };
          });

        if (events.length > 0) {
          currentIndex = 0;
          renderEvent(0);
        } else {
          msg.textContent = "Agenda culturel de Paris — expositions, concerts et spectacles";
        }
      })
      .catch(function () {
        msg.textContent = "Agenda culturel de Paris — expositions, concerts et spectacles";
      });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initCultureParis);
  } else {
    initCultureParis();
  }
})();
