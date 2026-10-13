# YouTube Clone

Static, front-end only. Open `index.html` in a browser (or serve the folder).

- `style.css` – all styling (dark YouTube look, responsive, collapsible sidebar)
- `auth.js` – demo sign-in, uploads, search, card rendering, watch-page behaviour
- `videos.js` – the video catalogue. Each entry plays the YouTube clip in `yt`.

## Thumbnails
Every video gets its own generated thumbnail. To use a real image, add a `thumb`
field to the entry in `videos.js`, e.g. `thumb: "https://…/photo.jpg"`.

## Adding a video to a page
Pages list videos by id in a `data-ids` attribute, e.g.
`<section class="video-grid" data-render="grid" data-ids="v01,v02,v03"></section>`.
