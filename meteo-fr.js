(function () {
  function initMeteoFr() {
    if (document.getElementById("fr-meteo-bar")) return;
    if (!document.body) return;

    var paris = { name: "Paris", lat: 48.8566, lon: 2.3522 };

    var wmoLabels = {
      0: "Ciel dégagé",
      1: "Peu nuageux",
      2: "Partiellement nuageux",
      3: "Couvert",
      45: "Brouillard",
      48: "Brouillard givrant",
      51: "Bruine légère",
      53: "Bruine modérée",
      55: "Bruine dense",
      61: "Pluie faible",
      63: "Pluie modérée",
      65: "Pluie forte",
      71: "Neige faible",
      73: "Neige modérée",
      75: "Neige forte",
      77: "Grains de neige",
      80: "Averses faibles",
      81: "Averses modérées",
      82: "Averses fortes",
      85: "Averses de neige faibles",
      86: "Averses de neige fortes",
      95: "Orage",
      96: "Orage avec grêle légère",
      99: "Orage avec grêle forte"
    };

    var style = document.createElement("style");
    style.id = "fr-meteo-style";
    style.textContent =
      "#fr-meteo-bar{display:flex;flex-wrap:wrap;align-items:center;justify-content:center;gap:8px 14px;width:calc(100% - 16px);max-width:680px;margin:12px auto;padding:12px 14px;background:#18181b;color:#f4f4f5;border:1px solid #3f3f46;border-radius:12px;font-family:system-ui,-apple-system,sans-serif;font-size:16px;line-height:1.45;box-sizing:border-box}" +
      "#fr-meteo-bar .fr-meteo-title{font-size:17px;font-weight:700;color:#facc15}" +
      "#fr-meteo-bar .fr-meteo-item{font-size:16px;white-space:nowrap}" +
      "#fr-meteo-bar .fr-meteo-clock{font-size:15px;font-weight:700;color:#e4e4e7;white-space:nowrap}" +
      "#fr-meteo-bar .fr-meteo-refresh{padding:7px 14px;border:2px solid #000000;border-radius:8px;background:#ffffff;color:#000000;font-size:14px;font-weight:700;cursor:pointer}" +
      "#fr-meteo-bar .fr-meteo-refresh:hover,#fr-meteo-bar .fr-meteo-refresh:focus{background:#facc15;color:#000000}";
    document.head.appendChild(style);

    var bar = document.createElement("div");
    bar.id = "fr-meteo-bar";
    bar.setAttribute("role", "region");
    bar.setAttribute("aria-label", "Météo à Paris");

    var title = document.createElement("span");
    title.className = "fr-meteo-title";
    title.textContent = "Météo Paris :";
    bar.appendChild(title);

    var clockEl = document.createElement("span");
    clockEl.id = "fr-meteo-clock";
    clockEl.className = "fr-meteo-clock";
    bar.appendChild(clockEl);

    var infoEl = document.createElement("span");
    infoEl.id = "fr-meteo-cities";
    infoEl.className = "fr-meteo-item";
    infoEl.textContent = "Chargement...";
    bar.appendChild(infoEl);

    var refreshBtn = document.createElement("button");
    refreshBtn.type = "button";
    refreshBtn.id = "fr-meteo-refresh-btn";
    refreshBtn.className = "fr-meteo-refresh";
    refreshBtn.textContent = "Actualiser";
    bar.appendChild(refreshBtn);

    var radioBar = document.getElementById("fr-radio-bar");
    var a11yPanel = document.getElementById("a11y-panel");
    var anchor = radioBar || a11yPanel;
    if (anchor && anchor.parentNode) {
      anchor.parentNode.insertBefore(bar, anchor);
    } else {
      document.body.appendChild(bar);
    }

    function updateParisClock() {
      try {
        var now = new Date();
        var parts = new Intl.DateTimeFormat("fr-CA", {
          timeZone: "Europe/Paris",
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: false
        }).formatToParts(now);

        var map = {};
        parts.forEach(function (p) {
          if (p.type !== "literal") map[p.type] = p.value;
        });

        // Év-hónap-nap (pl. 2026-11-26) és óra:perc:másodperc
        clockEl.textContent =
          map.year +
          "-" +
          map.month +
          "-" +
          map.day +
          " " +
          map.hour +
          ":" +
          map.minute +
          ":" +
          map.second;
      } catch (e) {
        clockEl.textContent = "";
      }
    }

    function loadParisWeather() {
      infoEl.textContent = "Chargement...";
      refreshBtn.disabled = true;

      var url =
        "https://api.open-meteo.com/v1/forecast?latitude=" +
        paris.lat +
        "&longitude=" +
        paris.lon +
        "&current=temperature_2m,weather_code,wind_speed_10m,snowfall&timezone=Europe%2FParis&_t=" +
        Date.now();

      fetch(url, { cache: "no-store" })
        .then(function (res) {
          if (!res.ok) throw new Error("HTTP " + res.status);
          return res.json();
        })
        .then(function (data) {
          var cur = data && data.current ? data.current : null;
          if (!cur) {
            infoEl.textContent = "Météo indisponible";
            refreshBtn.disabled = false;
            return;
          }

          var temp =
            typeof cur.temperature_2m === "number"
              ? Math.round(cur.temperature_2m) + "°C"
              : "--°C";
          var cond =
            typeof cur.weather_code === "number" && wmoLabels[cur.weather_code]
              ? wmoLabels[cur.weather_code]
              : "Conditions variables";
          var wind =
            typeof cur.wind_speed_10m === "number"
              ? " • Vent " + Math.round(cur.wind_speed_10m) + " km/h"
              : "";
          var snow =
            typeof cur.snowfall === "number" && cur.snowfall > 0
              ? " • Neige " + cur.snowfall + " cm"
              : "";

          infoEl.textContent = temp + " • " + cond + wind + snow;
          refreshBtn.disabled = false;
        })
        .catch(function () {
          infoEl.textContent = "Météo indisponible";
          refreshBtn.disabled = false;
        });
    }

    refreshBtn.addEventListener("click", function (e) {
      e.preventDefault();
      updateParisClock();
      loadParisWeather();
    });

    updateParisClock();
    setInterval(updateParisClock, 1000);

    loadParisWeather();
    setInterval(loadParisWeather, 3600000);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initMeteoFr);
  } else {
    initMeteoFr();
  }
})();
