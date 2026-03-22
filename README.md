# 🌌 Starlit Archive

**Moon · Memory · Motion**

An immersive, interactive night-sky experience that blends generative visuals, subtle physics-inspired motion, and a personal photo archive into a single poetic interface.

🔗 Live Demo: https://appleweiping.github.io/starfield-animation/

---

## ✨ Overview

**Starlit Archive** is an interactive web experience designed to feel like stepping into a quiet, personal night.

It combines:

* A dynamic **Three.js starfield**
* A responsive **moon-centered memory system**
* A fully usable **photo gallery interface**
* Subtle interaction-driven effects like **ripples, glow, and motion parallax**

The project explores how **emotion, memory, and interface design** can coexist in a single visual system.

---

## 🎯 Features

### 🌠 Interactive Starfield

* Multi-layered stars (far / mid / near)
* Depth-aware motion with subtle parallax
* Ambient shooting stars

### 🌕 Moon-Centered Interaction

* Central visual anchor
* Responds to user interaction (pulse, light)
* Displays memory fragments (photos)

### 💧 Ripple System (Core Interaction)

* Click anywhere to "wake the sky"
* Physically-inspired ripple expansion
* Smooth lifecycle: spawn → expand → fade → dispose
* Drives global pulse used by other systems

### 🖼️ Gallery System

* Album-based structure
* Thumbnail browsing
* Lightbox preview
* Seamless integration with scene

### 🎵 Ambient Experience

* Optional background music
* Interaction-triggered playback (browser-safe)

---

## 🧠 Design Philosophy

> Not a gallery. Not a scene.
> A **space you inhabit**.

This project is built around:

* **Calm interaction** (no aggressive UI)
* **Continuity of motion**
* **Emotional coherence between systems**

Instead of separating UI and visuals, everything is treated as a **single reactive system**.

---

## 🏗️ Architecture

```
js/
├── core/          # App state, event binding, bootstrapping
├── scene/         # Three.js systems (stars, moon, ripples, etc.)
├── gallery/       # Album data + UI logic
├── ui/            # Navbar, modals, text layers
├── config/        # Centralized tuning parameters
└── main.js        # Entry point
```

### Key Systems

| System             | Responsibility                  |
| ------------------ | ------------------------------- |
| `setupScene.js`    | Scene / camera / renderer setup |
| `animationLoop.js` | Main render loop                |
| `ripples.js`       | Interaction physics + lifecycle |
| `moon.js`          | Visual anchor + memory display  |
| `galleryUI.js`     | Album browsing                  |
| `events.js`        | Input handling                  |

---

## ⚙️ Technical Highlights

### 🧩 Modular Design

* Clear separation between scene, UI, and state
* Reusable systems (e.g. ripple pulse reused by moon & stars)

### ⏱️ Time System (Important Fix)

* Correct use of `THREE.Clock`
* Avoided double `getDelta()` bug
* Ensures stable animation lifecycle

### ♻️ Memory Management

* Proper cleanup:

  * `scene.remove(...)`
  * `geometry.dispose()`
  * `material.dispose()`
* Prevents GPU memory leaks

### 🚀 Performance Considerations

* Capped delta time (`≤ 0.033`)
* Limited particle counts per layer
* Additive blending for lightweight glow

---

## 🧪 Known Issues & Notes

* Browser audio requires first user interaction
* GitHub Pages caching may require hard refresh (`Ctrl + Shift + R`)
* External Three.js CDN may be replaced with local bundling in future

---

## 🛠️ Setup

### 1. Clone

```bash
git clone https://github.com/appleweiping/starfield-animation.git
cd starfield-animation
```

### 2. Run locally

Use any static server (recommended):

```bash
npx serve
```

or

```bash
python -m http.server
```

---

## 📦 Deployment

Deployed via **GitHub Pages**:

* Branch: `main`
* Path: `/root`
* URL:

```
https://appleweiping.github.io/starfield-animation/
```

---

## 🧭 Future Improvements

* [ ] Replace CDN Three.js with local module
* [ ] Enhance ripple realism (less UI-like, more fluid)
* [ ] Improve gallery transitions (motion-based)
* [ ] Mobile performance optimization
* [ ] Add shader-based moon surface detail
* [ ] Progressive loading for large photo sets

---

## 📸 Credits

Personal photos used for demonstration purposes.

---

## 📄 License

MIT License

---

## 🙌 Author

**Weiping Yan**

Undergraduate in Computer Science, Electrical Engineering, and Applied Physics
TU Delft & Eindhoven University of Technology

---

## 🌙 Closing Thought

> Every star feels quieter with you.

This project is not about features.
It is about **presence**.
