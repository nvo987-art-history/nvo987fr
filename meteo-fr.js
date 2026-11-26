(function () {
  function initMeteoFr() {
    if (document.getElementById("fr-meteo-bar")) return;
    if (!document.body) return;

    var cities = [
      { name: "Paris", lat: 48.8566, lon: 2.3522 },
      { name: "Lyon", lat: 45.764, lon: 4.8357 },
      { name: "Marseille", lat: 43.2965, lon: 5.3698 },
      { name: "Bordeaux", lat: 44.8378, lon: -0.5792 },
      { name: "Nice", lat: 43.7102, lon: 7.262 },
      { name: "Strasbourg", lat: 48.5734, lon: 7.7521 }
    ];

    var style = document.createElement("style");
    style.id = "fr-meteo-style";
    style.textContent =
      "#fr-meteo-bar{display:flex;flex-wrap:wrap;align-items:center;justify-content:center;gap:8px 14px;width:calc(100% - 16px);max-width:680px;margin:12px auto;padding:12px 14px;background:#18181b;color:#f4f4f5;border:1px solid #3f3f46;border-radius:12px;font-family:system-ui,-apple-system,sans-serif;font-size:16px;line-height:1.45;box-sizing:border-box}" +
      "#fr-meteo-bar .fr-meteo-title{font-size:17px;font-weight:700;color:#facc15}" +
      "#fr-meteo-bar .fr-meteo-item{font-size:16px;white-space:nowrap}" +
      "#fr-meteo-bar .fr-meteo-meta{font-size:13px;color:#a1a1aa}" +
      "#fr-meteo-bar .fr-meteo-refresh{padding:7px 14px;border:2px solid #000000;border-radius:8px;background:#ffffff;color:#000000;font-size:14px;font-weight:700;cursor:pointer}" +
      "#fr-meteo-bar .fr-meteo-refresh:hover,#fr-meteo-bar .fr-meteo-refresh:focus{background:#facc15;color:#000000}";
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
    refreshBtn.id = "fr-meteo-refresh-btn";
    refreshBtn.className = "fr-meteo-refresh";
    refreshBtn.textContent = "Actualiser";
    bar.appendChild(refreshBtn);

    var timeStamp = document.createElement("span");
    timeStamp.id = "fr-meteo-updated";
    timeStamp.className = "fr-meteo-meta";
    bar.appendChild(timeStamp);

    var a11yPanel = document.getElementById("a11y-panel");
    if (a11yPanel && a11yPanel.parentNode) {
      a11yPanel.parentNode.insertBefore(bar, a11yPanel);
    } else {
      document.body.appendChild(bar);
    }

    function formatTimeNow() {
      try {
        return new Date().toLocaleTimeString("fr-FR", {
          timeZone: "Europe/Paris",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit"
        });
      } catch (e) {
        return "";
      }
    }

    function fetchSingleCity(city, stamp) {
      var u =
        "https://api.open-meteo.com/v1/forecast?latitude=" +
        city.lat +
        "&longitude=" +
        city.lon +
        "&current=temperature_2m&timezone=Europe%2FParis&_t=" +
        stamp;
      return fetch(u, { cache: "no-store" })
        .then(function (r) {
          if (!r.ok) throw new Error("HTTP " + r.status);
          return r.json();
        })
        .then(function (d) {
          return d && d.current && typeof d.current.temperature_2m === "number"
            ? Math.round(d.current.temperature_2m) + "°C"
            : "--°C";
        })
        .catch(function () {
          return "--°C";
        });
    }

    function renderTemps(temps) {
      listWrap.innerHTML = "";
      temps.forEach(function (tempStr, idx) {
        if (idx > 0) {
          listWrap.appendChild(document.createTextNode(" • "));
        }
        var span = document.createElement("span");
        span.className = "fr-meteo-item";
        var strong = document.createElement("strong");
        strong.textContent = cities[idx].name;
        span.appendChild(strong);
        span.appendChild(document.createTextNode(" " + tempStr));
        listWrap.appendChild(span);
      });
      var nowStr = formatTimeNow();
      timeStamp.textContent = nowStr ? "MAJ " + nowStr : "";
      refreshBtn.disabled = false;
    }

    function loadWeather() {
      var stamp = Date.now();
      listWrap.textContent = "Chargement...";
      refreshBtn.disabled = true;

      var lats = cities.map(function (c) { return c.lat; }).join(",");
      var lons = cities.map(function (c) { return c.lon; }).join(",");
      var batchUrl =
        "https://api.open-meteo.com/v1/forecast?latitude=" +
        lats +
        "&longitude=" +
        lons +
        "&current=temperature_2m&timezone=Europe%2FParis&_t=" +
        stamp;

      fetch(batchUrl, { cache: "no-store" })
        .then(function (res) {
          if (!res.ok) throw new Error("HTTP " + res.status);
          return res.json();
        })
        .then(function (data) {
          var items = Array.isArray(data) ? data : [data];
          if (items.length !== cities.length) {
            return Promise.all(
              cities.map(function (c) { return fetchSingleCity(c, stamp); })
            ).then(renderTemps);
          }
          var temps = cities.map(function (_, idx) {
            var item = items[idx];
            return item && item.current && typeof item.current.temperature_2m === "number"
              ? Math.round(item.current.temperature_2m) + "°C"
              : "--°C";
          });
          renderTemps(temps);
        })
        .catch(function () {
          Promise.all(
            cities.map(function (c) { return fetchSingleCity(c, stamp); })
          ).then(renderTemps);
        });
    }

    refreshBtn.addEventListener("click", function (e) {
      e.preventDefault();
      loadWeather();
    });

    loadWeather();
    setInterval(loadWeather, 3600000);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initMeteoFr);
  } else {
    initMeteoFr();
  }
})();
