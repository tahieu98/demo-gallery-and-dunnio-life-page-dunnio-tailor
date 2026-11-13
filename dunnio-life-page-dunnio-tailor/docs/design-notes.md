# Design notes — Order 2, 13 November 2026

The current proposal follows the user's Order 2. This supersedes the earlier color/orientation grouping design.

## Collection layout
Keep original photo order and thumbnail crops. Use shortest-column masonry with 7 columns above 1199px, 5 through 1199px, 3 through 991px and 2 through 575px. Filtering removes unmatched tiles without color/orientation sections. The full-image viewer follows the filtered source order.

## Filters
Desktop/tablet: Outfit, Color, Occasion and Situation are four separate buttons on one row with Saved, per the user's clarification. Each button opens a multi-select popover with Clear, Cancel and Apply. Mobile up to 700px uses one fixed right-edge Filter button at mid-screen; its modal contains four groups, Saved, Clear all and Apply. Cancel, Escape and outside dismissal discard drafts. OR within fields, AND across fields. Search, orientation, sorting and the result bar are removed. Result announcements remain visually hidden for screen readers.

Keep the brand's Afacad/Garamond fonts, ivory background and dark ink. Provide visible focus, 44px touch controls, modal focus handling and reduced-motion support. Labels and all interface copy remain English. Outfit/context overlays do not change masonry tile heights; mobile reads full metadata in the viewer.

## Catalog
The primary visible outfit determines the English name and color. Wedding pictures prioritize the groom; group photos record secondary outfits separately. Occasion is an editorial suitable-use suggestion (Wedding, Business, Formal event, Smart casual), not evidence of the photographed event. Situation is the visibly photographed Indoor/Outdoor context. Do not infer an unseen waistcoat or exact lapel fabric; use review notes for small/ambiguous images.

Names follow `{collection}-outfit-{english-outfit-slug}-{source-order}.webp`; photo IDs, original names, provenance URLs and thumbnail dimensions remain stable. Old filenames are retained in the catalog and combined rename map. Runtime scripts use paths relative to the page; JSON manifests use paths relative to the collection root.

## Maintenance
Edit `scripts/order-2-classification.json` in the combined repository, then run `python scripts/update-catalog.py` to synchronize runtime JS, JSON and CSV. Regenerate XLSX and run `python scripts/verify-catalog-export.py` after data changes. Shared filter behavior lives in `shared/`; each collection retains its own content and assets.

See [current verification](../../docs/order-2-verification.md) and [combined project README](../../README.md). Historical verification remains in this folder. Source provenance is in `source-repository.md`. The standalone Life checkout outside the combined repository is not the editing/publishing source.
