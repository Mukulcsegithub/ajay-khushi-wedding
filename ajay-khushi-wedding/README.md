# Ajay ❤️ Khushi — Royal Wedding Invitation

A responsive React + TypeScript wedding invitation site.

## Run locally
1. Install Node.js 20+.
2. In this folder run `npm install`.
3. Run `npm run dev`.
4. Open the local URL printed by Vite.

## Personalize before publishing
- Add the two original invitation card images to `public/images/` and use them to verify family names, exact venue spelling and procession/departure details.
- Add your legally obtained/licensed song MP3 at `public/audio/do-anjaane-ajnabi.mp3`. Music starts only after the visitor opens the invitation.
- Add couple photographs to `public/images/` only when supplied by the family. Until then, gallery cards are clearly labelled placeholders.
- Update `src/config.ts` with verified family and venue details.
- The Google Maps link intentionally uses a place-name search rather than invented coordinates.
- Wishes are saved to localStorage in demo mode. To use Supabase, set the two Vite environment variables and create a `wishes` table with columns `id` (uuid primary key), `name` (text), `relationship` (text), `message` (text), `created_at` (timestamptz default now()).

## Build
`npm run build`

## Deploy
Deploy the project folder to Vercel, Netlify or another static hosting provider. Set environment variables if using Supabase.


## Deploy to Vercel
1. Push this project folder to a GitHub repository.
2. In Vercel choose **Add New → Project**, import the repository.
3. Framework preset: **Vite**. Build command: `npm run build`. Output directory: `dist`.
4. Deploy. Add Supabase environment variables in Vercel Project Settings if using shared wishes.
5. Ensure `public/audio/do-anjaane-ajnabi.mp3` is included in the deployed project (only if you have rights to use that recording).

The layout includes a mobile navigation menu, responsive sections, and tap-friendly music controls. Test on a real phone after deployment.
