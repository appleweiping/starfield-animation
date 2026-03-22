import { APP_CONFIG } from "../config/appConfig.js";
import { state } from "../core/state.js";

function normalizeAlbum(rawAlbum, index = 0) {
  const files = Array.isArray(rawAlbum.files) ? rawAlbum.files.filter(Boolean) : [];

  return {
    id: rawAlbum.id || `album-${index}`,
    name: rawAlbum.name || `Album ${index + 1}`,
    desc: rawAlbum.desc || "",
    cover: rawAlbum.cover || files[0] || "",
    files
  };
}

export async function loadGalleryData() {
  const res = await fetch(APP_CONFIG.gallery.manifestUrl, { cache: "no-store" });

  if (!res.ok) {
    throw new Error(`Failed to load manifest: ${res.status}`);
  }

  const manifest = await res.json();
  const albums = Array.isArray(manifest.albums)
    ? manifest.albums.map(normalizeAlbum).filter(album => album.files.length > 0)
    : [];

  state.gallery.albums = albums;

  const preferredId = APP_CONFIG.gallery.defaultAlbumId;
  const fallbackId = albums[0]?.id || null;

  state.gallery.currentAlbumId =
    albums.find(a => a.id === preferredId)?.id || fallbackId;

  return albums;
}

export function getAlbums() {
  return state.gallery.albums;
}

export function getAlbumById(id) {
  return state.gallery.albums.find(album => album.id === id) || state.gallery.albums[0] || null;
}

export function getCurrentAlbum() {
  return getAlbumById(state.gallery.currentAlbumId);
}

export function setCurrentAlbum(id) {
  const album = getAlbumById(id);
  if (!album) return null;

  state.gallery.currentAlbumId = album.id;
  return album;
}

export function getAllPhotoPaths() {
  return [...new Set(state.gallery.albums.flatMap(album => album.files))];
}

export function fileNameFromPath(path) {
  return path.split("/").pop() || path;
}