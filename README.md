# Perfect Pantry Website Template (HTML/CSS/JS)

This folder is a lightweight, responsive marketing/support site for **Perfect Pantry**.

## Files
- `index.html` — Landing page with interactive guided tour
- `screenshots.html` — Screenshot gallery with filter + lightbox
- `support.html` — FAQs + contact form (template)
- `privacy.html` — Starter privacy policy page
- `assets/css/styles.css` — Styling (edit the CSS variables at the top to change the look)
- `assets/js/main.js` — Mobile menu + lightbox + demo form handling
- `assets/img/` — Placeholder images (swap with real screenshots)

## Quick customization checklist
1. Update the email address: `support@perfectpantryapp.com`
2. Replace placeholder SVG screenshots in `assets/img/` with real PNG/JPG
3. Update copy (headlines, pricing, FAQs) based on what your app really does
4. Review and customize `privacy.html` to match your actual data practices

## Using this with Wix
Wix generally works best when you build pages inside the Wix editor.
If you want to use this exact HTML:
- **Option A (Embed):** Add an **HTML iFrame / Embed Code** element on a Wix page and paste the HTML.
  - Best for small widgets/sections.
  - Limitations: it’s inside an iframe and not the whole site.
- **Option B (External hosting):** Host this folder on Netlify/Vercel/GitHub Pages and connect your domain to that host.

## Hosting locally (for testing)
Open `index.html` in a browser or run a local server:
- `python -m http.server 8000`
Then visit: http://localhost:8000


## Kitchen background images
To match the mobile app look, add these files (case-sensitive):
- `assets/backgrounds/bg_home.jpg`
- `assets/backgrounds/bg_pantry.jpg`
- `assets/backgrounds/bg_cookbook.jpg`
- `assets/backgrounds/bg_shopping.jpg`

Each page sets `<body data-bg="...">` and the CSS maps that to the correct background.
