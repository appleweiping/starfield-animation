export const state = {
  appReady: false,

  music: {
    started: false,
    enabled: true,
    currentVolume: 0,
    targetVolume: 0,
    rafId: null
  },

  gallery: {
    albums: [],
    currentAlbumId: null
  },

  lightbox: {
    isOpen: false,
    albumFiles: [],
    currentIndex: 0
  },

  moonPhoto: {
    currentSrc: null,
    blend: 0,
    targetBlend: 0,
    holdTimer: 0,
    pulse: 0
  },

  scene: {
    pulse: 0,
    nextPhotoIndex: -1,
    nextAmbientShootingStarAt: 0
  },

  pointer: {
    x: 0,
    y: 0,
    tx: 0,
    ty: 0
  }
};