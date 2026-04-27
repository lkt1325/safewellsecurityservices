# Safewell Security Services — Static Website

Pure HTML / CSS / Vanilla JS. **No build step. No frameworks.**

## Structure
```
/static-site
  ├── index.html
  ├── style.css
  ├── script.js
  └── /images
```

## Run locally
Just open `index.html` in your browser. Or:
```bash
python3 -m http.server 8080
# then visit http://localhost:8080
```

## Deploy
- **Vercel / Netlify**: drag-and-drop the `static-site` folder.
- **GitHub Pages**: push folder contents to a repo, enable Pages on `main` branch.

## Customize
- Colors live at the top of `style.css` (`--yellow`, `--black`).
- Replace any image in `/images` with the same filename.
- Update copy directly in `index.html`.
