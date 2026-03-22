import { appState } from "../core/state.js";
import { updateStars } from "./stars.js";
import { updateMist } from "./mist.js";
import { updateDust } from "./dust.js";
import { updateMoon } from "./moon.js";
import {
  maybeSpawnAmbientShootingStar,
  updateShootingStars
} from "./shootingStars.js";
import { updateRipples } from "./ripples.js";

function lerp(a, b, t) {
  return a + (b - a) * t;
}

export function startAnimationLoop(app) {
  const {
    camera,
    renderer,
    scene,
    clock,
    stars,
    mist,
    dust,
    moon,
    ripples,
    shootingStars
  } = app;

  function animate() {
    requestAnimationFrame(animate);

    const elapsed = clock.getElapsedTime();
    const delta = Math.min(clock.getDelta(), 0.033);

    appState.mouse.x = lerp(appState.mouse.x, appState.mouse.tx, 0.04);
    appState.mouse.y = lerp(appState.mouse.y, appState.mouse.ty, 0.04);

    // camera 轻微视差
    camera.position.x = lerp(camera.position.x, appState.mouse.x * 7.5, 0.035);
    camera.position.y = lerp(camera.position.y, appState.mouse.y * 4.2, 0.035);
    camera.lookAt(0, 0, 0);

    updateStars(stars, elapsed, appState.mouse);
    updateMist(mist, elapsed, appState.mouse);
    updateDust(dust, appState.mouse);

    const pulse = updateRipples(ripples, delta);

    updateMoon(
      moon,
      elapsed,
      delta,
      appState.mouse,
      pulse
    );

    if (stars?.nearStars?.material) {
      stars.nearStars.material.opacity = 0.78 + Math.max(0, pulse * 0.12);
    }

    maybeSpawnAmbientShootingStar(shootingStars, elapsed);
    updateShootingStars(shootingStars);

    renderer.render(scene, camera);
  }

  animate();
}