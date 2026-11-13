# Order 4 — Mobile filter option rows

Date: 14 November 2026 (Asia/Bangkok).

Apply to both improved collection pages, within the mobile Filter dialog (up to 700px). Each Outfit, Color, Occasion and Situation option area shows at most three complete rows of chips. Only groups with a fourth row get their own vertical scroll area and thin scrollbar; shorter groups remain naturally sized. Keep the group title above its options and leave the modal's Apply/Cancel actions in their existing footer.

Measure actual flex rows rather than assuming a fixed pixel height. Recalculate after rendering, checkbox selection (the check mark affects wrapping), font loading, resize and option-content changes. Measure after reserving scrollbar space, preserve the group's current scroll position and allow keyboard focus/scroll inside overflowing groups. Clear all/reopening rebuilds and remeasures the groups. Desktop popovers keep their existing whole-panel scrolling.

Implementation: shared/gallery-app.js and shared/gallery.css; both improved HTML pages use Order 4 version queries for the changed assets. No photo/tag/catalog changes. Browser verification lives in scripts/browser-order-4.mjs and exercises actual late-option selection, draft/Apply behavior, 320/390/440/700px, future four-row groups, shorter groups and desktop behavior.

## Verification

- Before implementation, the new browser check failed because Outfit had no independent scrolling. After implementation, `npm run test:mobile-filters` passes on both collections.
- At 440px, Gallery Outfit has 10 natural rows and shows 3; Color has 3 and does not scroll; Occasion has 2 and Situation 1. Life Outfit has 20 natural rows and shows 3; Color has 4 and shows 3; Occasion/Situation remain naturally sized.
- Tested widths 320, 390, 440 and 700px; simulated future four-row data in every field, then reduced each to three and two rows. Exact three-row caps and short-group behavior pass.
- Selecting an outfit near the bottom scrolls its own group without moving the outer dialog; selections stay pending until Apply. Reopening keeps the selected option, and Clear all returns all rebuilt groups to their first option.
- Existing Node tests: 7 pass. Full Order 2 browser regression passes on both pages, including mobile keyboard/modal handling and desktop popovers. Asset/link/noindex verification passes.
- Independent review confirmed no observer loops, preserved scroll after selection and keyboard access to late options. No actionable findings remained.
- Visually inspected [Style Gallery](order-4-previews/gallery-page-dunnio-tailor-mobile.png) and [Dunnio Life](order-4-previews/dunnio-life-page-dunnio-tailor-mobile.png). [Browser summary](order-4-previews/results.json).
