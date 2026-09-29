# A Little Question for You

A mobile-first invitation built with React, Vite, and Framer Motion. A moonlit garden, paper swallows, and drifting petals frame the real details: knowing each other in 4th and 5th grade, then meeting again 13 years later.

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

The invitation's Yes button opens the synced record-and-lyrics player. The direct music shortcut remains available at `/direct-to-music`. The "Maybe another time" button playfully dodges attempts and never selects an answer.
