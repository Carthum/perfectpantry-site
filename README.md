# Pantry & Plate Website Template (HTML/CSS/JS)

This folder is a lightweight, responsive marketing/support site for **Pantry & Plate**.

## Source-of-truth checks
- The production website source for `pantryandplate.app` should contain `CNAME`
  with exactly `pantryandplate.app`.
- Before deploying, verify the checkout, branch, and dirty status with
  `pwd`, `git branch --show-current`, `git status --short`, and `cat CNAME`.
- Do not deploy from a checkout whose `CNAME` still points at
  `perfectpantryapp.com`.

## Files
- `index.html` — Landing page with interactive guided tour
- `support.html` — FAQs + contact form (template)
- `privacy.html` — Starter privacy policy page
- `assets/css/styles.css` — Styling (edit the CSS variables at the top to change the look)
- `assets/js/main.js` — Mobile menu + lightbox + demo form handling
- `assets/img/` — Placeholder images (swap with real screenshots)

## Public brand URLs
- Homepage: https://pantryandplate.app
- Logo: https://pantryandplate.app/assets/brand/pantry-and-plate-logo.png
- Google Play: https://play.google.com/store/apps/details?id=app.pantryandplate
- Terms: https://pantryandplate.app/terms.html
- Privacy: https://pantryandplate.app/privacy.html
- DMCA: https://pantryandplate.app/dmca.html

## Launch CTA configuration

The static site uses `assets/js/launch-config.js` as the public-safe launch
configuration module. The checked-in fallback values intentionally make Android
launch traffic work without a build step:

```text
NEXT_PUBLIC_GOOGLE_PLAY_URL=https://play.google.com/store/apps/details?id=app.pantryandplate
NEXT_PUBLIC_APP_STORE_URL=
NEXT_PUBLIC_IOS_WAITLIST_URL=
NEXT_PUBLIC_SITE_URL=https://pantryandplate.app
NEXT_PUBLIC_ENABLE_GOOGLE_PLAY_CTA=true
NEXT_PUBLIC_ENABLE_IOS_WAITLIST=true
NEXT_PUBLIC_ENABLE_APP_STORE_CTA=false
```

- Google Play is live, so the Google Play CTA defaults to enabled.
- iOS is awaiting App Store review, so the iOS waitlist CTA defaults to enabled.
- Until a waitlist provider URL is configured, iOS waitlist links use the
  mailto fallback to `support@pantryandplate.app`.
- Do not enable an App Store CTA or set `NEXT_PUBLIC_APP_STORE_URL` until Apple
  approves a real App Store listing URL.
- When iOS is approved, set `NEXT_PUBLIC_APP_STORE_URL=<real App Store URL>`
  and set `NEXT_PUBLIC_ENABLE_APP_STORE_CTA=true` if the site should expose a
  live App Store CTA.

## Quick customization checklist
1. Verify the support email address: `support@pantryandplate.app`
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
