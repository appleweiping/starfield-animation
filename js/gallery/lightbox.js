import { appState } from "../core/state.js";
import { getPhotoName } from "./galleryData.js";

export function createLightbox({ onPhotoChange } = {}) {
  const root = document.getElementById("lightbox");
  const image = document.getElementById("lightboxImg");
  const caption = document.getElementById("lightboxCaption");
  const closeBtn = document.getElementById("closeLightbox");
  const prevBtn = document.getElementById("prevLightbox");
  const nextBtn = document.getElementById("nextLightbox");

  if (!root || !image || !caption || !closeBtn || !prevBtn || !nextBtn) {
    throw new Error("Lightbox DOM elements are missing");
  }

  const state = {
    files: [],
    index: 0
  };

  function update() {
    if (!state.files.length) return;

    const src = state.files[state.index];
    image.src = src;
    image.alt = getPhotoName(src);
    caption.textContent = getPhotoName(src);

    if (typeof onPhotoChange === "function") {
      onPhotoChange(src);
    }
  }

  function open(files, index = 0) {
    state.files = files.slice();
    state.index = Math.max(0, Math.min(index, state.files.length - 1));

    update();

    root.classList.add("open");
    root.setAttribute("aria-hidden", "false");
    appState.lightboxOpen = true;
  }

  function close() {
    root.classList.remove("open");
    root.setAttribute("aria-hidden", "true");
    appState.lightboxOpen = false;
  }

  function step(direction) {
    if (!state.files.length) return;
    state.index = (state.index + direction + state.files.length) % state.files.length;
    update();
  }

  function bindEvents() {
    closeBtn.addEventListener("click", close);
    prevBtn.addEventListener("click", () => step(-1));
    nextBtn.addEventListener("click", () => step(1));

    root.addEventListener("click", (event) => {
      if (event.target === root) {
        close();
      }
    });

    window.addEventListener("keydown", (event) => {
      if (!appState.lightboxOpen) return;

      if (event.key === "Escape") {
        close();
      } else if (event.key === "ArrowLeft") {
        step(-1);
      } else if (event.key === "ArrowRight") {
        step(1);
      }
    });
  }

  bindEvents();

  return {
    open,
    close,
    step,
    isOpen: () => appState.lightboxOpen
  };
}