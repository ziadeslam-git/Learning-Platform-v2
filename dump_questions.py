import json
import re

with open('questions_dump.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

items = data[1][1]
print(f'Total items in form: {len(items)}')

out_questions = []

for item in items:
    q_type = item[3]
    if q_type == 2:
        q_text = item[1].strip()
        choices = [c[0].strip() for c in item[4][0][1] if c and len(c)>0 and c[0] != '']
        out_questions.append({
            'text': q_text,
            'choices': choices
        })

with open('extracted_questions.json', 'w', encoding='utf-8') as f:
    json.dump(out_questions, f, ensure_ascii=False, indent=2)
