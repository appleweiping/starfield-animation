import { APP_CONFIG } from "../config/appConfig.js";
import { SCENE_CONFIG } from "../config/sceneConfig.js";

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function lerp(a, b, t) {
  return a + (b - a) * t;
}

function rand(min, max) {
  return Math.random() * (max - min) + min;
}

function createRadialTexture(THREE, {
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

function drawMoonBase(baseCanvas) {
  const ctx = baseCanvas.getContext("2d");
  const w = baseCanvas.width;
  const h = baseCanvas.height;
  const cx = w / 2;
  const cy = h / 2;
  const r = 420;

  ctx.clearRect(0, 0, w, h);

  // 主体渐变
  const gradient = ctx.createRadialGradient(cx - 120, cy - 140, 80, cx, cy, r);
  gradient.addColorStop(0, "rgba(245,247,255,1)");
  gradient.addColorStop(0.38, "rgba(220,226,236,1)");
  gradient.addColorStop(0.72, "rgba(170,179,196,1)");
  gradient.addColorStop(1, "rgba(108,118,138,1)");

  ctx.fillStyle = gradient;
  ctx.beginPath();
  ctx.arc(cx, cy, r, 0, Math.PI * 2);
  ctx.fill();

  // 阴影层
  ctx.save();
  ctx.globalCompositeOperation = "multiply";
  const shadow = ctx.createRadialGradient(cx + 180, cy + 90, 20, cx + 120, cy + 40, 520);
  shadow.addColorStop(0, "rgba(10,14,24,0.05)");
  shadow.addColorStop(0.55, "rgba(18,24,38,0.18)");
  shadow.addColorStop(1, "rgba(20,24,40,0.32)");

  ctx.fillStyle = shadow;
  ctx.beginPath();
  ctx.arc(cx, cy, r, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  // 外圈微亮
  ctx.save();
  ctx.globalCompositeOperation = "screen";
  ctx.strokeStyle = "rgba(255,255,255,0.08)";
  ctx.lineWidth = 8;
  ctx.beginPath();
  ctx.arc(cx, cy, r - 3, 0, Math.PI * 2);
  ctx.stroke();
  ctx.restore();

  // 月面坑纹
  for (let i = 0; i < 48; i++) {
    const angle = Math.random() * Math.PI * 2;
    const rr = Math.random() * (r * 0.74);
    const x = cx + Math.cos(angle) * rr;
    const y = cy + Math.sin(angle) * rr * rand(0.88, 1.08);
    const craterRadius = rand(12, 48);

    ctx.save();
    ctx.globalAlpha = rand(0.06, 0.14);
    ctx.fillStyle = `rgba(${110 + Math.random() * 40}, ${120 + Math.random() * 40}, ${140 + Math.random() * 50}, 1)`;
    ctx.beginPath();
    ctx.arc(x, y, craterRadius, 0, Math.PI * 2);
    ctx.fill();

    ctx.globalAlpha *= 0.82;
    ctx.strokeStyle = "rgba(255,255,255,0.14)";
    ctx.lineWidth = rand(1, 2.4);
    ctx.beginPath();
    ctx.arc(
      x - craterRadius * 0.1,
      y - craterRadius * 0.12,
      craterRadius * rand(0.55, 0.85),
      0,
      Math.PI * 2
    );
    ctx.stroke();
    ctx.restore();
  }
}

function redrawMoonTexture(state) {
  const {
    moonCanvas,
    moonBaseCanvas,
    moonTexture,
    currentPhotoSrc,
    loadedPhotos,
    photoBlend
  } = state;

  const ctx = moonCanvas.getContext("2d");
  const w = moonCanvas.width;
  const h = moonCanvas.height;
  const cx = w / 2;
  const cy = h / 2;
  const r = 420;

  ctx.clearRect(0, 0, w, h);
  ctx.drawImage(moonBaseCanvas, 0, 0);

  if (currentPhotoSrc && loadedPhotos.has(currentPhotoSrc) && photoBlend > 0.01) {
    const img = loadedPhotos.get(currentPhotoSrc);

    ctx.save();
    ctx.beginPath();
    ctx.arc(cx, cy, r - 6, 0, Math.PI * 2);
    ctx.closePath();
    ctx.clip();

    // 照片作为“映入月光”的层，而不是硬贴图
    ctx.globalAlpha = clamp(photoBlend * APP_CONFIG.moonPhoto.maxOpacity, 0, APP_CONFIG.moonPhoto.maxOpacity);

    const ratio = img.width / img.height;
    let drawW = r * 2;
    let drawH = r * 2;

    if (ratio > 1) {
      drawH = drawW / ratio;
    } else {
      drawW = drawH * ratio;
    }

    drawW *= 1.25;
    drawH *= 1.25;

    // 稍微弱化照片本身，让它更像“映入”
    ctx.filter = "contrast(1.04) saturate(0.88) brightness(0.94)";
    ctx.drawImage(img, cx - drawW / 2, cy - drawH / 2, drawW, drawH);

    // 柔和洗白层，减少贴图感
    ctx.globalCompositeOperation = "screen";
    ctx.globalAlpha = clamp(photoBlend * 0.22, 0, 0.22);
    const wash = ctx.createRadialGradient(cx, cy, 30, cx, cy, r);
    wash.addColorStop(0, "rgba(255,255,255,0.26)");
    wash.addColorStop(1, "rgba(100,120,150,0)");
    ctx.fillStyle = wash;
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.fill();

    // 轻微乘色，重新混一点月面感
    ctx.globalCompositeOperation = "multiply";
    ctx.globalAlpha = clamp(photoBlend * 0.14, 0, 0.14);
    ctx.drawImage(moonBaseCanvas, 0, 0);

    ctx.restore();
  }

  moonTexture.needsUpdate = true;
}

export function createMoon({ THREE, scene }, loadedPhotos) {
  const moonCanvas = document.createElement("canvas");
  moonCanvas.width = moonCanvas.height = 1024;

  const moonBaseCanvas = document.createElement("canvas");
  moonBaseCanvas.width = moonBaseCanvas.height = 1024;

  drawMoonBase(moonBaseCanvas);

  const moonTexture = new THREE.CanvasTexture(moonCanvas);
  moonTexture.colorSpace = THREE.SRGBColorSpace;

  const moonGroup = new THREE.Group();
  scene.add(moonGroup);

  const moonGeometry = new THREE.PlaneGeometry(
    SCENE_CONFIG.moon.planeSize,
    SCENE_CONFIG.moon.planeSize,
    1,
    1
  );

  const moonMaterial = new THREE.MeshBasicMaterial({
    map: moonTexture,
    transparent: true
  });

  const moon = new THREE.Mesh(moonGeometry, moonMaterial);
  moon.position.set(
    SCENE_CONFIG.moon.position.x,
    SCENE_CONFIG.moon.position.y,
    SCENE_CONFIG.moon.position.z
  );
  moonGroup.add(moon);

  const glowTexture = createRadialTexture(THREE);

  const halo1 = new THREE.Sprite(new THREE.SpriteMaterial({
    map: glowTexture,
    color: 0xc9d9ff,
    transparent: true,
    opacity: 0.18,
    depthWrite: false,
    blending: THREE.AdditiveBlending
  }));
  halo1.scale.set(
    SCENE_CONFIG.moon.halo1Scale,
    SCENE_CONFIG.moon.halo1Scale,
    1
  );
  halo1.position.copy(moon.position);
  moonGroup.add(halo1);

  const halo2 = new THREE.Sprite(new THREE.SpriteMaterial({
    map: glowTexture,
    color: 0x6a89ff,
    transparent: true,
    opacity: 0.065,
    depthWrite: false,
    blending: THREE.AdditiveBlending
  }));
  halo2.scale.set(
    SCENE_CONFIG.moon.halo2Scale,
    SCENE_CONFIG.moon.halo2Scale,
    1
  );
  halo2.position.copy(moon.position);
  moonGroup.add(halo2);

  const state = {
    loadedPhotos,
    moonCanvas,
    moonBaseCanvas,
    moonTexture,
    moonGroup,
    moon,
    halo1,
    halo2,

    currentPhotoSrc: null,
    photoBlend: 0,
    photoPhase: "idle", // idle | fadeIn | hold | fadeOut
    photoTimer: 0,
    photoPulse: 0
  };

  redrawMoonTexture(state);

  return state;
}

export function showMoonPhoto(moonState, src) {
  if (!moonState) return;
  if (!src) return;
  if (!moonState.loadedPhotos.has(src)) return;

  moonState.currentPhotoSrc = src;
  moonState.photoPhase = "fadeIn";
  moonState.photoTimer = 0;
  moonState.photoPulse = 1;
}

export function clearMoonPhoto(moonState) {
  if (!moonState) return;

  moonState.currentPhotoSrc = null;
  moonState.photoBlend = 0;
  moonState.photoPhase = "idle";
  moonState.photoTimer = 0;
  moonState.photoPulse = 0;

  redrawMoonTexture(moonState);
}

export function updateMoon(moonState, elapsed, delta, mouse, pulse = 0) {
  if (!moonState) return;

  const {
    moonGroup,
    moon,
    halo1,
    halo2
  } = moonState;

  // 轻微漂浮与视差
  const moonFloat = Math.sin(elapsed * 0.22) * 1.3;
  moonGroup.position.x = mouse.x * 2.6;
  moonGroup.position.y = mouse.y * 1.6;

  moon.rotation.z = Math.sin(elapsed * 0.12) * 0.02;
  moon.position.y = SCENE_CONFIG.moon.position.y + moonFloat;

  halo1.position.copy(moon.position);
  halo2.position.copy(moon.position);

  // 照片 pulse 和 halo 反馈
  moonState.photoPulse = lerp(moonState.photoPulse, 0, 0.036);
  const haloBoost = pulse * 0.12 + moonState.photoPulse * 0.18;

  halo1.material.opacity = 0.16 + haloBoost + Math.sin(elapsed * 0.6) * 0.02;
  halo2.material.opacity = 0.05 + haloBoost * 0.48 + Math.sin(elapsed * 0.48 + 1.2) * 0.012;

  halo1.scale.setScalar(
    SCENE_CONFIG.moon.halo1Scale + pulse * 10 + moonState.photoPulse * 12
  );
  halo2.scale.setScalar(
    SCENE_CONFIG.moon.halo2Scale + pulse * 20 + moonState.photoPulse * 16
  );

  // 照片状态机：fadeIn -> hold -> fadeOut -> idle
  if (moonState.photoPhase === "fadeIn") {
    moonState.photoTimer += delta;
    const duration = APP_CONFIG.moonPhoto.fadeInDuration;
    moonState.photoBlend = clamp(moonState.photoTimer / duration, 0, 1);

    if (moonState.photoTimer >= duration) {
      moonState.photoPhase = "hold";
      moonState.photoTimer = 0;
      moonState.photoBlend = 1;
    }
  } else if (moonState.photoPhase === "hold") {
    moonState.photoTimer += delta;
    moonState.photoBlend = 1;

    if (moonState.photoTimer >= APP_CONFIG.moonPhoto.holdDuration) {
      moonState.photoPhase = "fadeOut";
      moonState.photoTimer = 0;
    }
  } else if (moonState.photoPhase === "fadeOut") {
    moonState.photoTimer += delta;
    const duration = APP_CONFIG.moonPhoto.fadeOutDuration;
    const t = clamp(moonState.photoTimer / duration, 0, 1);
    moonState.photoBlend = 1 - t;

    if (moonState.photoTimer >= duration) {
      moonState.photoPhase = "idle";
      moonState.photoTimer = 0;
      moonState.photoBlend = 0;
      moonState.currentPhotoSrc = null;
    }
  } else {
    moonState.photoBlend = 0;
  }

  redrawMoonTexture(moonState);
}