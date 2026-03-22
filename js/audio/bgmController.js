import { APP_CONFIG } from "../config/appConfig.js";
import { appState, setMusicEnabled, setMusicStarted } from "../core/state.js";

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

export function createBgmController(audioPath = "./assets/audio/bgm.mp3") {
  const audio = new Audio(audioPath);
  audio.loop = true;
  audio.volume = 0;

  let currentVolume = 0;
  let targetVolume = 0;
  let rafId = null;

  function stopVolumeAnimation() {
    if (rafId) {
      cancelAnimationFrame(rafId);
      rafId = null;
    }
  }

  function fadeTo(volume, speed = 0.05) {
    targetVolume = clamp(volume, 0, 1);
    stopVolumeAnimation();

    function step() {
      currentVolume += (targetVolume - currentVolume) * speed;

      if (Math.abs(currentVolume - targetVolume) < 0.003) {
        currentVolume = targetVolume;
        rafId = null;
      } else {
        rafId = requestAnimationFrame(step);
      }

      audio.volume = clamp(currentVolume, 0, 1);
    }

    step();
  }

  async function start() {
    if (!appState.musicEnabled) return;
    if (appState.musicStarted) return;

    try {
      await audio.play();
      setMusicStarted(true);
      fadeTo(APP_CONFIG.music.defaultVolume, 0.06);
    } catch (error) {
      console.warn("Music playback is blocked until a trusted user gesture.", error);
    }
  }

  function pulse() {
    if (!appState.musicStarted || !appState.musicEnabled) return;

    fadeTo(APP_CONFIG.music.pulseVolume, 0.1);
    setTimeout(() => {
      fadeTo(APP_CONFIG.music.defaultVolume, 0.05);
    }, 700);
  }

  async function enable() {
    setMusicEnabled(true);
    await start();
    fadeTo(APP_CONFIG.music.defaultVolume, 0.06);
  }

  function disable() {
    setMusicEnabled(false);
    fadeTo(0, 0.08);
  }

  async function toggle() {
    if (appState.musicEnabled) {
      disable();
    } else {
      await enable();
    }

    syncButton();
  }

  function syncButton(button = document.getElementById("navMusic")) {
    if (!button) return;

    button.textContent = appState.musicEnabled ? "Music On" : "Music Off";
    button.classList.toggle("active", appState.musicEnabled);
  }

  if (APP_CONFIG.music.enabledByDefault) {
    setMusicEnabled(true);
  } else {
    setMusicEnabled(false);
  }

  return {
    audio,
    start,
    pulse,
    enable,
    disable,
    toggle,
    fadeTo,
    syncButton,
    isEnabled: () => appState.musicEnabled,
    isStarted: () => appState.musicStarted
  };
}