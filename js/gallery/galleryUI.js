import { state } from "../core/state.js";
import {
  getAlbums,
  getAlbumById,
  getCurrentAlbum,
  setCurrentAlbum,
  fileNameFromPath
} from "./galleryData.js";
import { openLightbox } from "./lightbox.js";

let els = null;
let onPhotoSelect = null;

function updateAlbumHeader(album) {
  els.heading.textContent = album?.name || "Gallery";
  els.sub.textContent = album?.desc || "";
  const count = album?.files?.length || 0;
  els.meta.textContent = `${count} photo${count > 1 ? "s" : ""}`;
}

function renderAlbumList() {
  const albums = getAlbums();
  els.albumList.innerHTML = "";

  albums.forEach(album => {
    const btn = document.createElement("button");
    btn.className = "album-btn";
    btn.dataset.id = album.id;
    btn.innerHTML = `
      <strong>${album.name}</strong>
      <span>${album.files.length} photos · ${album.desc}</span>
    `;

    btn.classList.toggle("active", album.id === state.gallery.currentAlbumId);

    btn.addEventListener("click", () => {
      setActiveAlbum(album.id);
    });

    els.albumList.appendChild(btn);
  });
}

function renderGalleryGrid(album) {
  els.grid.innerHTML = "";

  if (!album || !album.files.length) {
    els.grid.innerHTML = `<div class="gallery-empty">No photos yet.</div>`;
    return;
  }

  album.files.forEach((src, index) => {
    const item = document.createElement("button");
    item.className = "thumb";
    item.type = "button";
    item.innerHTML = `
      <img src="${src}" alt="${fileNameFromPath(src)}" loading="lazy" />
      <div class="thumb-label">${fileNameFromPath(src)}</div>
    `;

    item.addEventListener("click", () => {
      if (typeof onPhotoSelect === "function") {
        onPhotoSelect(src, { album, index });
      }
      openLightbox(album.files, index);
    });

    els.grid.appendChild(item);
  });
}

export function setActiveAlbum(id) {
  const album = setCurrentAlbum(id);
  if (!album) return;

  updateAlbumHeader(album);
  renderAlbumList();
  renderGalleryGrid(album);
}

export function initGalleryUI(options) {
  els = {
    modal: options.modal,
    albumList: options.albumList,
    grid: options.grid,
    heading: options.heading,
    sub: options.sub,
    meta: options.meta,
    closeBtn: options.closeBtn
  };

  onPhotoSelect = options.onPhotoSelect || null;

  els.closeBtn.addEventListener("click", closeGalleryModal);

  els.modal.addEventListener("click", (e) => {
    if (e.target === els.modal) {
      closeGalleryModal();
    }
  });

  const currentAlbum = getCurrentAlbum() || getAlbumById(state.gallery.currentAlbumId);
  updateAlbumHeader(currentAlbum);
  renderAlbumList();
  renderGalleryGrid(currentAlbum);
}

export function openGallery() {
  els.modal.classList.add("open");
  els.modal.setAttribute("aria-hidden", "false");
}

export function closeGalleryModal() {
  els.modal.classList.remove("open");
  els.modal.setAttribute("aria-hidden", "true");
}