window.addEventListener("DOMContentLoaded", function () {

  const overlay = document.createElement("div");

  overlay.style.cssText = `
    position:fixed !important;
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
    background:#fff;
    padding:20px;
    border-radius:10px;
    width:90%;
    max-width:380px;
    font-family:Arial,sans-serif;
    box-shadow:0 10px 30px rgba(0,0,0,0.3);
  `;

  box.innerHTML = `
    <h3 style="margin:0 0 10px 0;">
      Nous recherchons un pédagogue bénévole
    </h3>
    <p style="margin:0; line-height:1.5;">
      Notre association, également active dans le domaine de la culture visuelle contemporaine,
      recherche un pédagogue bénévole pour une collaboration de recherche.
    </p>
    <button id="closePopup" style="
      margin-top:20px;
      padding:8px 16px;
      border:none;
      background:#333;
      color:#fff;
      cursor:pointer;
      border-radius:5px;
      display:block;
      margin-left:auto;
      margin-right:auto;
    ">Fermer</button>
  `;

  overlay.appendChild(box);

  // 🔥 NEM body-ba tesszük
  document.documentElement.appendChild(overlay);

  document.getElementById("closePopup").onclick = function () {
    overlay.remove();
  };

});
