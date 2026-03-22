import { appState } from "./state.js";
import { getNextPhotoInAllAlbums } from "../gallery/galleryData.js";
import { closeAllModals } from "../ui/modals.js";
import { showMoonPhoto } from "../scene/moon.js";
import { spawnRipple } from "../scene/ripples.js";
import { maybeSpawnClickShootingStar } from "../scene/shootingStars.js";

export function bindGlobalEvents(app) {
  const {
    camera,
    raycaster,
    interactionPlane,
    worldPoint,
    bgm,
    moon,
    ripples,
    shootingStars,
    quote,
    galleryUI,
    aboutModal,
    lightbox
  } = app;

  function updatePointerFromMouseEvent(event) {
    appState.pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
    appState.pointer.y = -(event.clientY / window.innerHeight) * 2 + 1;
  }

  function isInteractiveElement(target) {
    return !!target.closest(
      "button, .thumb, .modal-card, .lightbox-inner, a, input, textarea, select"
    );
  }

  window.addEventListener("mousemove", (event) => {
    appState.mouse.tx = (event.clientX / window.innerWidth) * 2 - 1;
    appState.mouse.ty = -(event.clientY / window.innerHeight) * 2 + 1;
  });

  window.addEventListener("mouseleave", () => {
    appState.mouse.tx = 0;
    appState.mouse.ty = 0;
  });

  window.addEventListener("click", async (event) => {
    if (isInteractiveElement(event.target)) return;

    await bgm.start();
    bgm.pulse();

    updatePointerFromMouseEvent(event);

    raycaster.setFromCamera(appState.pointer, camera);
    raycaster.ray.intersectPlane(interactionPlane, worldPoint);

    spawnRipple(ripples, worldPoint.x, worldPoint.y);

    const nextPhoto = getNextPhotoInAllAlbums();
    if (nextPhoto) {
      showMoonPhoto(moon, nextPhoto);
    }

    maybeSpawnClickShootingStar(shootingStars);
    quote.pulse();
  });

  window.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeAllModals({ galleryUI, aboutModal, lightbox });
    }
  });
}