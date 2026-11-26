(function () {
  document.addEventListener("DOMContentLoaded", function () {
    if (document.getElementById("fr-meteo-bar")) return;

    var cities = [
      { name: "Paris", lat: 48.8566, lon: 2.3522 },
      { name: "Lyon", lat: 45.764, lon: 4.8357 },
      { name: "Marseille", lat: 43.2965, lon: 5.3698 },
      { name: "Bordeaux", lat: 44.8378, lon: -0.5792 },
      { name: "Nice", lat: 43.7102, lon: 7.262 },
      { name: "Strasbourg", lat: 48.5734, lon: 7.7521 }
    ];

    var style = document.createElement("style");
    style.textContent =
      "#fr-meteo-bar{display:flex;flex-wrap:wrap;align-items:center;justify-content:center;gap:6px 14px;padding:8px 12px;background:#18181b;color:#f4f4f5;border-top:1px solid #3f3f46;border-bottom:1px solid #3f3f46;font-family:system-ui,-apple-system,sans-serif;font-size:13px;line-height:1.3;box-sizing:border-box}" +
      "#fr-meteo-bar .fr-meteo-title{font-weight:700;color:#facc15}" +
      "#fr-meteo-bar .fr-meteo-item{white-space:nowrap}" +
      "#fr-meteo-bar .fr-meteo-refresh{padding:3px 8px;border:1px solid #71717a;border-radius:5px;background:#27272a;color:#ffffff;font-size:12px;font-weight:600;cursor:pointer}" +
      "#fr-meteo-bar .fr-meteo-refresh:hover{background:#3f3f46}";
    document.head.appendChild(style);

    var bar = document.createElement("div");
    bar.id = "fr-meteo-bar";
    bar.setAttribute("role", "region");
    bar.setAttribute("aria-label", "Météo en France");

    var title = document.createElement("span");
    title.className = "fr-meteo-title";
    title.textContent = "Météo FR :";
    bar.appendChild(title);

    var listWrap = document.createElement("span");
    listWrap.id = "fr-meteo-cities";
    listWrap.textContent = "Chargement...";
    bar.appendChild(listWrap);

    var refreshBtn = document.createElement("button");
    refreshBtn.type = "button";
    refreshBtn.className = "fr-meteo-refresh";
    refreshBtn.textContent = "Actualiser";
    bar.appendChild(refreshBtn);

    var a11yPanel = document.getElementById("a11y-panel");
    if (a11yPanel && a11yPanel.parentNode) {
      a11yPanel.parentNode.insertBefore(bar, a11yPanel);
    } else {
      document.body.appendChild(bar);
    }

    function loadWeather() {
      var lats = cities.map(function (c) { return c.lat; }).join(",");
      var lons = cities.map(function (c) { return c.lon; }).join(",");
      var url =
        "https://api.open-meteo.com/v1/forecast?latitude=" +
        encodeURIComponent(lats) +
        "&longitude=" +
        encodeURIComponent(lons) +
        "&current=temperature_2m&timezone=Europe%2FParis";

      fetch(url)
        .then(function (res) {
          if (!res.ok) throw new Error("HTTP " + res.status);
          return res.json();
        })
        .then(function (data) {
          var items = Array.isArray(data) ? data : [data];
          var parts = cities.map(function (city, idx) {
            var temp =
              items[idx] &&
              items[idx].current &&
              typeof items[idx].current.temperature_2m === "number"
                ? Math.round(items[idx].current.temperature_2m) + "°C"
                : "--°C";
            return '<span class="fr-meteo-item"><strong>' + city.name + "</strong> " + temp + "</span>";
          });
          listWrap.innerHTML = parts.join(" • ");
        })
        .catch(function () {
          listWrap.textContent = "Météo indisponible";
        });
    }

    refreshBtn.addEventListener("click", loadWeather);
    loadWeather();
    setInterval(loadWeather, 3600000);
  });
})();
