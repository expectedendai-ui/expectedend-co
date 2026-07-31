# expectedend.co

The public company website for Expected End: purpose-built software, productivity tools, digital experiences, and communities.

## Live

https://expectedend.co

## What is here

- Royal-blue and white company themes
- MyBibleLens and The Water Check project links
- Company story, services, and information pages
- A tiny golden egg on `/about` that preserves the original art-world experience
- The original infinite 3D canvas, loaded only after the golden egg is opened

## Develop

```bash
npm install
npm run dev
```

Run the automated checks with:

```bash
npm test -- --run
npm run check
npm run build
```

The local dev server prints the preview URL after startup. Direct routes such as `/about`, `/privacy`, and `/accessibility` use the same Vite single-page app entry.

## Protected media

Original art remains in `public/artworks/`, with its metadata in `src/artworks/manifest.json`. Audio stays local-only in `public/audio/` and is excluded from Git. Crawler rules preserve the existing blocks for both directories.

## Credits

The hidden infinite canvas builds on Edoardo Lunardi’s MIT-licensed [Infinite Canvas tutorial](https://www.edoardolunardi.dev/), originally published on [Codrops](https://tympanus.net/codrops/?p=106679). The original license is retained in [LICENSE](LICENSE).
