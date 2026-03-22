import { loadManifest, preloadAlbumImages } from "./loader.js";
import { setAlbums, appState } from "./state.js";
import { setupScene } from "../scene/setupScene.js";

export async function createApp() {
  const container = document.getElementById("app");

  if (!container) {
    throw new Error('Missing root container: #app');
  }

  // 1. 读取相册数据
  const albums = await loadManifest("./assets/photos/manifest.json");
  setAlbums(albums);

  // 2. 预加载图片
  const loadedPhotos = await preloadAlbumImages(albums);
  appState.loadedPhotos = loadedPhotos;

  // 3. 初始化 Three.js 基础场景
  const sceneContext = setupScene(container);

  // 4. 返回后续模块要用到的上下文
  return {
    container,
    albums,
    loadedPhotos,
    ...sceneContext
  };
}