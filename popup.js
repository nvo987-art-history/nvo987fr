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
    padding:15px;
  `;

  const box = document.createElement("div");
  box.style = `
    background:white;
    padding:20px;
    border-radius:10px;
    max-width:400px;
    width:100%;
    max-height:80vh;
    overflow:auto;
    text-align:left;
    font-family: Arial, sans-serif;
    box-shadow: 0 5px 20px rgba(0,0,0,0.3);
  `;

  box.innerHTML = `
    <h3 style="margin-top:0; margin-bottom:10px;">
      Nous recherchons un pédagogue bénévole
    </h3>
    <p style="line-height:1.5; margin:0;">
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

  document.getElementById("closePopup").onclick = () => {
    overlay.remove();
  };

});
