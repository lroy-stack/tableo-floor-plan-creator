# tableo-floor-plan-creator — restaurant floor plan editor

A prototype from July 2025, generated with Lovable (`lovable-tagger` in `package.json`). A visual editor for laying out tables and room elements in a restaurant. The README and UI text are in Spanish.

## What it does

- Canvas with zoom, pan, a snapping grid and drag and drop.
- Tables: circular or rectangular, minimum and maximum capacity, dining area, active or excluded state, rotation and material.
- Architectural elements: wall, door, window, plant, bar, column, stairs, artwork, carpet, fireplace.
- Configuration modal, elements panel, toolbar and status bar; toast notifications on every change.
- Light and dark themes. State lives in memory only: no backend and no saving.

## Built with

Vite, React 18, TypeScript, Tailwind CSS, shadcn/ui, Sonner.

## Run it locally

```bash
git clone https://github.com/lroy-stack/tableo-floor-plan-creator.git
cd tableo-floor-plan-creator
npm install
npm run dev
```

Status: archived prototype, not maintained.

---

Prototipo de julio 2025 hecho con Lovable: editor visual de planos de sala para restaurantes con mesas y elementos arrastrables. No guarda nada; el estado vive solo en memoria.
