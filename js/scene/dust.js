function rand(min, max) {
  return Math.random() * (max - min) + min;
}

function createGlowTexture(THREE, {
  size = 256,
  inner = "rgba(255,255,255,0.95)",
  middle = "rgba(176,205,255,0.26)",
  outer = "rgba(176,205,255,0)"
} = {}) {
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = size;
  const ctx = canvas.getContext("2d");

  const gradient = ctx.createRadialGradient(
    size / 2,
    size / 2,
    0,
    size / 2,
    size / 2,
    size / 2
  );

  gradient.addColorStop(0, inner);
  gradient.addColorStop(0.28, middle);
  gradient.addColorStop(1, outer);

  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, size, size);

  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  return texture;
}

export function createDust({ THREE, scene }, count = 380) {
  const glowTexture = createGlowTexture(THREE);

  const positions = new Float32Array(count * 3);
  const colors = new Float32Array(count * 3);

  for (let i = 0; i < count; i++) {
    positions[i * 3] = rand(-220, 220);
    positions[i * 3 + 1] = rand(-120, 120);
    positions[i * 3 + 2] = rand(-180, 40);

    const bright = rand(0.65, 1);
    colors[i * 3] = 0.70 * bright;
    colors[i * 3 + 1] = 0.80 * bright;
    colors[i * 3 + 2] = 1.00 * bright;
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));

  const material = new THREE.PointsMaterial({
    size: 1.5,
    map: glowTexture,
    transparent: true,
    depthWrite: false,
    opacity: 0.18,
    blending: THREE.AdditiveBlending,
    vertexColors: true
  });

  const points = new THREE.Points(geometry, material);
  scene.add(points);

  return {
    dust: points,
    glowTexture
  };
}

export function updateDust(dustState, mouse) {
  if (!dustState) return;

  const { dust } = dustState;
  dust.rotation.y += 0.0005;
  dust.position.x = mouse.x * 7.2;
  dust.position.y = mouse.y * 3.6;
}