import { APP_CONFIG } from "../config/appConfig.js";

function rand(min, max) {
  return Math.random() * (max - min) + min;
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function easeOutQuad(t) {
  return 1 - (1 - t) * (1 - t);
}

function createGlowTexture(THREE, {
  size = 256,
  inner = "rgba(255,255,255,0.95)",
  middle = "rgba(176,205,255,0.24)",
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
  gradient.addColorStop(0.3, middle);
  gradient.addColorStop(1, outer);

  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, size, size);

  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  return texture;
}

function disposeRippleObject(root) {
  if (!root) return;

  root.traverse((child) => {
    if (child.geometry) {
      child.geometry.dispose();
    }

    if (child.material) {
      if (Array.isArray(child.material)) {
        child.material.forEach((mat) => mat.dispose());
      } else {
        child.material.dispose();
      }
    }
  });
}

export function createRipples({ THREE, scene }) {
  const glowTexture = createGlowTexture(THREE);

  return {
    THREE,
    scene,
    glowTexture,
    items: []
  };
}

export function spawnRipple(rippleState, x, y) {
  if (!rippleState) return;

  const { THREE, scene, glowTexture, items } = rippleState;

  const group = new THREE.Group();
  group.position.set(x, y, 8);

  // 3 层柔和波环
  const ringConfigs = [
    { inner: 1.1, outer: 1.85, color: 0xf5f8ff, opacity: 0.22 },
    { inner: 1.35, outer: 2.2, color: 0xcfe0ff, opacity: 0.14 },
    { inner: 1.65, outer: 2.65, color: 0x8fb2ff, opacity: 0.08 }
  ];

  const rings = ringConfigs.map((config, index) => {
    const geometry = new THREE.RingGeometry(config.inner, config.outer, 72);
    const material = new THREE.MeshBasicMaterial({
      color: config.color,
      transparent: true,
      opacity: config.opacity,
      side: THREE.DoubleSide,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });

    const mesh = new THREE.Mesh(geometry, material);

    // 给每层一点点不一样的初始状态，减少“机械同心圆”的感觉
    const baseScale = 1 + index * 0.04 + rand(-0.015, 0.015);
    mesh.scale.setScalar(baseScale);
    mesh.rotation.z = rand(-0.12, 0.12);

    group.add(mesh);
    return mesh;
  });

  // 中心短闪，不是装饰图案
  const flash = new THREE.Sprite(new THREE.SpriteMaterial({
    map: glowTexture,
    color: 0xfafcff,
    transparent: true,
    opacity: 0.24,
    depthWrite: false,
    blending: THREE.AdditiveBlending
  }));
  flash.scale.set(5.6, 5.6, 1);
  group.add(flash);

  // 一层轻微外扩辉光，增强“能量扰动”感
  const bloom = new THREE.Sprite(new THREE.SpriteMaterial({
    map: glowTexture,
    color: 0xaec8ff,
    transparent: true,
    opacity: 0.10,
    depthWrite: false,
    blending: THREE.AdditiveBlending
  }));
  bloom.scale.set(10, 10, 1);
  group.add(bloom);

  const ripple = {
    group,
    rings,
    flash,
    bloom,
    life: 0,
    maxLife: rand(
      APP_CONFIG.ripple.lifetimeMin,
      APP_CONFIG.ripple.lifetimeMax
    )
  };

  scene.add(group);
  items.push(ripple);
}

export function updateRipples(rippleState, delta) {
  if (!rippleState) return 0;

  const { items, scene } = rippleState;
  let pulseStrength = 0;

  for (let i = items.length - 1; i >= 0; i--) {
    const ripple = items[i];

    ripple.life += delta;
    const t = clamp(ripple.life / ripple.maxLife, 0, 1);
    const eased = easeOutQuad(t);
    const fade = 1 - t;

    // 输出一点全局 pulse 值给别的模块用（例如 moon / quote / near stars）
    pulseStrength = Math.max(pulseStrength, fade);

    ripple.rings.forEach((ring, index) => {
      const expansion = 1 + eased * (7.2 + index * 1.9);
      const wobble = 1 + Math.sin(ripple.life * 4.2 + index) * 0.015;

      ring.scale.setScalar(expansion * wobble);
      ring.rotation.z += 0.002 + index * 0.0012;
      ring.material.opacity = (0.22 - index * 0.06) * fade * (1 - t * 0.2);
    });

    ripple.flash.scale.setScalar(5.6 + eased * 9.5);
    ripple.flash.material.opacity = 0.24 * Math.pow(fade, 1.8);

    ripple.bloom.scale.setScalar(10 + eased * 18);
    ripple.bloom.material.opacity = 0.10 * Math.pow(fade, 1.35);

    if (t >= 1) {
      scene.remove(ripple.group);
      disposeRippleObject(ripple.group);
      items.splice(i, 1);
    }
  }

  return pulseStrength;
}

export function clearRipples(rippleState) {
  if (!rippleState) return;

  const { items, scene } = rippleState;

  for (let i = items.length - 1; i >= 0; i--) {
    const ripple = items[i];
    scene.remove(ripple.group);
    disposeRippleObject(ripple.group);
  }

  items.length = 0;
}