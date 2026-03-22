import { appState, setCurrentAlbum, setCurrentPhoto } from "../core/state.js";

export function getAlbums() {
  return appState.albums || [];
}

export function getAlbumById(id) {
  return getAlbums().find((album) => album.id === id) || null;
}

export function getCurrentAlbum() {
  if (!appState.currentAlbumId) return getAlbums()[0] || null;
  return getAlbumById(appState.currentAlbumId) || getAlbums()[0] || null;
}

export function selectAlbum(id) {
  const album = getAlbumById(id);
  if (!album) return null;

  setCurrentAlbum(id);
  return album;
}

export function getAllPhotoPaths() {
  return [...new Set(getAlbums().flatMap((album) => album.files || []))];
}

export function getCurrentAlbumPhotos() {
  const album = getCurrentAlbum();
  return album?.files || [];
}

export function getPhotoName(path) {
  return path.split("/").pop() || path;
}

export function selectPhoto(src) {
  if (!src) return null;
  setCurrentPhoto(src);
  return src;
}

export function getNextPhotoInAllAlbums() {
  const all = getAllPhotoPaths();
  if (!all.length) return null;

  const currentIndex = all.indexOf(appState.currentPhotoSrc);
  const nextIndex = currentIndex === -1 ? 0 : (currentIndex + 1) % all.length;
  const next = all[nextIndex];

  setCurrentPhoto(next);
  appState.currentPhotoIndex = nextIndex;
  return next;
}

export function getPhotoIndexInAlbum(files, src) {
  return files.indexOf(src);
}