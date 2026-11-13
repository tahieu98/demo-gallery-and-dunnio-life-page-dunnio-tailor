# Combined site — 13 November 2026

## Completed

- Consolidated Gallery and Life into two sibling collection folders inside this repository, each with `original/` and `improved/`.
- Preserved all 78 photo records and shared collection assets; no nested Git repository or dependency on another checkout.
- Verified every internal HTML/CSS asset path, English language, native image orientation, unique filenames and photo IDs.
- Verified navigation from the hub to both proposals and both original references at a simulated project URL prefix.
- Verified navigation between Gallery and Life, the 28/50 photo totals, search for `pink shirt` returning two Life photos, and the image viewer.
- Added noindex directives to all HTML pages, crawler policy and local X-Robots-Tag response headers.
- Retired homepage: Pages API returns 404, `has_pages: false`; Actions explicitly set to disabled and verified.

## Renamed repository and publication

The owner renamed the repository to `demo-gallery-and-dunnio-life-page-dunnio-tailor` and made it public. The Git remote, online preview links, local project mount and 404 return link now use that name. Pages uses `main` at `/` with static branch publishing. Public source remains accessible independently of the website noindex directives.

## Crawling limits

`noindex` prevents indexing by compliant crawlers. `robots.txt` requests no crawling but project-site robots files are not the domain-root crawler policy. GitHub Pages has no custom headers or password protection on this plan. Strict bot exclusion requires hosting with authentication/access control. Never interpret these directives as an access barrier.

Official references:

- https://docs.github.com/en/pages/getting-started-with-github-pages/about-github-pages
- https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site
- https://developers.google.com/search/docs/crawling-indexing/block-indexing
