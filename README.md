# Dynoz AI — Hospitality Intelligence

> A small React + Vite demo: an interactive landing page for Dynoz AI — hospitality intelligence tools and showcases.

## Features

- Interactive UI built with React and Vite
- Custom components: hero, navigation, showcase, contact section, mini ping-pong game

## Tech stack

- Vite
- React (JSX)
- GSAP (GreenSock) for advanced animations
- Framer Motion for declarative motion in React
- Three.js for 3D, with `@react-three/fiber` and `@react-three/drei`
- Lenis for smooth scrolling
- Tailwind CSS (dev dependency) — optional utility styles
- Node.js and npm for tooling and scripts

## Getting started

Prerequisites: Node.js (16+ recommended) and npm.

Install dependencies:

```bash
npm install
```

Start development server:

```bash
npm run dev
```

Build for production:

```bash
npm run build
```

Preview the production build locally:

```bash
npm run preview
```

The app usually runs at `http://localhost:5173/` when the dev server is started.

## Project structure (tree)

```
dynoz/
├─ index.html
├─ package.json
├─ vite.config.js
├─ README.md
├─ public/
│  └─ images/
└─ src/
   ├─ main.jsx
   ├─ App.jsx
   ├─ index.css
   └─ components/
      ├─ ContactSection.jsx
      ├─ CustomCursor.jsx
      ├─ DomainShader.jsx
      ├─ FeaturesSection.jsx
      ├─ HeroSection.jsx
      ├─ Navigation.jsx
      ├─ PingPongGame.jsx
      └─ ShowcaseSection.jsx
```

If you have other folders (tests, scripts, CI configs), add them here as needed.

## Contributing

1. Open an issue describing the change.
2. Create a branch for your feature/fix.
3. Submit a PR with a clear description and any screenshots.


## License

MIT
