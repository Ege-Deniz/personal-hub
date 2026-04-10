# Ege Deniz // Personal Hub

<p align="center">
  A spatial portfolio for AI engineering, full-stack product work, and visual systems.
</p>

<p align="center">
  <a href="https://rowy.engineer"><strong>Live Site</strong></a>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-14-000000?style=for-the-badge&logo=nextdotjs&logoColor=white" alt="Next.js 14" />
  <img src="https://img.shields.io/badge/React_Three_Fiber-Three.js-111111?style=for-the-badge&logo=threedotjs&logoColor=white" alt="React Three Fiber" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-3.4-38BDF8?style=for-the-badge&logo=tailwindcss&logoColor=white" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/Framer_Motion-11-0055FF?style=for-the-badge&logo=framer&logoColor=white" alt="Framer Motion" />
</p>

## Overview

This project is the current `rowy.engineer` portfolio build: a dark, cinematic Next.js experience with a custom particle background, glass UI panels, and a section structure focused on AI systems, all-around development, and visual design.

The site is designed as a spatial interface rather than a conventional portfolio grid. The main visual system is a shader-driven particle scene that morphs across the page while the content stays readable and structured.

## Experience Structure

| Section | Purpose |
| --- | --- |
| `Intro` | Establishes the visual identity and the primary particle form |
| `Personal Hub` | Shows identity, tools, media, links, and supporting context |
| `Studio Stack` | Summarizes AI, engineering, and visual design capabilities |
| `Contact` | Provides outbound links and direct contact pathways |

## Stack

| Layer | Tech |
| --- | --- |
| Framework | Next.js App Router, React, TypeScript |
| Styling | Tailwind CSS, custom glass/HUD styling |
| 3D | React Three Fiber, Three.js, `three-stdlib` |
| Motion | Framer Motion, custom pointer and scroll-driven shader uniforms |
| Visual Core | Instanced tetrahedron particles with multi-stage morph logic |

## Key Files

| Path | Responsibility |
| --- | --- |
| `src/components/three/SpatialBackground.tsx` | Particle background, shader, and morph behavior |
| `src/components/ui/Hero.tsx` | Landing section and primary headline |
| `src/components/ui/BentoGrid.tsx` | Personal Hub layout |
| `src/components/ui/SystemArchitecture.tsx` | Studio Stack section |
| `src/components/ui/Navbar.tsx` | Top navigation and anchors |
| `src/components/hud/HUDOverlay.tsx` | HUD readouts and status layer |

## Local Development

```bash
git clone https://github.com/Ege-Deniz/personal-hub.git
cd personal-hub
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Available Scripts

```bash
npm run dev
npm run build
npm run start
```

## Notes

- If `npm run build` is executed while `npm run dev` is already running, restart the dev server afterward to avoid stale `.next` chunks.
- The particle art direction is intentionally iterative, so silhouette and final-stage forms may continue evolving over time.

## Deployment

The production site is served at [rowy.engineer](https://rowy.engineer).
