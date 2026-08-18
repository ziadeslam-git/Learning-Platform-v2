import json

with open('extracted_questions.json', 'r', encoding='utf-8') as f:
    questions = json.load(f)

blocks = []
block_id = 1

intro = ['تعليمات الاختبار', 'اقرأ التعليمات جيدا قبل أن تبدأ الاختبار:', 'أولا: أسئلة الاختبار التحصيلي:']
for text in intro:
    blocks.append({
        'id': 'paragraph_' + str(block_id),
        'type': 'ParagraphBlock',
        'content': text
    })
    block_id += 1

markers = ['أ-', 'ب-', 'ج-', 'د-', 'هـ-']

for i, q in enumerate(questions):
    # Question text block
    blocks.append({
        'id': 'paragraph_' + str(block_id),
        'type': 'ParagraphBlock',
        'content': q['text']
    })
    block_id += 1

    # Image block - must include content: '' for TypeScript BaseBlock compatibility
    blocks.append({
        'id': 'image_' + str(block_id),
        'type': 'ImageBlock',
        'content': '',
        'src': '/assets/exam/q' + str(i + 1) + '.png'
    })
    block_id += 1

    # Choice marker + choice text
    for idx, choice in enumerate(q['choices']):
        blocks.append({
            'id': 'paragraph_' + str(block_id),
            'type': 'ParagraphBlock',
            'content': markers[idx]
        })
        block_id += 1
        blocks.append({
            'id': 'paragraph_' + str(block_id),
            'type': 'ParagraphBlock',
            'content': choice
        })
        block_id += 1

out_json = {
    'id': 'الاختبار-التحصيلي',
    'title': 'الاختبار التحصيلي',
    'type': 'assessment',
    'language': 'ar',
    'sections': [
        {
            'id': 'section_1',
            'title': 'Main Section',
            'blocks': blocks
        }
    ]
}

with open('generated/content/الاختبار-التحصيلي.json', 'w', encoding='utf-8') as f:
    json.dump(out_json, f, ensure_ascii=False, indent=2)

print('Updated: ' + str(len(questions)) + ' questions, ' + str(len(blocks)) + ' blocks')
print('Each question: 1 text + 1 image + 8 choice blocks = 10 blocks')
print('Expected: 3 intro + 60*10 = 603 blocks, got: ' + str(len(blocks)))
