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

## Sources

Story, quotes and reviews drawn from the Luxury London and Carrier "Life Lessons" interviews
and lengishu.com. Photography is sourced from those same pages for layout purposes; replace
with licensed originals before publishing.
