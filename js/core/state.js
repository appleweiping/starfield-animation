export const appState = {
  albums: [],
  loadedPhotos: new Map(),

  currentAlbumId: null,
  currentPhotoIndex: -1,
  currentPhotoSrc: null,

  galleryOpen: false,
  aboutOpen: false,
  lightboxOpen: false,

  musicStarted: false,
  musicEnabled: true,

  pointer: {
    x: 0,
    y: 0
  },

  mouse: {
    x: 0,
    y: 0,
    tx: 0,
    ty: 0
  }
};

export function setAlbums(albums) {
  appState.albums = albums;
  if (!appState.currentAlbumId && albums.length > 0) {
    appState.currentAlbumId = albums[0].id;
  }
}

export function setCurrentAlbum(id) {
  appState.currentAlbumId = id;
}

export function setCurrentPhoto(src) {
  appState.currentPhotoSrc = src;
}

export function setMusicStarted(value) {
  appState.musicStarted = value;
}

export function setMusicEnabled(value) {
  appState.musicEnabled = value;
}