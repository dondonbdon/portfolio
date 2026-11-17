# Project Singularity — 3D Galaxy Portfolio (`@dondonbdon`)

An interactive 3D galaxy portfolio built with **Next.js (App Router)**, **React Three Fiber**, **drei**, **@react-three/postprocessing**, **custom GLSL shaders**, **Lenis**, and **Tailwind CSS v4**.

Each repository and system orbits **Spotly** at the galactic core, with orbital radius acting as a chronological timeline from the **2023 Origins Belt** on the outer rim to **2026** at the core.

## Celestial Map

| Celestial Body | System | Visual / Shader Signature |
|---|---|---|
| **Galactic Core Star** | **Spotly** | FBM plasma shader + Fresnel corona, 3 vertical moons (*Ride*, *Send*, *Bite*), 4 client satellites (*Super*, *Driver*, *Merchant*, *Admin*) |
| **Ringed Gas Giant** | **Hacia Platform (v2 → v3)** | Banded turbulent atmosphere shader + particle ring representing the v2 → v3 reactive migration |
| **Refractive Crystal** | **FlashPDF** | Faceted refractive icosahedron + orbiting flipping flashcard shards |
| **Frozen Planet** | **wos-util** | Cracked frost shader, drifting snow blizzard particles, and surface tactical fortress nodes |
| **Orbital Clearing Station** | **payment-processor** | Metallic titanium torus emitting animated Kafka / Paynow bezier event beams |
| **Circuit Moon** | **stm32-utils** | Procedural PCB trace shader with travelling current pulses & orbiting pin headers |
| **Origins Asteroid Belt** | **2023 Android Fleet** | 180 instanced asteroids + 5 hero asteroids (*Swift*, *Elixer*, *Oslea*, *Paoz*, *IdealZW*) with a *Swift → Spotly* evolution beam |
| **Outer Halo Constellation** | **Archive** | Connected star nodes for *KDYM*, *AchieverFarm*, *Robocode*, *spring-starter*, *Boundless*, *wos-bot*, and *CS 9618* |

## Controls & Fallbacks

- **Scroll** in Overview mode to fly inward along the `CatmullRomCurve3` camera rail.
- **Click** any planet, asteroid, star, or HUD minimap node to dock and inspect its case study.
- **Keyboard:** `←` / `→` to step between systems, `Esc` to return to Galaxy Overview.
- **2D Lite & SEO:** Automatic WebGL2 / GPU tier / `prefers-reduced-motion` detection routes constrained devices to `LiteSite` (`/lite`), and every project has a statically generated case study at `/projects/[slug]`.

## Customization

- Personal bio, title, email, skills, and social links live in `src/content/profile.ts`.
- Featured bodies, archive stars, media, and links live in `src/content/projects.ts`.

## Local Development

```bash
npm install
npm run dev
```

Open `http://localhost:3000` (or `http://localhost:3000/?lite=1` for 2D mode).
