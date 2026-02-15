# Divyesh Chauhan — Developer Portfolio

A modern, eye-catching portfolio built with **React** and **Tailwind CSS** (Vite). **Vercel-ready** for one-click deploy.

## Design

- **Visuals:** Gradient orbs, animated gradient name, glassmorphism nav, glowing CTAs, gradient borders on hover.
- **Typography:** Syne for headings, Space Grotesk for UI, JetBrains Mono for code.
- **Animations:** Staggered hero fade-in, blinking terminal cursor, subtle float and glow.

## Run locally

```bash
npm install
npm run dev
```

Open the URL shown in the terminal (e.g. http://localhost:5173).

## Deploy on Vercel (live in minutes)

1. Push this project to a **GitHub** repo.
2. Go to [vercel.com](https://vercel.com) → **Add New** → **Project** → import your repo.
3. Leave **Build Command** as `npm run build` and **Output Directory** as `dist` (Vercel detects Vite automatically).
4. Click **Deploy**. Your site will be live at `https://your-project.vercel.app`.

The repo includes a `vercel.json` that:
- Uses `dist` as the output directory.
- Rewrites all routes to `index.html` (SPA) so direct links and refresh work.
- Leaves `/cv/*` untouched so your PDF resume is served correctly.

## Customize

- **Content:** Edit `src/App.jsx` (name, about, skills, projects, contact links).
- **CV:** Put your PDF in `public/cv/` and name it `resume.pdf` (see `public/cv/README.md`).
- **Theme:** Adjust CSS variables and keyframes in `src/index.css`.

## Build for production

```bash
npm run build
```

Output is in `dist/`. Deploy that folder to any static host if not using Vercel.
