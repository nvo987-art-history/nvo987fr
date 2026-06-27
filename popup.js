window.addEventListener("DOMContentLoaded", function () {

  const overlay = document.createElement("div");

  overlay.style.cssText = `
    position:fixed;
    top:0;
    left:0;
    width:100vw;
    height:100vh;
    background:rgba(0,0,0,0.5);
    z-index:999999;
    display:flex;
    align-items:center;
    justify-content:center;
  `;

  const box = document.createElement("div");

  box.style.cssText = `
    background:rgba(255,255,255,0.12);
    backdrop-filter:blur(12px);
    -webkit-backdrop-filter:blur(12px);
    padding:22px;
    border-radius:16px;
    width:90%;
    max-width:340px;
    font-family:system-ui,-apple-system,Segoe UI,Roboto,Arial,sans-serif;
    box-shadow:0 10px 30px rgba(0,0,0,0.4);
    border:1px solid rgba(255,255,255,0.25);
    color:#ffffff;
    text-align:center; /* 🔥 középre minden */
  `;

  box.innerHTML = `
    <h3 style="
      margin:0 0 12px 0;
      font-size:1.25rem;
      font-weight:600;
      line-height:1.3;
      text-align:center;
    ">
      Nous recherchons un pédagogue bénévole
    </h3>

    <p style="
      margin:0;
      font-size:0.95rem;
      line-height:1.6;
      color:rgba(255,255,255,0.9);
      text-align:center;
    ">
      Notre association, également active dans le domaine de la culture visuelle contemporaine,
      recherche un pédagogue bénévole pour une collaboration de recherche.
    </p>

    <button id="closePopup" style="
      margin-top:18px;
      padding:8px 14px;
      border:none;
      background:rgba(0,0,0,0.6);
      color:#fff;
      cursor:pointer;
      border-radius:6px;
      display:block;
      margin-left:auto;
      margin-right:auto;
      font-size:0.9rem;
    ">Fermer</button>
  `;

  overlay.appendChild(box);
  document.documentElement.appendChild(overlay);

  document.getElementById("closePopup").onclick = function () {
    overlay.remove();
  };

});
