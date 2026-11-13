# Dunnio Tailor — Gallery & Life design demos

One static HTML/CSS/JavaScript site containing the original reference and proposed design for both collections. All demo interfaces use English.

## Online preview

Online preview: [Combined design comparison](https://tahieu98.github.io/demo-gallery-and-dunnio-life-page-dunnio-tailor/).

| Collection | Original reference | Proposed design |
| --- | --- | --- |
| Style Gallery · 28 photos | [Open reference](https://tahieu98.github.io/demo-gallery-and-dunnio-life-page-dunnio-tailor/gallery-page-dunnio-tailor/original/) | [Open proposal](https://tahieu98.github.io/demo-gallery-and-dunnio-life-page-dunnio-tailor/gallery-page-dunnio-tailor/improved/) |
| Dunnio Life · 50 photos | [Open reference](https://tahieu98.github.io/demo-gallery-and-dunnio-life-page-dunnio-tailor/dunnio-life-page-dunnio-tailor/original/) | [Open proposal](https://tahieu98.github.io/demo-gallery-and-dunnio-life-page-dunnio-tailor/dunnio-life-page-dunnio-tailor/improved/) |

`127.0.0.1` URLs work only while a server runs on the same device. A GitHub repository file view does not serve the website.

## Local preview

Run `npm start` or double-click `start-local.cmd`. No installation is needed. Open the printed URL. Set `PORT` if 4173 is in use. Run `npm run verify` to check assets, all 78 photos, inter-collection links and crawler directives. `npm test` checks filtering and catalog consistency. `npm run test:browser` uses the bundled Playwright runtime and a server at port 4183 (override with `DUNNIO_TEST_URL`).

## Order 4 — 14 November 2026

The mobile Filter dialog limits every facet to three complete option rows. Longer groups scroll independently and show a subtle scroll hint; shorter groups remain naturally sized. Row limits follow actual chip wrapping, including viewport/font changes and selected check marks. Draft selections still apply only on Apply. Desktop popovers retain their existing behavior.

Run `npm run test:mobile-filters` with the same local server/runtime setup as the browser suite. See [Order 4 notes and verification](docs/order-4-design.md).

## Order 2 — 13 November 2026

Order 3 updates the desktop hero on both improved pages: 10px vertical padding, a 1:3 text/photo split, no vertical divider and three collection photos. Tablet/mobile retain their existing hero treatment. See [Order 3 design and verification](docs/order-3-design.md).

Both proposals now use four separate dropdown filters — **Outfit, Color, Occasion, Situation** — plus Saved on one desktop/tablet row. Mobile has a fixed right-edge Filter button opening a modal with all four groups. Changes take effect on Apply; Cancel, Escape and outside dismissal discard pending edits. Multiple selections are OR within each field and AND between fields. Search, orientation, sorting and the result bar have been removed.

Collections preserve the original source order, thumbnail crops and responsive shortest-column masonry (7 / 5 / 3 / 2 columns). Full-resolution images open in the viewer, with outfit and context captions. Saved photos and filter URLs remain available.

The 78 photos have visually reviewed English outfit names, renamed image files, primary color, suggested occasions, indoor/outdoor setting, secondary outfits and uncertainty notes. Occasion describes editorial suitable-use suggestions, not verified events.

- [Combined catalog — XLSX](outputs/order-2/dunnio-image-catalog.xlsx)
- [Combined catalog — UTF-8 CSV](docs/dunnio-image-catalog.csv)
- [Old/new filename mapping](docs/image-renames.json)
- [Verification and screenshots](docs/order-2-verification.md)

Per-collection runtime data, JSON manifests and CSV catalogs are synchronized by `python scripts/update-catalog.py` from `scripts/order-2-classification.json`. Preserve stable photo IDs when revising tags. The XLSX builder is retained in the local audit workspace; regenerate the workbook after catalog changes and run `python scripts/verify-catalog-export.py`.

## Structure

```text
index.html                          # Four-page comparison hub
robots.txt                          # Crawler policy
gallery-page-dunnio-tailor/
  original/ improved/ assets/ docs/
dunnio-life-page-dunnio-tailor/
  original/ improved/ assets/ docs/
scripts/                            # Local server and verification
shared/                             # Shared filter model, controller and CSS
outputs/order-2/                    # Combined Excel catalog
```

Versions share assets within each collection. The combined site does not require the separate Life checkout. Provenance and design notes are retained in each collection's `docs/` folder.

## Publishing and crawler controls

Publish `main` → `/ (root)` using Pages branch publishing. `.nojekyll` keeps this static. There are no custom workflow dependencies. GitHub's built-in Pages deployment can appear in Actions; do not disable Actions while using Pages.

Every HTML page contains `noindex, nofollow, noarchive, nosnippet, noimageindex`. The local server also sends `X-Robots-Tag`. `robots.txt` disallows all crawlers and explicitly names common search and AI agents.

GitHub Pages does not support custom response headers. Crawlers normally read the domain's `/robots.txt`, rather than the file in a project subdirectory. HTML `noindex` therefore remains the indexing control on this project Pages site. These voluntary directives are not authentication or a guarantee that every bot is blocked. Use access-controlled hosting for strict exclusion.

This repository is public and uses GitHub Free Pages branch publishing. The HTML noindex directives apply to the demo site; the public GitHub source remains accessible.

The retired homepage is not a publishing source. Its Pages and Actions stay disabled. The former standalone Life repository is retained for history.

## Demo boundaries

Original versions preserve source DOM/CSS, image order, thumbnail crops and masonry, with independent JavaScript for local interactions. Proposals retain that collection layout while adding compact outfit/context filters. Wedding photos prioritize the groom. Filters, saved photos and the viewer work without a backend. Newsletter submission only validates input; live checkout, login and contact destinations open the source website.

Images, fonts, logo and reference styling originate from [Dunnio Tailor](https://dunniotailor.com/). These demos support design review.
