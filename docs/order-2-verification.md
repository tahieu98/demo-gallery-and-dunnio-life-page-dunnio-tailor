# Order 2 verification — 13 November 2026

This report covers the Order 2 implementation in the combined repository. GitHub synchronization and Pages publishing are verified separately after publication. Older hosting records describe the previous deployed version.

## Data
- 28 Style Gallery + 50 Dunnio Life photos; stable IDs and source order retained.
- English primary-outfit names and filenames, color family, suitable-use Occasion tags, visible Situation and secondary-outfit notes.
- Runtime JS, JSON manifests and per-collection/combined UTF-8 CSV catalogs agree; renamed full images and unchanged thumbnails exist.
- XLSX has the same 78 records and 22 columns as CSV, a filterable table, frozen headers/IDs and a data dictionary. Verified by reading workbook XML directly and visually inspecting a rendered sample.
- All 78 renamed full images and all 78 thumbnail files are byte-identical to the pre-change Git baseline. Reversing filename substitutions restores the exact original HTML (ignoring newline encoding).
- Color refinements: Gallery 002 is a navy polo; Gallery 017 uses the gray waistcoat as its primary outer garment. Gallery 014 describes two men without inferring a couple. Life 002 has a visible navy waistcoat and is a three-piece suit.
- Occasion tags are editorial suggestions, not assertions about actual events. Tiny source images and garment details that cannot be confirmed are noted.

## Automated checks
- `npm test`: 7 Node tests pass. Covers source order, OR/AND semantics, Saved intersection, invalid/stale URL values, URL round-trip, runtime/manifest file-path agreement and metadata completeness.
- `npm run verify`: all 78 images, HTML/CSS local references, cross-page links, English language and noindex/crawler directives pass.
- `python scripts/verify-catalog-export.py`: XLSX/CSV agreement, table and frozen panes pass.
- `npm run test:browser`: both collections pass in Chromium with no page errors or failed HTTP assets during the tested flows. Machine summary: [browser results](order-2-browser-results.json).

## Browser coverage
- Desktop 1440px; tablet 1024px and 768px: four independent dropdown buttons plus Saved on one row; color choices hidden until opened.
- All four facets applied together: Gallery Black Tuxedo / Black / Wedding / Outdoor = 3 photos; Life Black Waistcoat with White Shirt / Black / Wedding / Indoor = 2 photos.
- Black-only results: Gallery 6; Life 7. Apply, Cancel, Escape, outside dismissal and reload work; uncommitted choices do not alter the collection.
- Empty combinations and reset, Saved persistence/intersection, full-image viewer and metadata captions work.
- Mobile 390×844: fixed right-middle trigger, four field groups, pending selections, Apply/Clear all, keyboard focus loop, Escape and return focus. Modal reopening starts at the top. Unsave in mobile Saved view returns focus to the visible Filter button.
- Responsive widths 320 / 575 / 576 / 991 / 992 / 1199 / 1200 / 1440: no horizontal overflow or tile overlaps after layout. Original/proposed column counts agree at 390 / 768 / 1024 / 1440. First ten thumbnail aspect ratios in each collection agree with the original.
- Landscape tablet 844×390: popup positioning keeps Apply entirely inside the visible panel. The regression failed before the positioning fix and passed afterward.
- Independent review also checked 844×250 on both collections: actions remain visible and options scroll. No actionable findings remain after the fixes.
- Direct `file://` open and mobile color filtering pass on both improved pages without a server.
- The original DOM/CSS and thumbnail files are retained; original HTML changes only reference renamed full-image files. Both versions use the enriched shared metadata/viewer.

## Visual evidence
| Collection | Desktop | Open dropdown | Mobile | Mobile filters |
| --- | --- | --- | --- | --- |
| Style Gallery | [Preview](order-2-previews/gallery-page-dunnio-tailor-desktop.png) | [Color](order-2-previews/gallery-page-dunnio-tailor-desktop-popover.png) | [Preview](order-2-previews/gallery-page-dunnio-tailor-mobile.png) | [Panel](order-2-previews/gallery-page-dunnio-tailor-mobile-filters.png) |
| Dunnio Life | [Preview](order-2-previews/dunnio-life-page-dunnio-tailor-desktop.png) | [Color](order-2-previews/dunnio-life-page-dunnio-tailor-desktop-popover.png) | [Preview](order-2-previews/dunnio-life-page-dunnio-tailor-mobile.png) | [Panel](order-2-previews/dunnio-life-page-dunnio-tailor-mobile-filters.png) |

No physical touchscreen, Safari or Firefox validation was performed. Existing external commerce/newsletter/fullscreen boundaries remain as documented in the project README.
