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

export function createMist({ THREE, scene }, count = 9) {
  const glowTexture = createGlowTexture(THREE);

  const mistMaterial = new THREE.SpriteMaterial({
    map: glowTexture,
    color: 0x6489ff,
    transparent: true,
    opacity: 0.06,
    depthWrite: false,
    blending: THREE.AdditiveBlending
  });

  const mistGroup = new THREE.Group();

  for (let i = 0; i < count; i++) {
    const sprite = new THREE.Sprite(mistMaterial.clone());
    sprite.position.set(rand(-170, 170), rand(-90, 90), rand(-120, -20));

    const scale = rand(90, 180);
    sprite.scale.set(scale * 1.4, scale, 1);
    sprite.material.opacity = rand(0.015, 0.06);

    mistGroup.add(sprite);
  }

  scene.add(mistGroup);

  return {
    mistGroup,
    glowTexture
  };
}

export function updateMist(mist, elapsed, mouse) {
  if (!mist) return;

  const { mistGroup } = mist;

  mistGroup.children.forEach((sprite, index) => {
    sprite.position.x += Math.sin(elapsed * (0.08 + index * 0.01) + index) * 0.015;
    sprite.position.y += Math.cos(elapsed * (0.06 + index * 0.008) + index * 2.1) * 0.01;
    sprite.material.opacity = 0.018 + Math.sin(elapsed * 0.3 + index) * 0.01 + index * 0.0035;
  });

  mistGroup.position.x = mouse.x * 5.2;
  mistGroup.position.y = mouse.y * 2.6;
}