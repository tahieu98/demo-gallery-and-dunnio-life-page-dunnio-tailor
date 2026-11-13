# Dunnio Tailor — Gallery & Life design demos

One static HTML/CSS/JavaScript site containing the original reference and proposed design for both collections. All demo interfaces use English.

## Online preview

Publishing target: [Combined design comparison](https://tahieu98.github.io/demo-gallery-page-dunnio-tailor/). Available after Pages is enabled and deployment completes.

| Collection | Original reference | Proposed design |
| --- | --- | --- |
| Style Gallery · 28 photos | [Open reference](https://tahieu98.github.io/demo-gallery-page-dunnio-tailor/gallery-page-dunnio-tailor/original/) | [Open proposal](https://tahieu98.github.io/demo-gallery-page-dunnio-tailor/gallery-page-dunnio-tailor/improved/) |
| Dunnio Life · 50 photos | [Open reference](https://tahieu98.github.io/demo-gallery-page-dunnio-tailor/dunnio-life-page-dunnio-tailor/original/) | [Open proposal](https://tahieu98.github.io/demo-gallery-page-dunnio-tailor/dunnio-life-page-dunnio-tailor/improved/) |

`127.0.0.1` URLs work only while a server runs on the same device. A GitHub repository file view does not serve the website.

## Local preview

Run `npm start` or double-click `start-local.cmd`. No installation is needed. Open the printed URL. Set `PORT` if 4173 is in use. Run `npm run verify` to check assets, all 78 photos, inter-collection links and crawler directives.

## Structure

```text
index.html                          # Four-page comparison hub
robots.txt                          # Crawler policy
gallery-page-dunnio-tailor/
  original/ improved/ assets/ docs/
dunnio-life-page-dunnio-tailor/
  original/ improved/ assets/ docs/
scripts/                            # Local server and verification
```

Versions share assets within each collection. The combined site does not require the separate Life checkout. Provenance and design notes are retained in each collection's `docs/` folder.

## Publishing and crawler controls

Publish `main` → `/ (root)` using Pages branch publishing. `.nojekyll` keeps this static. There are no custom workflow dependencies. GitHub's built-in Pages deployment can appear in Actions; do not disable Actions while using Pages.

Every HTML page contains `noindex, nofollow, noarchive, nosnippet, noimageindex`. The local server also sends `X-Robots-Tag`. `robots.txt` disallows all crawlers and explicitly names common search and AI agents.

GitHub Pages does not support custom response headers. Crawlers normally read the domain's `/robots.txt`, rather than the file in a project subdirectory. HTML `noindex` therefore remains the indexing control on this project Pages site. These voluntary directives are not authentication or a guarantee that every bot is blocked. Use access-controlled hosting for strict exclusion.

GitHub Free Pages requires a public repository. Keeping it private requires an eligible plan or another host. Visibility changes require owner approval.

The retired homepage is not a publishing source. Its Pages and Actions stay disabled. The former standalone Life repository is retained for history.

## Demo boundaries

Original versions preserve source DOM/CSS, image order, thumbnail crops and masonry, with independent JavaScript for local interactions. Proposals group photos by the main subject's outfit color, then portrait/landscape/square. Wedding photos prioritize the groom. Search, filters, saved photos and the viewer work locally and online. Newsletter submission only validates input; live checkout, login and contact destinations open the source website.

Images, fonts, logo and reference styling originate from [Dunnio Tailor](https://dunniotailor.com/). These demos support design review.
