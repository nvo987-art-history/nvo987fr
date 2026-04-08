window.addEventListener("DOMContentLoaded", function () {

  const overlay = document.createElement("div");
  overlay.style.position = "fixed";
  overlay.style.top = "0";
  overlay.style.left = "0";
  overlay.style.width = "100%";
  overlay.style.height = "100%";
  overlay.style.background = "rgba(0,0,0,0.5)";
  overlay.style.display = "flex";
  overlay.style.alignItems = "center";
  overlay.style.justifyContent = "center";
  overlay.style.zIndex = "9999";
  overlay.style.padding = "15px";

  const box = document.createElement("div");
  box.style.background = "white";
  box.style.padding = "20px";
  box.style.borderRadius = "10px";
  box.style.width = "100%";
  box.style.maxWidth = "400px";
  box.style.fontFamily = "Arial, sans-serif";
  box.style.boxShadow = "0 5px 20px rgba(0,0,0,0.3)";
  box.style.display = "block";              // 🔥 fontos
  box.style.height = "auto";                // 🔥 fontos

  box.innerHTML = `
    <h3 style="margin:0 0 10px 0;">
      Nous recherchons un pédagogue bénévole
    </h3>
    <p style="margin:0; line-height:1.5;">
      Notre association, également active dans le domaine de la culture visuelle contemporaine,
      recherche un pédagogue bénévole pour une collaboration de recherche.
    </p>
    <div style="text-align:center;">
      <button id="closePopup" style="
        margin-top:20px;
        padding:8px 16px;
        border:none;
        background:#333;
        color:white;
        cursor:pointer;
        border-radius:5px;
      ">Fermer</button>
    </div>
  `;

  overlay.appendChild(box);
  document.body.appendChild(overlay);

  document.getElementById("closePopup").onclick = function () {
    overlay.remove();
  };

});
