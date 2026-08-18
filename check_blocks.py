import json
with open('generated/content/الاختبار-التحصيلي.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

blocks = data['sections'][0]['blocks']
for b in blocks[:15]:
    btype = b.get('type')
    bid = b.get('id')
    content = b.get('content', b.get('src', ''))[:60]
    print(f'[{btype}] id={bid} => {content}')
