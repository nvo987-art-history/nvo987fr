(() => {
  const canvas = document.createElement('canvas');
  canvas.id = 'christmas-snow-canvas';
  Object.assign(canvas.style, {
    position: 'fixed',
    top: '0',
    left: '0',
    width: '100vw',
    height: '100vh',
    pointerEvents: 'none',
    zIndex: '9999'
  });

  const ctx = canvas.getContext('2d');
  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  // Nagy hópelyhek beállításai sötét háttérhez
  const FLAKE_COUNT = 42;
  const flakes = [];

  function createFlake(startTop = false) {
    const size = 16 + Math.random() * 22; // Nagy pelyhek: 16px - 38px
    return {
      x: Math.random() * width,
      y: startTop ? -size - Math.random() * height : Math.random() * height,
      size,
      speedY: 0.55 + Math.random() * 1.05,
      driftPhase: Math.random() * Math.PI * 2,
      driftSpeed: 0.008 + Math.random() * 0.014,
      driftAmp: 0.6 + Math.random() * 1.2,
      rotation: Math.random() * Math.PI * 2,
      rotSpeed: (Math.random() - 0.5) * 0.012,
      opacity: 0.45 + Math.random() * 0.45
    };
  }

  for (let i = 0; i < FLAKE_COUNT; i++) {
    flakes.push(createFlake(false));
  }

  function drawSnowflake(f) {
    ctx.save();
    ctx.translate(f.x, f.y);
    ctx.rotate(f.rotation);
    ctx.strokeStyle = `rgba(255, 255, 255, ${f.opacity})`;
    ctx.shadowColor = 'rgba(220, 240, 255, 0.55)';
    ctx.shadowBlur = 7;
    ctx.lineWidth = Math.max(1.2, f.size / 15);
    ctx.lineCap = 'round';

    const r = f.size / 2;
    for (let i = 0; i < 6; i++) {
      ctx.rotate(Math.PI / 3);
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(0, -r);
      ctx.stroke();

      const b1 = r * 0.45;
      const b2 = r * 0.72;
      const len1 = r * 0.28;
      const len2 = r * 0.2;

      ctx.beginPath();
      ctx.moveTo(0, -b1);
      ctx.lineTo(-len1, -b1 - len1 * 0.7);
      ctx.moveTo(0, -b1);
      ctx.lineTo(len1, -b1 - len1 * 0.7);

      ctx.moveTo(0, -b2);
      ctx.lineTo(-len2, -b2 - len2 * 0.7);
      ctx.moveTo(0, -b2);
      ctx.lineTo(len2, -b2 - len2 * 0.7);
      ctx.stroke();
    }
    ctx.restore();
  }

  function animate() {
    ctx.clearRect(0, 0, width, height);

    for (let i = 0; i < flakes.length; i++) {
      const f = flakes[i];
      f.driftPhase += f.driftSpeed;
      f.y += f.speedY;
      f.x += Math.sin(f.driftPhase) * f.driftAmp;
      f.rotation += f.rotSpeed;

      drawSnowflake(f);

      if (f.y > height + f.size) {
        flakes[i] = createFlake(true);
        flakes[i].y = -flakes[i].size;
      }
      if (f.x > width + f.size) f.x = -f.size;
      if (f.x < -f.size) f.x = width + f.size;
    }

    requestAnimationFrame(animate);
  }

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  function init() {
    document.body.appendChild(canvas);
    requestAnimationFrame(animate);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
