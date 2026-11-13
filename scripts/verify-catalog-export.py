"""Check the deliverable workbook directly against the final UTF-8 CSV."""
import csv
from pathlib import Path
from zipfile import ZipFile
from xml.etree import ElementTree as ET
ROOT=Path(__file__).resolve().parent.parent
NS={'s':'http://schemas.openxmlformats.org/spreadsheetml/2006/main'}
with (ROOT/'docs/dunnio-image-catalog.csv').open(encoding='utf-8-sig',newline='') as file:
    rows=list(csv.reader(file))
assert len(rows)==79 and len(rows[0])==22
with ZipFile(ROOT/'outputs/order-2/dunnio-image-catalog.xlsx') as zip:
    strings=[]
    if 'xl/sharedStrings.xml' in zip.namelist():
        strings=[''.join(node.itertext()) for node in ET.fromstring(zip.read('xl/sharedStrings.xml')).findall('s:si',NS)]
    xml=ET.fromstring(zip.read('xl/worksheets/sheet1.xml'))
    actual=[]
    for row in xml.findall('s:sheetData/s:row',NS):
        values=[]
        for cell in row.findall('s:c',NS):
            ref=cell.attrib['r']; col=''.join(filter(str.isalpha,ref)); index=0
            for letter in col:index=index*26+ord(letter)-64
            while len(values)<index:values.append('')
            value=cell.findtext('s:v',default='',namespaces=NS)
            if cell.get('t')=='s':value=strings[int(value)]
            if cell.get('t')=='inlineStr':value=''.join(cell.find('s:is',NS).itertext())
            values[index-1]=value
        values+=['']*(22-len(values))
        actual.append(values)
    assert len(actual)==79
    assert actual[1:]==rows[1:], 'XLSX values differ from catalog CSV'
    assert 'xl/tables/table1.xml' in zip.namelist()
    assert xml.find('s:sheetViews/s:sheetView/s:pane',NS) is not None
print('PASS: XLSX contains the same 78 records and 22 columns as CSV, with table and frozen panes.')
