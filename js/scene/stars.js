import { SCENE_CONFIG } from "../config/sceneConfig.js";

function rand(min, max) {
  return Math.random() * (max - min) + min;
}

function createRadialTexture(THREE, {
  size = 128,
  inner = "rgba(255,255,255,1)",
  middle = "rgba(230,240,255,0.32)",
  outer = "rgba(230,240,255,0)"
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

function createStarLayer(THREE, config, starTexture) {
  const { count, spread, size, opacity, color } = config;

  const positions = new Float32Array(count * 3);
  const colors = new Float32Array(count * 3);

  const baseColor = new THREE.Color(color);

  for (let i = 0; i < count; i++) {
    positions[i * 3] = rand(-spread, spread);
    positions[i * 3 + 1] = rand(-spread * 0.58, spread * 0.58);
    positions[i * 3 + 2] = rand(-spread, spread);

    colors[i * 3] = baseColor.r * rand(0.84, 1.06);
    colors[i * 3 + 1] = baseColor.g * rand(0.86, 1.03);
    colors[i * 3 + 2] = baseColor.b * rand(0.92, 1.08);
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));

  const material = new THREE.PointsMaterial({
    size,
    map: starTexture,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    vertexColors: true,
    opacity,
    sizeAttenuation: true
  });

  return new THREE.Points(geometry, material);
}

export function createStars({ THREE, scene }) {
  const starTexture = createRadialTexture(THREE);

  const farStars = createStarLayer(THREE, SCENE_CONFIG.stars.far, starTexture);
  const midStars = createStarLayer(THREE, SCENE_CONFIG.stars.mid, starTexture);
  const nearStars = createStarLayer(THREE, SCENE_CONFIG.stars.near, starTexture);

  scene.add(farStars);
  scene.add(midStars);
  scene.add(nearStars);

  return {
    farStars,
    midStars,
    nearStars,
    starTexture
  };
}

export function updateStars(stars, elapsed, mouse) {
  if (!stars) return;

  const { farStars, midStars, nearStars } = stars;

  farStars.rotation.y += 0.00014;
  farStars.rotation.x = Math.sin(elapsed * 0.04) * 0.03;

  midStars.rotation.y += 0.00028;
  midStars.rotation.x = Math.sin(elapsed * 0.06) * 0.045;
  midStars.position.x = mouse.x * 4.8;
  midStars.position.y = mouse.y * 2.8;

  nearStars.position.x = mouse.x * 9.5;
  nearStars.position.y = mouse.y * 5.2;
  nearStars.rotation.z = Math.sin(elapsed * 0.12) * 0.03;
}