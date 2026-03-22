import { state } from "../core/state.js";
import { fileNameFromPath } from "./galleryData.js";

let els = null;

function renderLightbox() {
  if (!els) return;
  if (!state.lightbox.isOpen) return;

  const { albumFiles, currentIndex } = state.lightbox;
  const src = albumFiles[currentIndex];

  if (!src) return;

  els.img.src = src;
  els.img.alt = fileNameFromPath(src);
  els.caption.textContent = `${currentIndex + 1} / ${albumFiles.length} · ${fileNameFromPath(src)}`;
}

export function initLightbox(options) {
  els = {
    root: options.root,
    img: options.img,
    caption: options.caption,
    closeBtn: options.closeBtn,
    prevBtn: options.prevBtn,
    nextBtn: options.nextBtn
  };

  els.closeBtn.addEventListener("click", closeLightbox);
  els.prevBtn.addEventListener("click", showPrevLightboxImage);
  els.nextBtn.addEventListener("click", showNextLightboxImage);

  els.root.addEventListener("click", (e) => {
    if (e.target === els.root) {
      closeLightbox();
    }
  });

  window.addEventListener("keydown", (e) => {
    if (!state.lightbox.isOpen) return;

    if (e.key === "Escape") closeLightbox();
    if (e.key === "ArrowLeft") showPrevLightboxImage();
    if (e.key === "ArrowRight") showNextLightboxImage();
  });
}

export function openLightbox(files, startIndex = 0) {
  if (!Array.isArray(files) || files.length === 0 || !els) return;

  state.lightbox.albumFiles = files.slice();
  state.lightbox.currentIndex = Math.max(0, Math.min(startIndex, files.length - 1));
  state.lightbox.isOpen = true;

  els.root.classList.add("open");
  els.root.setAttribute("aria-hidden", "false");

  renderLightbox();
}

export function closeLightbox() {
  if (!els) return;

  state.lightbox.isOpen = false;
  els.root.classList.remove("open");
  els.root.setAttribute("aria-hidden", "true");
}

export function showPrevLightboxImage() {
  const files = state.lightbox.albumFiles;
  if (!files.length) return;

  state.lightbox.currentIndex =
    (state.lightbox.currentIndex - 1 + files.length) % files.length;

  renderLightbox();
}

export function showNextLightboxImage() {
  const files = state.lightbox.albumFiles;
  if (!files.length) return;

  state.lightbox.currentIndex =
    (state.lightbox.currentIndex + 1) % files.length;

  renderLightbox();
}