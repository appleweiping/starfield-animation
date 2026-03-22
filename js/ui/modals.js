import { appState } from "../core/state.js";

export function createAboutModal() {
  const modal = document.getElementById("aboutModal");
  const closeBtn = document.getElementById("closeAbout");

  if (!modal || !closeBtn) {
    throw new Error("About modal DOM elements are missing");
  }

  function open() {
    modal.classList.add("open");
    modal.setAttribute("aria-hidden", "false");
    appState.aboutOpen = true;
  }

  function close() {
    modal.classList.remove("open");
    modal.setAttribute("aria-hidden", "true");
    appState.aboutOpen = false;
  }

  function bindEvents() {
    closeBtn.addEventListener("click", close);

    modal.addEventListener("click", (event) => {
      if (event.target === modal) {
        close();
      }
    });

    window.addEventListener("keydown", (event) => {
      if (!appState.aboutOpen) return;
      if (event.key === "Escape") close();
    });
  }

  bindEvents();

  return {
    open,
    close,
    isOpen: () => appState.aboutOpen
  };
}

export function closeAllModals({ galleryUI, aboutModal, lightbox } = {}) {
  if (galleryUI?.isOpen?.()) {
    galleryUI.close();
  }

  if (aboutModal?.isOpen?.()) {
    aboutModal.close();
  }

  if (lightbox?.isOpen?.()) {
    lightbox.close();
  }
}