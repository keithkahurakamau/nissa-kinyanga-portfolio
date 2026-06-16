# Nissa Ole Kinyaga — Portfolio

A single-page portfolio for **Nissa Ole Kinyaga**, a Maasai Silver Guide (one of only 59 in Kenya) at Lengishu, Borana Conservancy, Northern Kenya.

## Design

- **Aesthetic:** Scandinavian minimalism — generous whitespace, calm rhythm, editorial restraint.
- **Palette (60-30-10):** warm beige + charcoal grey grounds (60), soft brown containers (30), sage green accents (10).
- **Type:** Fraunces (editorial serif display) + Mulish (humanist sans body).
- **Details:** glassmorphism nav & badge, organic morphing blobs, soft natural-light gradients, grain overlay, scroll reveals, count-up stats, parallax, custom cursor. All copy is hand-written with no em dashes.

## Run

```bash
python3 -m http.server 8000
# open http://localhost:8000
```

No build step. Pure HTML / CSS / vanilla JS.

## Files

```
index.html          markup & content
assets/styles.css   all styling
assets/script.js    reveals, counters, parallax, cursor, photo loading
images/             real photography (Lengishu / Borana / interview portrait)
```

## Gallery & lightbox

The **Through the Lens** section is a CSS masonry grid (`column-count`) that handles mixed
photo aspect ratios. Click any image to open the lightbox: navigate with the on-screen
arrows, the **←/→ keys**, or a swipe on touch; close with **×**, **Esc**, or a click on the
backdrop. To add or remove photos, just edit the `<figure class="shot">` items in
`index.html` (each needs `data-full` and an `<img>`); the lightbox picks them up automatically.

## Contact form

The form in the **Plan a Safari** section validates client-side and, on submit, opens a
pre-filled email draft to the address in `assets/script.js` (`const TO = ...`). Change that
to Nissa's real address. To use a hosted form service instead (no email client needed),
swap the `setTimeout(...)` block for a `fetch()` POST to a Formspree/Basin endpoint.

## Swapping photos

Photo frames use a graceful fallback: each `.frame[data-photo]` shows a hand-drawn SVG
savanna scene, and `script.js` swaps in the real image once it loads. Drop a replacement
at the same path in `images/` and it appears automatically. Field cards reference images
inline via `style="background-image:..."`.

## SEO & appearing on Google

The site ships with everything Google needs to index it and show a rich result
(title, description, sitelinks, and a knowledge/business card):

- **Meta tags** — title, description, canonical, robots, geo, Open Graph + Twitter cards (`index.html` / `gazette.html` `<head>`).
- **Structured data** — JSON-LD `@graph` with `Person`, `TravelAgency` (offers + address + geo), `WebSite` and `BreadcrumbList`.
- **`sitemap.xml`** and **`robots.txt`** (robots points crawlers at the sitemap).
- **Icons** — `favicon.svg`, `favicon.ico`, `apple-touch-icon.png`, `icon-192/512.png`, plus `site.webmanifest`.

### Domain

All URLs (canonical, Open Graph, sitemap, robots, JSON-LD) are wired to the live
domain **`https://www.nissahsafaris.com`**. If it ever changes, find-and-replace it:

```bash
grep -rl 'www.nissahsafaris.com' . --exclude-dir=node_modules --exclude-dir=.git
# then replace in: index.html, gazette.html, sitemap.xml, robots.txt
```

### To actually show up on Google (off-code steps)

1. **Deploy** the folder to any static host (Netlify, Vercel, Cloudflare Pages, GitHub Pages, cPanel) on the real domain over HTTPS.
2. **Google Search Console** — verify the domain, then submit `https://<domain>/sitemap.xml`. This is what gets the site crawled and indexed; indexing usually takes a few days to a couple of weeks.
3. **Sitelinks** (the "About Us / Contact Us / Safari…" sub-links in the reference) are generated automatically by Google once the site has authority and clear structure — you can't force them. A single-page site gets fewer of these than a multi-page one; if those sub-links matter, the next step would be splitting the sections into real pages (`/story`, `/safaris`, `/contact`).
4. **The star-rating business card** (★ 5.0 · Tour agency · hours) in the reference comes from a **Google Business Profile**, *not* from the site's code. Create/claim one at [business.google.com](https://business.google.com) — category "Safari tour agency / Tour operator", add photos, hours and location — and ask real guests to leave reviews. Google's policy disallows a site marking up *its own* star ratings, which is why no fake `aggregateRating` is baked into the JSON-LD. Replace the placeholder testimonial attributions in the **In Their Words** section with real, named guests before publishing.

## Privacy & cookies

The site sets **no cookies and runs no tracking**. To keep it that way:

- **Fonts are self-hosted** in `assets/fonts/` (downloaded woff2 + `fonts-main.css` / `fonts-gazette.css`). No requests go to Google, so no visitor IPs leave the site. To refresh or change fonts, re-run the download or edit the two CSS files.
- **Consent banner** (`assets/consent.js`) records the visitor's choice in `localStorage` and exposes a gate for any analytics you add later:

  ```js
  NKConsent.onAccept(function () {
    // load GA4 / Plausible / etc. here — runs only after "Accept"
  });
  ```

  Until something is wired into `onAccept`, the banner is purely informational and nothing is tracked either way. `NKConsent.reopen()` re-shows the banner.

## Sources

Story, quotes and reviews drawn from the Luxury London and Carrier "Life Lessons" interviews
and lengishu.com. Photography is sourced from those same pages for layout purposes; replace
with licensed originals before publishing.
