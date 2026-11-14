# craftmanship-page-dunnio-tailor-proposed

Proposed brand storytelling design, 15 November 2026 (Asia/Bangkok).

Open `index.html` directly, or run `npm start` from the parent repository. The page connects the 2009 Veston Duy Nguyễn origin, the 2019 Dunnio debut, founder Nguyễn Duy Đạt (Duy Nguyễn), real craftspeople and the Production / Technology / Platform direction.

`index.html` owns the editorial content and semantic sections. `style.css` owns responsive layout and tokens. `app.js` owns keyboard-accessible timeline tabs, chapter highlighting, native dialogs and local newsletter validation. Native `details` elements provide the three pillar disclosures. Assets, Inter font, Lucide 0.468.0 and shared profile prose live in the sibling `craftmanship-page-dunnio-tailor-assets/` directory.

JavaScript-disabled readers can read all timeline panels and follow direct profile links. Main content is static HTML. No build or install is necessary. Browser checks: `npm run test:craftmanship` from the repo root. The test defaults to port 4195; override `DUNNIO_TEST_URL` for any local or published base URL.

See [design and source decisions](../docs/order-5-design.md) and [verification](../docs/order-5-verification.md). The requested directory spelling is `craftmanship`; visible copy uses `Craftsmanship`.
