# Ege Deniz // Personal Hub

**Live Build:** [rowy.engineer](https://rowy.engineer)

![Next.js](https://img.shields.io/badge/Next.js-14-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)
![Three.js](https://img.shields.io/badge/Three.js-R3F-000000?style=for-the-badge&logo=threedotjs&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-38BDF8?style=for-the-badge&logo=tailwindcss&logoColor=white)
![GSAP](https://img.shields.io/badge/GSAP-Motion-88CE02?style=for-the-badge&logo=greensock&logoColor=white)

A spatial portfolio and personal hub for AI engineering, full-stack development, and visual/web design, built around a Dala-inspired particle morph engine, glass UI, and a dark cinematic interface system.

## Experience

- **Intro** — Hero section with the main particle form and portfolio positioning.
- **Personal Hub** — Bento-grid cards for projects, links, and identity context.
- **Studio Stack** — A compact engineering/design capabilities section while the particle system morphs into the final rose form.
- **Contact** — Social and contact uplinks.

## Architecture

- **Framework**: Next.js App Router + React + TypeScript
- **Styling**: Tailwind CSS, custom HUD and glass interface components
- **3D Engine**: React Three Fiber, Three.js, `three-stdlib`
- **Motion**: GSAP, Framer Motion, custom scroll/pointer shader uniforms
- **Particles**: Instanced tetrahedron swarm with 3-stage morph states and ambient background shards

## Project Map

- `src/components/three/DalaEngine.tsx` — particle background, shader, and scroll morph logic
- `src/components/ui/Hero.tsx` — landing section
- `src/components/ui/BentoGrid.tsx` — Personal Hub section
- `src/components/ui/SystemArchitecture.tsx` — Studio Stack section
- `src/components/ui/Navbar.tsx` — top navigation anchors

## Local Development

```bash
git clone https://github.com/Ege-Deniz/personal-hub.git
cd personal-hub
npm install
npm run dev
```

Open `http://localhost:3000`.

## Notes

- If you run `npm run build` while `npm run dev` is still active, restart the dev server afterwards so `.next` chunks do not go stale.
- The current visual direction is intentionally experimental and still being iterated, especially the act-3 particle form and mobile composition.
