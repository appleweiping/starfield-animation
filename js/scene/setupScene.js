import * as THREE from "https://unpkg.com/three@0.160.0/build/three.module.js";
import { SCENE_CONFIG } from "../config/sceneConfig.js?v=2";

export function setupScene(container) {
  if (!container) {
    throw new Error("setupScene: container is required");
  }

  const scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(
    SCENE_CONFIG.background.fogColor,
    SCENE_CONFIG.background.fogDensity
  );

  const camera = new THREE.PerspectiveCamera(
    SCENE_CONFIG.camera.fov,
    window.innerWidth / window.innerHeight,
    SCENE_CONFIG.camera.near,
    SCENE_CONFIG.camera.far
  );

  camera.position.set(
    SCENE_CONFIG.camera.initialPosition.x,
    SCENE_CONFIG.camera.initialPosition.y,
    SCENE_CONFIG.camera.initialPosition.z
  );

  const renderer = new THREE.WebGLRenderer({
    antialias: true,
    alpha: true
  });

  renderer.setPixelRatio(
    Math.min(window.devicePixelRatio, SCENE_CONFIG.renderer.maxPixelRatio)
  );
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = SCENE_CONFIG.renderer.toneMappingExposure;

  container.innerHTML = "";
  container.appendChild(renderer.domElement);

  const clock = new THREE.Clock();
  const raycaster = new THREE.Raycaster();
  const interactionPlane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);
  const worldPoint = new THREE.Vector3();

  function resize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(
      Math.min(window.devicePixelRatio, SCENE_CONFIG.renderer.maxPixelRatio)
    );
  }

  return {
    THREE,
    scene,
    camera,
    renderer,
    clock,
    raycaster,
    interactionPlane,
    worldPoint,
    resize
  };
}