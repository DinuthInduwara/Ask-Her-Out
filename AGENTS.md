# AGENTS.md - Ask Her Out

## Quickstart

```bash
# Install and run dev server
npm install
npm run dev
# Open http://localhost:3000
```

## Required Environment

Create `.env` in root:
```env
VITE_PASSWORD="your_secret_password"
VITE_NAME="Crush's Name"
```

**Important**: Vite exposes only `VITE_*` prefixed env vars. These are injected at build time via `vite.config.js`.

## Tech Stack & Architecture

- **React 19** + **Vite 6** + **Tailwind 3**
- **Framer Motion** for animations
- **ESLint** with React hooks/refresh plugins

### Entry Flow
```
src/main.jsx → App.jsx → [Login | AskOut/DirectToMusic | LoveStoryPlayer]
```

- **Login**: Password gate, reads `VITE_PASSWORD`
- **AskOut**: Main "ask her out" page with floating emojis
- **DirectToMusic**: Shortcut to music player (skips ask flow)
- **LoveStoryPlayer**: Full-screen synced lyrics player

### Key Constraints

1. **FloatingBackground** (`src/components/FloatingBackground.jsx`): Renders at `z-index: -10`, `pointer-events: none`. Emojis have `pointer-events: auto` for click interaction.

2. **Assets**: All images exported from `src/constants/assets.js`. Music file imported directly: `import romanticMusic from "./assets/music/romantic.mp3"`.

3. **Styling**: Uses both Tailwind utilities and custom CSS in `src/index.css`. Gradient background defined in CSS, not Tailwind.

## Commands

```bash
npm run dev      # Dev server on :3000
npm run build    # Production build → dist/
npm run lint     # ESLint check
npm run preview  # Preview production build
```

## Common Gotchas

- **No .env file**: App will crash or show undefined for name/password
- **Missing music file**: Build will fail if `src/assets/music/romantic.mp3` doesn't exist
- **Dist folder**: ESLint ignores `dist/` (configured in `eslint.config.js`)
- **React version**: Using React 19, not 18

## File Structure

```
src/
├── App.jsx                 # Main router/layout
├── main.jsx               # Entry point
├── AskOut.jsx             # Main ask page
├── LoveStoryPlayer.jsx    # Lyrics/music player
├── Login.jsx              # Password gate
├── DirectToMusic.jsx      # Music shortcut
├── index.css              # Global styles + custom CSS
├── components/
│   ├── FloatingBackground.jsx  # z-index -10 emoji layer
│   └── MusicPlayer.jsx        # Audio controls
├── constants/
│   └── assets.js          # Image exports
└── hooks/
    └── useAssetPreloader.js   # Image preloading
```

## Deployment Notes

- Static SPA, deploy `dist/` to any static host
- Ensure env vars are set at build time (Vite injects them)
- `.env` should be in `.gitignore` (never commit secrets)
