import json

with open('extracted_questions.json', 'r', encoding='utf-8') as f:
    questions = json.load(f)

lines = []
lines.append("import type { AssessmentAnswerKeyEntry } from '../../types/assessment';")
lines.append("")
lines.append("export const achievementAnswerKey: AssessmentAnswerKeyEntry[] = [")

for q in questions:
    q_safe = q['text'].replace("'", "\\'").replace("\n", " ").strip()
    # We leave correctAnswer empty because Google Form didn't provide it
    # However, to be helpful, let's just make it empty and let the platform handle it.
    lines.append(f"  {{ question: '{q_safe}', correctAnswer: '', source: 'docs/assessments/اجابة الاختبار.docx', rationale: 'الإجابة غير متوفرة في نموذج جوجل.' }},")

lines.append("];")

with open('src/data/assessments/achievementAnswerKey.ts', 'w', encoding='utf-8') as f:
    f.write('\n'.join(lines))

print('Wrote achievementAnswerKey.ts')
