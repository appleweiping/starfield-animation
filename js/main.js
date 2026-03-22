import { createApp } from "./core/app.js";
import { bindGlobalEvents } from "./core/events.js";
import { startAnimationLoop } from "./scene/animationLoop.js";

import { createStars } from "./scene/stars.js";
import { createMist } from "./scene/mist.js";
import { createDust } from "./scene/dust.js";
import { createMoon, showMoonPhoto } from "./scene/moon.js";
import { createRipples } from "./scene/ripples.js";
import { createShootingStars } from "./scene/shootingStars.js";

import { createLightbox } from "./gallery/lightbox.js";
import { createGalleryUI } from "./gallery/galleryUI.js";

import { createBgmController } from "./audio/bgmController.js";
import { createNavbar } from "./ui/navbar.js";
import { createAboutModal } from "./ui/modals.js";
import { createQuoteController } from "./ui/quote.js";

async function bootstrap() {
  try {
    const app = await createApp();

    // Scene modules
    const stars = createStars(app);
    const mist = createMist(app, 9);
    const dust = createDust(app, 380);
    const moon = createMoon(app, app.loadedPhotos);
    const ripples = createRipples(app);
    const shootingStars = createShootingStars(app);

    // UI / Audio modules
    const bgm = createBgmController("./assets/audio/bgm.mp3");
    const quote = createQuoteController();
    const aboutModal = createAboutModal();

    const lightbox = createLightbox({
      onPhotoChange: (src) => {
        showMoonPhoto(moon, src);
      }
    });

    const galleryUI = createGalleryUI({
      lightbox,
      onPhotoSelect: (src) => {
        showMoonPhoto(moon, src);
      }
    });

    const navbar = createNavbar({
      onGalleryClick: () => {
        galleryUI.open();
        navbar.setGalleryActive(true);
      },
      onAboutClick: () => {
        aboutModal.open();
        navbar.setAboutActive(true);
      },
      onMusicClick: async () => {
        await bgm.toggle();
        bgm.syncButton(navbar.elements.navMusic);
        navbar.setMusicActive(bgm.isEnabled());
      }
    });

    // patch close methods so navbar active state stays in sync
    const originalGalleryClose = galleryUI.close;
    galleryUI.close = () => {
      originalGalleryClose();
      navbar.setGalleryActive(false);
    };

    const originalAboutClose = aboutModal.close;
    aboutModal.close = () => {
      originalAboutClose();
      navbar.setAboutActive(false);
    };

    bgm.syncButton(navbar.elements.navMusic);
    navbar.setMusicActive(bgm.isEnabled());

    window.addEventListener("resize", app.resize);

    const runtime = {
      ...app,
      stars,
      mist,
      dust,
      moon,
      ripples,
      shootingStars,
      bgm,
      quote,
      galleryUI,
      aboutModal,
      lightbox,
      navbar
    };

    bindGlobalEvents(runtime);
    startAnimationLoop(runtime);

    console.log("App fully initialized");
  } catch (error) {
    console.error("Failed to bootstrap app:", error);

    const fallback = document.createElement("div");
    fallback.style.position = "fixed";
    fallback.style.inset = "0";
    fallback.style.display = "grid";
    fallback.style.placeItems = "center";
    fallback.style.background = "#02040e";
    fallback.style.color = "white";
    fallback.style.fontFamily = "sans-serif";
    fallback.style.padding = "24px";
    fallback.style.textAlign = "center";
    fallback.innerHTML = `
      <div>
        <h2 style="margin-bottom: 12px;">App failed to start</h2>
        <div style="opacity: 0.75;">Check the browser console for details.</div>
      </div>
    `;

    document.body.appendChild(fallback);
  }
}

bootstrap();