window.addEventListener("DOMContentLoaded", function () {

  if (localStorage.getItem("cookiesChoice")) return;

  const banner = document.createElement("div");

  banner.style.cssText = `
    position:fixed;
    bottom:20px;
    left:50%;
    transform:translateX(-50%);
    width:90%;
    max-width:420px;
    background:rgba(255,255,255,0.12);
    backdrop-filter:blur(12px);
    -webkit-backdrop-filter:blur(12px);
    border-radius:16px;
    padding:18px;
    box-shadow:0 10px 30px rgba(0,0,0,0.4);
    border:1px solid rgba(255,255,255,0.25);
    color:#ffffff;
    font-family:system-ui,-apple-system,Segoe UI,Roboto,Arial,sans-serif;
    text-align:center;
    z-index:999999;
  `;

  banner.innerHTML = `
    <p style="
      margin:0 0 12px 0;
      font-size:0.9rem;
      line-height:1.5;
      color:rgba(255,255,255,0.9);
    ">
      Nous utilisons des cookies pour mesurer l’audience.
    </p>

    <button id="acceptCookies" style="
      margin:5px;
      padding:8px 14px;
      border:none;
      background:rgba(0,0,0,0.6);
      color:#fff;
      border-radius:6px;
      cursor:pointer;
    ">Accepter</button>

    <button id="refuseCookies" style="
      margin:5px;
      padding:8px 14px;
      border:none;
      background:rgba(255,255,255,0.2);
      color:#fff;
      border-radius:6px;
      cursor:pointer;
    ">Refuser</button>
  `;

  document.documentElement.appendChild(banner);

  document.getElementById("acceptCookies").onclick = function () {
    localStorage.setItem("cookiesChoice", "accepted");
    banner.remove();
    loadAnalytics();
  };

  document.getElementById("refuseCookies").onclick = function () {
    localStorage.setItem("cookiesChoice", "refused");
    banner.remove();
  };

  if (localStorage.getItem("cookiesChoice") === "accepted") {
    loadAnalytics();
  }

  function loadAnalytics() {
    const script = document.createElement("script");
    script.src = "https://www.googletagmanager.com/gtag/js?id=GA_ID";
    script.async = true;
    document.head.appendChild(script);

    script.onload = function () {
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', 'GA_ID');
    };
  }

});
