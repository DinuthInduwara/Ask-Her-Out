# A Little Question for You

A mobile-first invitation built with React, Vite, and Framer Motion. It opens in daylight with clouds and birds, then shifts to a moonlit garden with blooming flowers after the second guess. The page keeps to the real details: knowing each other in 4th and 5th grade, then meeting again 13 years later.

## Run locally

```bash
npm install
npm run dev
```

Open the URL printed by Vite (usually `http://localhost:5173`).

To personalize the name, optionally create `.env`:

```env
VITE_NAME="Her Name"
```

The opening screen is playful, not a security gate: the first submission shows a wrong-password message and the second opens the invitation, regardless of what was typed. No password is required.

## Checks

```bash
npm run build
npm run lint
```

The invitation asks whether she has ever had feelings for you. Its Yes button opens the synced moon-and-flowers music player through a flower-bloom transition. The direct music shortcut remains available at `/direct-to-music`. The "Maybe another time" button playfully dodges attempts and never selects an answer. The large audio file begins loading during the opening pages so playback is ready sooner.
