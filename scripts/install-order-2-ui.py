"""Apply the shared toolbar markup to both collection pages."""
import re
from pathlib import Path
ROOT = Path(__file__).resolve().parent.parent
fields = ['outfit','color','occasion','situation']
def footer():
    return '<footer class="filter-footer"><p class="filter-preview" role="status" aria-live="polite"></p><div class="filter-actions"><button class="cancel-filters" type="button">Cancel</button><button class="apply-filters" type="button">Apply</button></div></footer>'
toolbar = '<section aria-label="Filter collection" class="collection-toolbar"><div class="filter-row">'
for field in fields:
    toolbar += f'<button class="filter-trigger" data-field="{field}" type="button" popovertarget="filter-{field}" aria-controls="filter-{field}" aria-expanded="false"><span>{field.title()}</span><span class="filter-count"></span></button>'
toolbar += '<button class="save-filter" type="button" aria-pressed="false">♡ Saved (0)</button></div></section>'
toolbar += '<p id="collection-status" class="sr-only" role="status" aria-live="polite"></p><div id="collections" class="gallery-page-list" aria-label="Photo collection"></div>'
panels = ''
for field in fields:
    panels += f'<div id="filter-{field}" class="filter-panel filter-popover" data-field="{field}" popover="auto" role="dialog" aria-labelledby="title-{field}"><div class="filter-heading"><h2 id="title-{field}">{field.title()}</h2><button class="clear-filters" type="button">Clear</button></div><div class="filter-body"></div>{footer()}</div>'
panels += '<button class="mobile-filter" type="button" aria-haspopup="dialog" aria-controls="mobile-filters" aria-expanded="false"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" aria-hidden="true"><path d="M3 5h18l-7 8v6l-4 2v-8z"/></svg><span>Filter</span></button>'
panels += f'<dialog id="mobile-filters" class="filter-panel filter-dialog" aria-labelledby="mobile-filter-title"><div class="filter-heading"><h2 id="mobile-filter-title">Filter photos</h2><button class="clear-filters" type="button">Clear all</button><button class="filter-close" type="button" aria-label="Close filters">×</button></div><div class="filter-body"></div>{footer()}</dialog>'
for folder in ['gallery-page-dunnio-tailor','dunnio-life-page-dunnio-tailor']:
    base=ROOT/folder/'improved'
    file=base/'index.html'
    html=file.read_text(encoding='utf-8')
    html=re.sub(r'<section aria-label="Filter collection".*?<div id="collections"></div>',toolbar,html,flags=re.S)
    html=html.replace('Try another color or choose a different orientation.','Try another outfit, color, occasion or situation.')
    html=html.replace('by outfit color and image orientation','by outfit, color, occasion and situation')
    if '../../shared/gallery.css' not in html:
        html=html.replace('</head>','<link href="../../shared/gallery.css" rel="stylesheet"/></head>')
        html=html.replace('<script src="../assets/image-data.js">',panels+'\n<script src="../assets/image-data.js">')
        html=html.replace('<script src="app.js">','<script src="../../shared/gallery-filters.js"></script><script src="../../shared/gallery-app.js"></script><script src="app.js">')
    file.write_text(html,encoding='utf-8')
    (base/'app.js').write_text("window.DunnioGallery.mount();\n",encoding='utf-8')
print('Installed Order 2 shared filters on both improved pages.')
