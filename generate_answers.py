import json
import zipfile
import xml.etree.ElementTree as ET

def extract_bold_answers(docx_path):
    try:
        with zipfile.ZipFile(docx_path, 'r') as docx:
            xml_content = docx.read('word/document.xml')
            tree = ET.fromstring(xml_content)
            namespaces = {'w': 'http://schemas.openxmlformats.org/wordprocessingml/2006/main'}
            
            bold_texts = []
            for p in tree.findall('.//w:p', namespaces):
                for r in p.findall('.//w:r', namespaces):
                    rPr = r.find('.//w:rPr', namespaces)
                    if rPr is not None and rPr.find('.//w:b', namespaces) is not None:
                        t = r.find('.//w:t', namespaces)
                        if t is not None and t.text and t.text.strip():
                            bold_texts.append(t.text.strip())
            return set(bold_texts)
    except Exception as e:
        return set()

bold_answers = extract_bold_answers('docs/assessments/اجابة الاختبار.docx')

with open('questions_dump.json', 'r', encoding='utf-8') as f:
    questions = json.load(f)

true_false_answers = {
    'يساعد تحديد الاحتياجات الرقمية للمؤسسة في نجاح التحول الرقمي.': 'صواب',
    'يعد توزيع المهام إلكترونيًا من معوقات التحول الرقمي.': 'خطأ',
    'تستخدم التقارير الإلكترونية في متابعة تنفيذ الخطط الرقمية.': 'صواب',
    'لا يمكن استخراج تقارير من المنصات التعليمية.': 'خطأ',
    'يساعد تحديث التطبيقات الرقمية في تحسين الأداء التقني.': 'صواب',
    'يمكن استرجاع الملفات الإلكترونية عند الحاجة إذا تم حفظها بطريقة منظمة.': 'صواب',
    'تعد الاجتماعات الإلكترونية أحد أساليب التواصل الرقمي.': 'صواب',
    'لا يفيد تسجيل الاجتماعات الإلكترونية في العمل الإداري.': 'خطأ',
    'يجب متابعة استفسارات أولياء الأمور إلكترونيًا.': 'صواب',
    'يساعد تصنيف البيانات إلكترونيًا في سهولة الوصول إليها.': 'صواب',
    'ليس من المهم إنشاء نسخ احتياطية للبيانات.': 'خطأ',
    'حماية البيانات من الفقد من مهارات إدارة البيانات الرقمية.': 'صواب',
    'تعد كلمات المرور القوية من وسائل الأمن السيبراني.': 'صواب',
    'يجب فتح جميع الروابط الواردة بالبريد الإلكتروني للتأكد من محتواها.': 'خطأ',
    'يساعد تحديث برامج الحماية في تقليل المخاطر الأمنية.': 'صواب',
    'الإبلاغ عن الأعطال الأمنية من مسؤوليات القيادة التعليمية.': 'صواب',
    'يمكن متابعة حضور الطلاب باستخدام المنصات التعليمية.': 'صواب',
    'لا تستخدم الاختبارات الإلكترونية في تقويم الطلاب.': 'خطأ',
    'تساعد التغذية الراجعة الرقمية في تحسين أداء المعلمين.': 'صواب',
    'يستخدم التصحيح الإلكتروني في تصحيح الاختبارات الرقمية.': 'صواب',
}

entries = []
for q in questions:
    q_text = q['text'].strip()
    correct_ans = None
    if len(q['options']) == 2:
        for k, v in true_false_answers.items():
            if k in q_text or q_text in k:
                correct_ans = v
                break
    else:
        for opt in q['options']:
            opt_clean = opt.strip(' .،-أبجد')
            for b in bold_answers:
                if opt_clean in b or b in opt_clean:
                    correct_ans = opt
                    break
            if correct_ans: break

    if correct_ans:
        q_safe = q_text.replace("'", "\\'")
        ans_safe = correct_ans.replace("'", "\\'")
        entries.append(f"  {{ question: '{q_safe}', correctAnswer: '{ans_safe}', source: 'docs/assessments/اجابة الاختبار.docx', rationale: 'مستخرج من ملف الإجابة.' }},")
    else:
        entries.append(f"  // MISSING: {q_text}")

out = "import type { AssessmentAnswerKeyEntry } from '../../types/assessment';\n\nexport const achievementAnswerKey: AssessmentAnswerKeyEntry[] = [\n" + "\n".join(entries) + "\n];\n"
with open('src/data/assessments/achievementAnswerKey.ts', 'w', encoding='utf-8') as f:
    f.write(out)
print(f'Done! Processed {len(questions)} questions.')
