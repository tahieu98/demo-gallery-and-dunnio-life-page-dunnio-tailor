# Order 5 - Verification

Date: 15 November 2026 (Asia/Bangkok).

## Local result

- Both Craftmanship versions pass browser checks at widths 320, 375, 390, 600, 768, 1024, 1440 and 1920px. No document overflow, missing local image/font/script requests or JavaScript runtime errors were recorded.
- Original: all three local profile dialogs, desktop/mobile menu, mobile footer disclosure and local email validation pass. Existing live account, checkout, social and contact links remain destinations on the source website; no production form was submitted.
- Proposed: eight timeline panels, ArrowLeft/ArrowRight/Home/End navigation, chapter anchors/active state, three full-profile dialogs, Escape, focus return, mobile menu, three native pillar disclosures, local newsletter status and reduced-motion behavior pass.
- JavaScript-disabled fallback exposes all eight timeline entries plus direct links to three profiles. Direct `file://` opening loads the proposed page and its local profile dialog without a fetch server.
- Existing seven Node tests pass. The Order 2 browser regression and Order 4 mobile-filter regression pass on Gallery and Life, with their original 28/50 image totals.
- `npm run verify` passes local HTML references, image inventory and noindex checks. The checker now accepts either HTML attribute order for the robots meta tag; the policy itself is unchanged.
- Desktop/mobile full-page and viewport screenshots were visually reviewed. An intrinsic image-height issue was corrected before the final captures. Final images have stable proportions; no overlap or clipped main copy was observed.

Evidence: [machine-readable browser results](order-5-previews/results.json), [original desktop](order-5-previews/original-1440.png), [proposed desktop](order-5-previews/proposed-1440.png), [original mobile](order-5-previews/original-390.png), [proposed mobile](order-5-previews/proposed-390.png).

Run from the repository:

```powershell
$env:PORT='4195'
npm start
# In another terminal, from this repository:
npm run test:craftmanship
npm run verify
npm test
```

The pages are plain HTML/CSS/JavaScript and can also be opened directly; the server is a convenience for preview and automated validation. Override `DUNNIO_TEST_URL` for a different local port or published URL, and `DUNNIO_TEST_OUTPUT` to keep online checks in local audit storage.

## Limits

The site is a design demo. Real order submission, translation service availability, account sessions, subscriptions and checkout are outside the static implementation. Newsletter validation is explicitly local. No physical touchscreen device test was performed. Facebook content was not readable without login; only the provided public profile destination is used. Strategic capabilities are described as direction/ongoing development, rather than a validated production-service promise.

Publication is checked separately after pushing `main`; the local audit's `order-5/publication.json` records the deployment commit, status and byte/hash comparison against published files.
