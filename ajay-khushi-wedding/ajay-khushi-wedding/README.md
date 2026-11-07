# Ajay ❤️ Khushi — Wedding Invitation

A responsive React + TypeScript wedding invitation for mobile and desktop.

## Add the Ranjha song

The music player is configured to load this file:

`public/audio/ranjha.mp3`

Place your legally obtained MP3 recording of **“Ranjha”** (from *Shershaah*) at that exact path and filename. The audio file is not included because the commercial recording is copyrighted. Once added, the invitation plays it after the visitor taps **OPEN WEDDING INVITATION**. The floating music control pauses and resumes playback.

## Run locally

1. Install Node.js 20 or newer.
2. Open this project folder in a terminal.
3. Run `npm install`.
4. Run `npm run dev`.
5. Open the local URL printed by Vite.

## Personalize

Edit `src/config.ts` to update names, dates, venue, map link and family details. Confirm all event times and venue spelling with the family before publishing.

## Deploy to Vercel

1. Push this project folder to GitHub.
2. Import the repository in Vercel.
3. Select **Vite** as the framework.
4. Build command: `npm run build`
5. Output directory: `dist`
6. Deploy.

Keep `public/audio/ranjha.mp3` in the project before deploying if you want the Ranjha track to play.
