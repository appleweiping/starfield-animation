import { appState } from "../core/state.js";
import {
  getAlbums,
  getCurrentAlbum,
  selectAlbum,
  selectPhoto,
  getPhotoName
} from "./galleryData.js";

export function createGalleryUI({ lightbox, onPhotoSelect } = {}) {
  const modal = document.getElementById("galleryModal");
  const closeBtn = document.getElementById("closeGallery");
  const albumListEl = document.getElementById("albumList");
  const galleryGrid = document.getElementById("galleryGrid");
  const galleryHeading = document.getElementById("galleryHeading");
  const gallerySub = document.getElementById("gallerySub");
  const galleryMeta = document.getElementById("galleryMeta");

  if (
    !modal ||
    !closeBtn ||
    !albumListEl ||
    !galleryGrid ||
    !galleryHeading ||
    !gallerySub ||
    !galleryMeta
  ) {
    throw new Error("Gallery DOM elements are missing");
  }

  function open() {
    modal.classList.add("open");
    modal.setAttribute("aria-hidden", "false");
    appState.galleryOpen = true;
  }

  function close() {
    modal.classList.remove("open");
    modal.setAttribute("aria-hidden", "true");
    appState.galleryOpen = false;
  }

  function renderAlbumList() {
    const albums = getAlbums();
    albumListEl.innerHTML = "";

    albums.forEach((album) => {
      const button = document.createElement("button");
      button.className = "album-btn";
      button.dataset.id = album.id;
      button.innerHTML = `
        <strong>${album.name}</strong>
        <span>${album.files.length} photos · ${album.desc || ""}</span>
      `;

      button.addEventListener("click", () => {
        selectAlbum(album.id);
        render();
      });

      albumListEl.appendChild(button);
    });
  }

  function renderCurrentAlbumInfo() {
    const album = getCurrentAlbum();
    if (!album) return;

    galleryHeading.textContent = album.name;
    gallerySub.textContent = album.desc || "";
    galleryMeta.textContent = `${album.files.length} photo${album.files.length > 1 ? "s" : ""}`;

    [...albumListEl.querySelectorAll(".album-btn")].forEach((btn) => {
      btn.classList.toggle("active", btn.dataset.id === album.id);
    });
  }

  function renderCurrentAlbumGrid() {
    const album = getCurrentAlbum();
    if (!album) return;

    galleryGrid.innerHTML = "";

    album.files.forEach((src, index) => {
      const card = document.createElement("div");
      card.className = "thumb";
      card.innerHTML = `
        <img src="${src}" alt="${getPhotoName(src)}" loading="lazy" />
        <div class="thumb-label">${getPhotoName(src)}</div>
      `;

      card.addEventListener("click", () => {
        selectPhoto(src);

        if (typeof onPhotoSelect === "function") {
          onPhotoSelect(src);
        }

        if (lightbox) {
          lightbox.open(album.files, index);
        }
      });

      galleryGrid.appendChild(card);
    });
  }

  function render() {
    renderAlbumList();
    renderCurrentAlbumInfo();
    renderCurrentAlbumGrid();
  }

  function bindEvents() {
    closeBtn.addEventListener("click", close);

    modal.addEventListener("click", (event) => {
      if (event.target === modal) {
        close();
      }
    });

    window.addEventListener("keydown", (event) => {
      if (!appState.galleryOpen) return;
      if (event.key === "Escape") close();
    });
  }

  render();
  bindEvents();

  return {
    open,
    close,
    render,
    isOpen: () => appState.galleryOpen
  };
}