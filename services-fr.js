(function () {
  function initServicesFr() {
    if (document.getElementById("fr-services-bar")) return;
    if (!document.body) return;

    var portals = [
      { name: "Service-Public", url: "https://www.service-public.fr/" },
      { name: "France.fr", url: "https://www.france.fr/" },
      { name: "Data.gouv.fr", url: "https://www.data.gouv.fr/" },
      { name: "Légifrance", url: "https://www.legifrance.gouv.fr/" }
    ];

    var style = document.createElement("style");
    style.id = "fr-services-style";
    style.textContent =
      "#fr-services-bar{display:flex;flex-direction:column;gap:10px;width:calc(100% - 16px);max-width:680px;margin:12px auto;padding:12px 14px;background:#18181b;color:#f4f4f5;border:1px solid #3f3f46;border-radius:12px;font-family:system-ui,-apple-system,sans-serif;font-size:16px;box-sizing:border-box}" +
      "#fr-services-bar .fr-srv-row{display:flex;flex-wrap:wrap;align-items:center;justify-content:center;gap:8px 10px}" +
      "#fr-services-bar .fr-srv-title{font-size:16px;font-weight:700;color:#facc15}" +
      "#fr-services-bar a{padding:6px 12px;border:2px solid #000000;border-radius:8px;background:#27272a;color:#ffffff;font-size:14px;font-weight:700;text-decoration:none}" +
      "#fr-services-bar a:hover,#fr-services-bar a:focus{background:#facc15;color:#000000}" +
      "#fr-services-bar .fr-holiday-line{text-align:center;font-size:14px;color:#d4d4d8;border-top:1px solid #27272a;padding-top:8px}";
    document.head.appendChild(style);

    var bar = document.createElement("div");
    bar.id = "fr-services-bar";
    bar.setAttribute("role", "region");
    bar.setAttribute("aria-label", "Services publics et jours fériés en France");

    var row = document.createElement("div");
    row.className = "fr-srv-row";

    var title = document.createElement("span");
    title.className = "fr-srv-title";
    title.textContent = "Portails FR :";
    row.appendChild(title);

    portals.forEach(function (item) {
      var a = document.createElement("a");
      a.href = item.url;
      a.target = "_blank";
      a.rel = "noopener noreferrer";
      a.textContent = item.name;
      row.appendChild(a);
    });

    var holidayLine = document.createElement("div");
    holidayLine.className = "fr-holiday-line";
    holidayLine.id = "fr-next-holiday";
    holidayLine.setAttribute("aria-live", "polite");
    holidayLine.textContent = "Prochain jour férié (France) : chargement...";

    bar.appendChild(row);
    bar.appendChild(holidayLine);

    var anchor =
      document.getElementById("fr-arts-bar") ||
      document.getElementById("fr-radio-bar") ||
      document.getElementById("fr-meteo-bar") ||
      document.getElementById("a11y-panel");

    if (anchor && anchor.parentNode) {
      anchor.parentNode.insertBefore(bar, anchor.nextSibling);
    } else {
      document.body.appendChild(bar);
    }

    function loadNextHoliday() {
      var url =
        "https://calendrier.api.gouv.fr/jours-feries/metropole.json?_=" +
        Date.now();

      fetch(url, { cache: "no-store" })
        .then(function (res) {
          if (!res.ok) throw new Error("HTTP " + res.status);
          return res.json();
        })
        .then(function (data) {
          var today = new Date().toISOString().slice(0, 10);
          var dates = Object.keys(data).sort();
          var nextDate = null;

          for (var i = 0; i < dates.length; i++) {
            if (dates[i] >= today) {
              nextDate = dates[i];
              break;
            }
          }

          if (!nextDate) {
            holidayLine.textContent = "—";
            return;
          }

          var parts = nextDate.split("-");
          var d = new Date(
            Number(parts[0]),
            Number(parts[1]) - 1,
            Number(parts[2])
          );

          var dateFr = d.toLocaleDateString("fr-FR", {
            day: "numeric",
            month: "long",
            year: "numeric"
          });

          holidayLine.textContent =
            "Prochain jour férié : " + dateFr + " — " + data[nextDate];
        })
        .catch(function () {
          holidayLine.textContent =
            "Jours fériés : temporairement indisponible";
        });
    }

    loadNextHoliday();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initServicesFr);
  } else {
    initServicesFr();
  }
})();
