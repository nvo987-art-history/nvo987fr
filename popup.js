window.addEventListener("load", function () {

  const overlay = document.createElement("div");
  overlay.style = `
    position:fixed;
    top:0;left:0;
    width:100%;height:100%;
    background:rgba(0,0,0,0.5);
    display:flex;
    align-items:center;
    justify-content:center;
    z-index:9999;
  `;

  const box = document.createElement("div");
  box.style = `
    background:white;
    padding:25px;
    border-radius:8px;
    max-width:400px;
    text-align:left;
    font-family: Arial, sans-serif;
  `;

  box.innerHTML = `
    <h3>Nous recherchons un pédagogue bénévole</h3>
    <p>
      Notre association, également active dans le domaine de la culture visuelle contemporaine,<br>
      recherche un pédagogue bénévole pour une collaboration de recherche.
    </p>
    <button id="closePopup" style="
      margin-top:15px;
      padding:8px 12px;
      border:none;
      background:#333;
      color:white;
      cursor:pointer;
    ">Fermer</button>
  `;

  overlay.appendChild(box);
  document.body.appendChild(overlay);

  document.getElementById("closePopup").onclick = () => {
    overlay.remove();
  };

});
