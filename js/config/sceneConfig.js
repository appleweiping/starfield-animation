export const SCENE_CONFIG = {
  background: {
    fogColor: 0x030714,
    fogDensity: 0.0011
  },

  camera: {
    fov: 60,
    near: 0.1,
    far: 2400,
    initialPosition: { x: 0, y: 0, z: 120 }
  },

  renderer: {
    toneMappingExposure: 1.02,
    maxPixelRatio: 2
  },

  stars: {
    far: {
      count: 1400,
      spread: 900,
      size: 1.1,
      opacity: 0.62,
      color: "#b7cbff"
    },
    mid: {
      count: 900,
      spread: 520,
      size: 1.8,
      opacity: 0.72,
      color: "#d6e2ff"
    },
    near: {
      count: 220,
      spread: 220,
      size: 3.2,
      opacity: 0.78,
      color: "#f4f8ff"
    }
  },

  mist: {
    count: 9
  },

  dust: {
    count: 380
  },

  moon: {
    planeSize: 58,
    position: { x: 36, y: 16, z: -12 },
    halo1Scale: 110,
    halo2Scale: 170
  }
};

export default SCENE_CONFIG;