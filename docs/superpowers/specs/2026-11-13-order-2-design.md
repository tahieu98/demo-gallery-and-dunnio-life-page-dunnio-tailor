# Order 2 — Style Gallery and Dunnio Life

## Intent and scope
Implement the user's Order 2 in the current combined repository. Keep the existing brand and English interface. Work in the clean existing checkout; the standalone Life repository is historical. Preserve original HTML/CSS and photo IDs.

## Decisions
- User explicitly selected **four separate desktop/tablet buttons**: Outfit, Color, Occasion, Situation, followed by Saved, on one row.
- Each desktop button opens its own multi-select popover, with Clear, Cancel and Apply. Mobile (up to 700px) has one fixed right-edge Filter button at mid-screen opening a native modal with four groups, Saved, Clear and Apply.
- Draft selections do not affect results until Apply. Cancel, Escape, outside click discard the draft. Native dialogs trap focus and return it to their opener. Selection is OR within a field, AND across fields and Saved.
- Remove photo search, orientation, sorting and result bar. Announce counts with a visually hidden status. Active counts live in the filter buttons; clearing is available inside the panels.
- Collections use the source-order shortest-column masonry and original thumbnail crops/dimensions: 7 columns above 1199px, 5 through 1199px, 3 through 991px, 2 through 575px. No color/orientation groups. All matching photos are available; the viewer uses full images in displayed source order.
- Keep caption metadata available without changing tile heights: show outfit and tags in an overlay on hover/focus; mobile offers the same details in the viewer. Save buttons remain usable.
- Visually review all 78 photos. English outfit titles and filenames describe the primary garment; distinguish secondary outfits in group photos. Keep original filenames/source URLs and stable IDs. Occasion is a curated suitable-use tag, not proof of the photographed event; Situation describes visible indoor/outdoor context. Record uncertainty and avoid claiming an unseen waistcoat.
- Update runtime JS, JSON manifests, per-collection CSV and one combined CSV/XLSX together. Keep rename mappings for old asset links. Original pages keep the same visual composition and source order after asset-path updates.

## Approaches
1. Extend each existing grouped gallery independently: fewer new files, but duplicates filter behavior and retains group-specific rendering. Rejected because the requested layout removes groups in both pages.
2. Shared vanilla JavaScript filtering and presentation, collection-specific data and page copy: selected implementation approach. Keeps static hosting/file URLs and gives both pages identical behavior without adding a framework.
3. Introduce a UI framework/backend: unnecessary for 78 static photos and changes the deployment model.

## Verification
Use Node behavior tests for combined facets, URL normalization, Saved and original-order filtering. Validate complete metadata, real renamed files, original thumbnail dimensions and CSV/JSON/runtime alignment. Browser checks on both collections: desktop/tablet one-row buttons, closed color options, apply/cancel/reset, mobile fixed trigger/modal, keyboard and focus, empty results, saved persistence, reload/deep links, viewer, original masonry at responsive boundaries and no overflow. Record real results in docs/order-2-verification.md. Publication is separate from local implementation.
