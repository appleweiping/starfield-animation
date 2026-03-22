export function createNavbar({
  onGalleryClick,
  onAboutClick,
  onMusicClick
} = {}) {
  const navGallery = document.getElementById("navGallery");
  const navAbout = document.getElementById("navAbout");
  const navMusic = document.getElementById("navMusic");
  const heroGalleryBtn = document.getElementById("heroGalleryBtn");
  const heroAboutBtn = document.getElementById("heroAboutBtn");

  if (!navGallery || !navAbout || !navMusic) {
    throw new Error("Navbar DOM elements are missing");
  }

  function bindClick(button, handler) {
    if (!button || typeof handler !== "function") return;
    button.addEventListener("click", handler);
  }

  bindClick(navGallery, onGalleryClick);
  bindClick(navAbout, onAboutClick);
  bindClick(navMusic, onMusicClick);
  bindClick(heroGalleryBtn, onGalleryClick);
  bindClick(heroAboutBtn, onAboutClick);

  function setGalleryActive(active) {
    navGallery.classList.toggle("active", !!active);
  }

  function setAboutActive(active) {
    navAbout.classList.toggle("active", !!active);
  }

  function setMusicActive(active) {
    navMusic.classList.toggle("active", !!active);
  }

  return {
    elements: {
      navGallery,
      navAbout,
      navMusic,
      heroGalleryBtn,
      heroAboutBtn
    },
    setGalleryActive,
    setAboutActive,
    setMusicActive
  };
}