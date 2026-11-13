from pathlib import Path
ROOT = Path(__file__).resolve().parent.parent
for folder in ['gallery-page-dunnio-tailor','dunnio-life-page-dunnio-tailor']:
    file=ROOT/folder/'assets/lightbox.js'
    text=file.read_text(encoding='utf-8')
    old="$('.viewer-caption').textContent = `${item.subject} · ${item.colorLabel} · ${item.orientationLabel} · ${item.width} × ${item.height} px`;"
    new="""const occasionNames = {'wedding':'Wedding','business':'Business','formal-event':'Formal event','smart-casual':'Smart casual'};
    const details = item.outfitLabel ? `${item.outfitLabel} · ${item.colorLabel} · ${item.occasions.map(value => occasionNames[value]).join(', ')} · ${item.situation === 'indoor' ? 'Indoor' : 'Outdoor'}` : `${item.subject} · ${item.colorLabel}`;
    $('.viewer-caption').textContent = details + (item.secondaryOutfits ? ` · Also visible: ${item.secondaryOutfits}` : '') + ` · ${item.width} × ${item.height} px`;"""
    if old in text:
        file.write_text(text.replace(old,new),encoding='utf-8')
print('Viewer captions now include outfit, color, occasion, situation and secondary outfits.')
