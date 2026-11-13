"""Rebuild Order 2 catalog exports from visually reviewed annotations (idempotent)."""
import csv
import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
ANNOTATIONS = json.loads((ROOT / 'scripts/order-2-classification.json').read_text(encoding='utf-8'))
FIELDS = ['collection', 'id', 'order', 'outfitLabel', 'outfitType', 'colorLabel', 'occasions', 'situation',
          'secondaryOutfits', 'subject', 'reviewNote', 'occasionBasis', 'filename', 'previousFilename',
          'originalName', 'width', 'height', 'thumbnailWidth', 'thumbnailHeight', 'source', 'thumbnailSource', 'alt']

def write_csv(path, rows):
    with path.open('w', encoding='utf-8-sig', newline='') as output:
        writer = csv.DictWriter(output, fieldnames=FIELDS)
        writer.writeheader()
        writer.writerows({key: '; '.join(row[key]) if isinstance(row[key], list) else row.get(key, '') for key in FIELDS} for row in rows)

all_rows, renames = [], []
for collection, folder in [('gallery', 'gallery-page-dunnio-tailor'), ('dunnio-life', 'dunnio-life-page-dunnio-tailor')]:
    base = ROOT / folder
    rows = json.loads((base / 'docs/image-manifest.json').read_text(encoding='utf-8'))
    annotations = ANNOTATIONS[collection]
    assert len(rows) == len(annotations)
    replacements = {}
    for row, annotation in zip(rows, annotations):
        title, kind, occasions, situation, secondary, note = annotation
        old = row['filename']
        row.setdefault('previousFilename', old)
        if collection == 'gallery' and row['order'] == 14:
            row['subject'] = 'Two gentlemen outdoors'
        slug = re.sub(r'[^a-z0-9]+', '-', title.lower()).strip('-')
        filename = f'{collection}-outfit-{slug}-{row["order"]:03d}.webp'
        source, destination = base / 'assets/images' / old, base / 'assets/images' / filename
        if source != destination:
            assert source.exists() and not destination.exists(), f'Unsafe rename: {source}'
            source.rename(destination)
            replacements[old] = filename
        row.update(collection=collection, outfit=slug, outfitLabel=title, outfitType=kind,
                   occasions=occasions, situation=situation, secondaryOutfits=secondary,
                   reviewNote=note, occasionBasis='editorial-suggested-use', filename=filename,
                   src=f'assets/images/{filename}', title=title,
                   alt=f'{title} — {row["subject"]}. {situation.capitalize()} setting.' + (f' Also visible: {secondary}.' if secondary else ''))
        if collection == 'gallery' and row['order'] == 2:
            row.update(color='navy', colorLabel='Navy', colorHex='#263a53')
        if collection == 'gallery' and row['order'] == 17:
            row.update(color='gray', colorLabel='Gray', colorHex='#94999c')
        row['classificationMethod'] = 'visual-review-primary-outfit-2026-11-13'
        row['classificationNote'] = 'Primary outfit visually reviewed. Occasion tags are suggested uses, not verified events. ' + note
        renames.append({'id':row['id'], 'previousFilename':row['previousFilename'], 'filename':filename})
    # Update references while leaving source DOM, styling and original image order intact.
    for file in [*base.glob('original/*.html'), *base.glob('improved/*.html')]:
        content = file.read_text(encoding='utf-8')
        for old, new in replacements.items():
            content = content.replace(old, new)
        file.write_text(content, encoding='utf-8')
    (base / 'docs/image-manifest.json').write_text(json.dumps(rows, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
    runtime = [{**row, 'src':'../' + row['src'], 'thumbnail':'../' + row['thumbnail']} for row in rows]
    (base / 'assets/image-data.js').write_text(f'window.DUNNIO_PAGE={json.dumps(collection)};\nwindow.DUNNIO_IMAGES=' + json.dumps(runtime, ensure_ascii=False, indent=2) + ';\n', encoding='utf-8')
    write_csv(base / 'docs/image-catalog.csv', rows)
    all_rows.extend(rows)

(ROOT / 'docs').mkdir(exist_ok=True)
write_csv(ROOT / 'docs/dunnio-image-catalog.csv', all_rows)
(ROOT / 'docs/image-renames.json').write_text(json.dumps(renames, indent=2) + '\n', encoding='utf-8')
print(f'Updated {len(all_rows)} photos, runtime datasets, manifests, CSVs and rename map.')
