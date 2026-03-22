import { createApp } from "./core/app.js";

async function bootstrap() {
  try {
    const app = await createApp();

    console.log("App initialized successfully");
    console.log("Albums:", app.albums);
    console.log("Loaded photos:", app.loadedPhotos);

    window.addEventListener("resize", app.resize);

    function animate() {
      requestAnimationFrame(animate);
      app.renderer.render(app.scene, app.camera);
    }

    animate();
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