# AGENTS.md - Ask Her Out

## Quickstart

```bash
# Install and run dev server
npm install
npm run dev
# Open the URL printed by Vite (usually http://localhost:5173)
```

## Optional Personalization

To show her name, create `.env` in root:
```env
VITE_NAME="Crush's Name"
```

The opening form is a playful two-try interaction. The first submission shows "Wrong password"; the second unlocks the invitation regardless of input. There is no real password or security gate.

## Tech Stack & Architecture

- **React 19** + **Vite 6** + **Tailwind 3**
- **Framer Motion** for animations
- **ESLint** with React hooks/refresh plugins

### Entry Flow
```
src/main.jsx → App.jsx → [Login | AskOut/DirectToMusic | LoveStoryPlayer]
```

- **Login**: Daylight entrance with clouds, birds, a setting sun, and a playful two-try form
- **AskOut**: Moonlit garden confession and endlessly dodging Maybe button
- **DirectToMusic**: Matching letter shortcut to the music player
- **LoveStoryPlayer**: Moon-as-record synced lyrics player with flowers

### Key Constraints

1. **DaySky / MoonGarden / PetalWeather** (`src/components/`): Decorative scenes and petals. Keep them non-interactive and respect reduced-motion preferences.

2. **Assets**: All images exported from `src/constants/assets.js`. The music file is imported directly in `LoveStoryPlayer.jsx`.

3. **Styling**: Uses both Tailwind utilities and custom CSS in `src/index.css`. The garden palette, petals, and transitions are defined in CSS.

## Commands

```bash
npm run dev      # Vite dev server, usually on :5173
npm run build    # Production build → dist/
npm run lint     # ESLint check
npm run preview  # Preview production build
```

## Common Gotchas

- **No .env file**: The app still works and uses "you" in place of a name
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
├── Login.jsx              # Playful two-try entrance
├── DirectToMusic.jsx      # Music shortcut
├── index.css              # Global styles + custom CSS
├── components/
│   ├── MoonGarden.jsx       # Shared moon, flowers, and swallows
│   ├── DaySky.jsx           # Clouds, birds, and setting sun
│   ├── PetalWeather.jsx     # Drifting petals
│   ├── FloatingBackground.jsx  # Legacy, not mounted
│   └── MusicPlayer.jsx      # Legacy, not mounted
├── constants/
│   └── assets.js          # Image exports
└── hooks/
    └── useAudio.js          # Synced audio playback
```

## Deployment Notes

- Static SPA, deploy `dist/` to any static host
- Ensure env vars are set at build time (Vite injects them)
- `.env` should be in `.gitignore` (never commit secrets)
