import { loadGalleryData } from "./gallery/galleryData.js";
import { initGalleryUI, openGallery } from "./gallery/galleryUI.js";
import { initLightbox } from "./gallery/lightbox.js";

async function bootstrap() {
  await loadGalleryData();

  initLightbox({
    root: document.getElementById("lightbox"),
    img: document.getElementById("lightboxImg"),
    caption: document.getElementById("lightboxCaption"),
    closeBtn: document.getElementById("closeLightbox"),
    prevBtn: document.getElementById("prevLightbox"),
    nextBtn: document.getElementById("nextLightbox")
  });

  initGalleryUI({
    modal: document.getElementById("galleryModal"),
    albumList: document.getElementById("albumList"),
    grid: document.getElementById("galleryGrid"),
    heading: document.getElementById("galleryHeading"),
    sub: document.getElementById("gallerySub"),
    meta: document.getElementById("galleryMeta"),
    closeBtn: document.getElementById("closeGallery"),
    onPhotoSelect: (src) => {
      console.log("selected photo:", src);
      // 第三批这里再接 revealSpecificPhoto(src)
    }
  });

  document.getElementById("navGallery")?.addEventListener("click", openGallery);
  document.getElementById("heroGalleryBtn")?.addEventListener("click", openGallery);
}

bootstrap().catch(err => {
  console.error("bootstrap failed:", err);
});