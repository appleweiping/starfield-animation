import { APP_CONFIG } from "../config/appConfig.js";

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

export function createShootingStars({ THREE, scene }) {
  const glowTexture = createGlowTexture(THREE);

  return {
    scene,
    THREE,
    glowTexture,
    items: [],
    nextAmbientAt: rand(
      APP_CONFIG.shootingStar.minInterval,
      APP_CONFIG.shootingStar.maxInterval
    )
  };
}

export function spawnShootingStar(state, { hero = false } = {}) {
  if (!state) return;

  const { THREE, scene, glowTexture, items } = state;

  const group = new THREE.Group();

  const tailLength = hero ? 38 : 24;
  const tailRise = hero ? 10 : 6;

  const tailGeometry = new THREE.BufferGeometry().setFromPoints([
    new THREE.Vector3(0, 0, 0),
    new THREE.Vector3(-tailLength, tailRise, 0)
  ]);

  const tailMaterial = new THREE.LineBasicMaterial({
    color: hero ? 0xf8fbff : 0xe8f0ff,
    transparent: true,
    opacity: hero ? 0.9 : 0.55,
    blending: THREE.AdditiveBlending,
    depthWrite: false
  });

  const tail = new THREE.Line(tailGeometry, tailMaterial);
  group.add(tail);

  const head = new THREE.Sprite(new THREE.SpriteMaterial({
    map: glowTexture,
    color: 0xffffff,
    transparent: true,
    opacity: hero ? 0.95 : 0.75,
    blending: THREE.AdditiveBlending,
    depthWrite: false
  }));

  const headScale = hero ? 4.6 : 3.1;
  head.scale.set(headScale, headScale, 1);
  group.add(head);

  const startX = rand(110, 220);
  const startY = rand(20, 90);

  group.position.set(startX, startY, rand(-90, -10));
  group.rotation.z = rand(-0.52, -0.34);

  group.userData = {
    hero,
    life: 1,
    vx: hero ? rand(-5.8, -4.2) : rand(-3.8, -2.2),
    vy: hero ? rand(-1.9, -1.1) : rand(-1.2, -0.5),
    fade: hero ? rand(0.018, 0.026) : rand(0.026, 0.04),
    headScale,
    tail,
    head
  };

  scene.add(group);
  items.push(group);
}

export function maybeSpawnAmbientShootingStar(state, elapsed) {
  if (!state) return;

  if (elapsed > state.nextAmbientAt) {
    spawnShootingStar(state, { hero: false });

    state.nextAmbientAt =
      elapsed +
      rand(APP_CONFIG.shootingStar.minInterval, APP_CONFIG.shootingStar.maxInterval);
  }
}

export function maybeSpawnClickShootingStar(state) {
  if (!state) return;

  if (Math.random() < APP_CONFIG.shootingStar.clickSpawnChance) {
    spawnShootingStar(state, { hero: true });
  }
}

export function updateShootingStars(state) {
  if (!state) return;

  for (let i = state.items.length - 1; i >= 0; i--) {
    const star = state.items[i];

    star.position.x += star.userData.vx;
    star.position.y += star.userData.vy;
    star.userData.life -= star.userData.fade;

    const life = Math.max(0, star.userData.life);

    star.userData.tail.material.opacity = star.userData.hero
      ? life * 0.95
      : life * 0.62;

    star.userData.head.material.opacity = star.userData.hero
      ? life
      : life * 0.78;

    star.userData.head.scale.setScalar(
      star.userData.headScale * (0.78 + life * 0.34)
    );

    if (life <= 0 || star.position.x < -260 || star.position.y < -140) {
      state.scene.remove(star);
      star.userData.tail.geometry.dispose();
      star.userData.tail.material.dispose();
      star.userData.head.material.dispose();
      state.items.splice(i, 1);
    }
  }
}