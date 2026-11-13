# Order 3 — Desktop hero refinement

The user's specification applies to the improved Style Gallery and Dunnio Life pages on PC. Use the existing desktop boundary above 1000px: hero padding is 10px top and bottom, text/photo columns have a 1:3 ratio, the vertical divider and photo-area left padding are removed, and a third existing collection photo appears.

Shared CSS in `shared/hero.css` implements the two-page change without altering the original versions. The title scales to 44–64px to fit the narrower text column. Intro copy wraps inside that column; metadata can wrap without overflowing. Keep the existing editorial photo treatment, with the middle image shorter than the first and third. At tablet widths the first two photos retain the prior layout; mobile retains its existing text-only hero.

Additional photos: Gallery 013 (Olive Casual Suit), Life 024 (Ivory Two-Piece Suit). They are existing local assets, with their intrinsic dimensions and descriptive English alt text. Load the new stylesheet after the existing shared gallery styles. Use a version query on this new stylesheet so this release is unambiguous in browser caches.

Verify both pages at 1024, 1280, 1440 and 1920px for exact padding, 1:3 widths, three rendered photos and no overflow. Compare tablet/mobile layout and check filtering/image display. Publish to the existing `main` branch and verify deployed HTML/CSS and page behavior.

## Local verification — 13 November 2026

- Both pages pass all four desktop widths: computed top/bottom padding is 10px, photo/text width ratio is 3, divider width is 0 and all three photos are visible. No text or document overflow.
- Hero height is 278px at 1280–1920px, versus the previous 310px. At 1024px the height is 278–279px.
- Tablet 768/1000px retains two photos; mobile 390px retains the text-only hero and prior 4px top padding.
- Existing 28/50-photo collections and mobile Black filter (6/7 results) pass without page or asset errors. All seven Node tests and the repository asset/link verifier pass.
- Visually inspected both desktop pages. The middle photo uses top alignment to keep faces visible in the wider image area.
