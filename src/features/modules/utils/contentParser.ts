import type { ModuleModel } from '../../../../types/module';

export interface ParsedModule {
  id: string;
  title: string;
  subtitle: string;
  generalObjective: string;
  lessons: ParsedLesson[];
}

export interface ParsedLesson {
  id: string;
  title: string;
  objectives: string[];
  elements: ParsedElement[];
  activities: string[];
  assessments: ParsedAssessment[];
  summary: string | null;
  summaryImage?: string;
}

export interface ParsedElement {
  id: string;
  title: string;
  badgeNumber: number;
  subConcepts: ParsedSubConcept[];
}

export type ParsedSubConcept = 
  | { type: 'definition'; title: string; text: string }
  | { type: 'list'; title: string; items: string[] }
  | { type: 'media'; title: string; url: string; mediaType: 'video' | 'link' | 'image' }
  | { type: 'text'; title: string; text: string };

export interface ParsedAssessment {
  id: string;
  type: 'mcq' | 'tf' | 'task';
  text: string;
  options?: string[]; // For mcq
  correctAnswer?: string;
}

const sectionBoundaryPattern = /^(الدرس|العنصر|الأهداف التعليمية|عرض المحتوى|الأنشطة|نشاط|التقويم|ملخص|الخلاصة)/;
const listHeadingPattern = /^(أهمية|مجالات|مكونات|خطوات|فوائد|أدوات|خصائص|مهارات|أساليب|متطلبات|إجراءات|مبادئ|أنواع|معايير|قواعد|توظيف|دور|مخاطر)/;
const mediaTitleCleanPattern = /^المصدر\s*:\s*/;

/**
 * Static answer key for lesson quizzes derived from scientific content analysis.
 * Keys are normalized question text (trimmed). Values are the correct answer text.
 */
const LESSON_QUIZ_ANSWER_KEY: Record<string, string> = {
  // Module 1 - Lesson 1
  'يقصد بالقيادة الرقمية': 'استخدام التكنولوجيا في العمل الإداري',
  'من مراحل التخطيط الرقمي:': 'التنفيذ',
  'تساعد التقارير الرقمية في دعم اتخاذ القرار.': 'صواب',
  'لا ترتبط القيادة الرقمية بالتحول الرقمي.': 'خطأ',
  // Module 1 - Lesson 2
  'من مكونات البنية الرقمية': 'الشبكات والأجهزة والبرمجيات',
  '1- من مكونات البنية الرقمية': 'الشبكات والأجهزة والبرمجيات',
  'من فوائد تنظيم الملفات الرقمية': 'سهولة استرجاع الملفات',
  '2- من فوائد تنظيم الملفات الرقمية': 'سهولة استرجاع الملفات',
  'تساعد مشاركة الموارد الرقمية في تعزيز التعاون بين العاملين': 'صواب',
  'لا تؤثر تحديثات الأنظمة على أمن المعلومات': 'خطأ',
  'يعد Google Drive من أدوات مشاركة الموارد التعليمية': 'صواب',
  // Module 2 - Lesson 1
  'من أدوات التواصل المتزامن:': 'Microsoft Teams',
  'تساعد الاجتماعات الإلكترونية في توفير الوقت والجهد.': 'صواب',
  'لا يجب حفظ تسجيلات الاجتماعات الإلكترونية.': 'خطأ',
  // Module 2 - Lesson 2
  'يهدف النسخ الاحتياطي إلى': 'حماية البيانات من الفقد',
  '1- يهدف النسخ الاحتياطي إلى': 'حماية البيانات من الفقد',
  'من خطوات اتخاذ القرار': 'تحليل البيانات',
  '2: من خطوات اتخاذ القرار': 'تحليل البيانات',
  'يساعد تنظيم البيانات على سرعة الوصول للمعلومات.': 'صواب',
  'لا أهمية لتحديث البيانات الرقمية بصورة مستمرة.': 'خطأ',
  'يمكن للذكاء الاصطناعي دعم عملية اتخاذ القرار.': 'صواب',
  // Module 3 - Lesson 1
  'من خصائص كلمة المرور القوية': 'مزيج من الحروف والأرقام والرموز',
  'من مؤشرات الروابط المشبوهة:': 'طلب معلومات شخصية',
  'يساعد تحديث برامج الحماية في تعزيز الأمن السيبراني.': 'صواب',
  'يمكن فتح أي رابط يصل عبر البريد الإلكتروني دون التحقق منه.': 'خطأ',
  'تعد المصادقة متعددة العوامل وسيلة لتعزيز حماية الحسابات.': 'صواب',
  // Module 3 - Lesson 2
  '1. يقصد بالإشراف الرقمي:': 'متابعة العملية التعليمية باستخدام التقنيات الرقمية',
  'يقصد بالإشراف الرقمي:': 'متابعة العملية التعليمية باستخدام التقنيات الرقمية',
  '2. من أدوات التقويم الرقمي:': 'Google Forms',
  'من أدوات التقويم الرقمي:': 'Google Forms',
  'تساعد التغذية الراجعة الرقمية في تحسين الأداء التعليمي.': 'صواب',
  'لا يمكن تحليل نتائج الاختبارات إلكترونياً.': 'خطأ',
  'يعد Microsoft Forms من أدوات التقويم الرقمي.': 'صواب',
};

/** Look up correct answer from static key (normalize by trimming) */
function lookupAnswer(questionText: string, options?: string[]): string | undefined {
  const key = questionText.trim();
  const directMatch = LESSON_QUIZ_ANSWER_KEY[key];
  if (directMatch) {
    // For MCQ, match against options to find the actual option text
    if (options && options.length > 0) {
      const matched = options.find(opt => opt.includes(directMatch) || directMatch.includes(opt));
      return matched || directMatch;
    }
    return directMatch;
  }
  // Try partial match
  for (const [k, v] of Object.entries(LESSON_QUIZ_ANSWER_KEY)) {
    if (key.includes(k) || k.includes(key)) {
      if (options && options.length > 0) {
        const matched = options.find(opt => opt.includes(v) || v.includes(opt));
        return matched || v;
      }
      return v;
    }
  }
  return undefined;
}

function cleanListItem(content: string) {
  return content.replace(/^\d+[-.]\s*/, '').replace(/^[-*•]\s*/, '').trim();
}

function isUrl(content: string) {
  return /(https?:\/\/[^\s]+)/.test(content);
}

function isYouTubeReference(content: string, url: string) {
  return /youtube|youtu\.be|يوتيوب/i.test(content) || url.includes('youtube.com') || url.includes('youtu.be') || url.includes('share.google');
}

function decodeText(content: string) {
  return content
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>');
}

function cleanAnswerMarker(content: string) {
  return content.replace(/\s*\([✓✔]\)\s*/g, '').replace(/\s*\([✗×]\)\s*/g, '').trim();
}

function markerAnswer(content: string) {
  if (/[✓✔]/.test(content)) return 'صواب';
  if (/[✗×]/.test(content)) return 'خطأ';
  return undefined;
}

function choiceAnswer(content: string) {
  return /[✓✔]/.test(content) ? cleanAnswerMarker(content) : undefined;
}

export function contentParser(moduleData: ModuleModel): ParsedModule {
  const blocks = moduleData.sections[0]?.blocks || [];
  
  const parsedModule: ParsedModule = {
    id: moduleData.id,
    title: moduleData.title, // Default, might be overwritten
    subtitle: '',
    generalObjective: '',
    lessons: []
  };

  let currentLesson: ParsedLesson | null = null;
  let currentElement: ParsedElement | null = null;
  let elementCounter = 1;
  let currentAssessmentType: 'mcq' | 'tf' | 'task' | null = null;

  let state: 'module_intro' | 'lesson_intro' | 'objectives' | 'elements' | 'activities' | 'assessments' | 'summary' = 'module_intro';

  for (let i = 0; i < blocks.length; i++) {
    const block = blocks[i];
    if (block.type !== 'ParagraphBlock' && block.type !== 'HeadingBlock' && block.type !== 'ImageBlock') continue;
    
    let content = decodeText(block.content?.trim() || '');
    if (!content && block.type !== 'ImageBlock') continue;

    // Detect Boundaries
    if (content.startsWith('الموديول الأول:') || content.match(/^الموديول .*: /)) {
       const parts = content.split(':');
       parsedModule.title = parts[0].trim();
       parsedModule.subtitle = parts.slice(1).join(':').trim();
       continue;
    }
    
    if (content === 'الموديول الأول' && i + 1 < blocks.length) {
       parsedModule.title = content;
       parsedModule.subtitle = decodeText(blocks[i+1].content.trim());
       i++;
       continue;
    }

    if (content === 'الهدف العام للموديول') {
      if (i + 1 < blocks.length) {
        parsedModule.generalObjective = decodeText(blocks[i+1].content.trim());
        i++;
      }
      continue;
    }

    if (content.startsWith('الدرس') && content.length < 30) {
      if (currentLesson) {
        if (currentElement) currentLesson.elements.push(currentElement);
        parsedModule.lessons.push(currentLesson);
      }
      currentLesson = {
        id: block.id,
        title: content, 
        objectives: [],
        elements: [],
        activities: [],
        assessments: [],
        summary: null
      };
      
      if (i + 1 < blocks.length && !decodeText(blocks[i+1].content.trim()).startsWith('الأهداف')) {
         currentLesson.title = `${content}: ${decodeText(blocks[i+1].content.trim())}`;
         i++;
      }
      
      currentElement = null;
      elementCounter = 1;
      currentAssessmentType = null;
      state = 'lesson_intro';
      continue;
    }

    if (content === 'الأهداف التعليمية') {
      state = 'objectives';
      continue;
    }

    if (content === 'عرض المحتوى' || content.startsWith('العنصر')) {
      state = 'elements';
      if (content.startsWith('العنصر')) {
        if (currentElement && currentLesson) currentLesson.elements.push(currentElement);
        currentElement = {
          id: block.id,
          title: content.replace(/العنصر[^:]*:\s*/, '').trim(),
          badgeNumber: elementCounter++,
          subConcepts: []
        };
      }
      continue;
    }

    if ((content.startsWith('الأنشطة') || content.startsWith('نشاط')) && state !== 'activities') {
      state = 'activities';
      if (currentElement && currentLesson) {
        currentLesson.elements.push(currentElement);
        currentElement = null;
      }
      if (content.startsWith('نشاط')) {
         currentLesson?.activities.push(content);
      }
      continue;
    }

    if (content === 'التقويم' || content.includes('التقويم')) {
      state = 'assessments';
      continue;
    }

    if (content === 'ملخص' || content.includes('الخلاصة') || content.includes('ملخص الدرس')) {
      state = 'summary';
      if (currentLesson) {
        const lessonIndex = parsedModule.lessons.length;
        currentLesson.summaryImage = `generated/images/${moduleData.id}/image_${lessonIndex + 1}.png`;
      }
      continue;
    }

    if (!currentLesson) continue;

    if (state === 'objectives') {
      if (/^\d+-/.test(content) || /^-/.test(content)) {
        currentLesson.objectives.push(content.replace(/^\d+-\s*/, '').replace(/^-\s*/, ''));
      }
    } 
    else if (state === 'elements') {
      if (!currentElement) {
        currentElement = {
          id: 'element_0',
          title: 'مقدمة',
          badgeNumber: elementCounter++,
          subConcepts: []
        };
      }

      if (block.type === 'ImageBlock' && (block as any).src) {
        currentElement.subConcepts.push({
          type: 'media',
          title: 'صورة توضيحية',
          url: (block as any).src,
          mediaType: 'image'
        });
        continue;
      }

      if (content.startsWith('مفهوم')) {
        let defText = '';
        if (i + 1 < blocks.length) {
          const next = decodeText(blocks[i+1].content.trim());
          if (next.endsWith(':')) {
            defText = decodeText(blocks[i+2]?.content.trim() || '');
            i += 2;
          } else {
            defText = next;
            i++;
          }
        }
        currentElement.subConcepts.push({
          type: 'definition',
          title: content,
          text: defText
        });
      } 
      else if (listHeadingPattern.test(content)) {
        const listItems: string[] = [];
        let j = i + 1;
        while (j < blocks.length) {
          const nextContent = decodeText(blocks[j].content.trim());
          if (!nextContent || isUrl(nextContent) || sectionBoundaryPattern.test(nextContent) || listHeadingPattern.test(nextContent)) break;
          listItems.push(cleanListItem(nextContent));
          j++;
        }
        if (listItems.length > 0) {
          currentElement.subConcepts.push({
            type: 'list',
            title: content,
            items: listItems
          });
          i = j - 1;
        } else {
          currentElement.subConcepts.push({
            type: 'text',
            title: '',
            text: content
          });
        }
      }
      else if (mediaTitleCleanPattern.test(content) && !isUrl(content)) {
        // 'المصدر: YouTube' title-only block — skip it, URL is on the next line
        continue;
      }
      else if (content.match(/(https?:\/\/[^\s]+)/) || /^https?:\/\//.test(content)) {
        const urlMatch = content.match(/(https?:\/\/[^\s]+)/);
        const url = urlMatch ? urlMatch[1] : content;
        // Extract inline title (text before the URL on the same line)
        let rawTitle = content.replace(url, '').trim();
        // Clean 'المصدر:' and 'YouTube' noise and parentheses
        rawTitle = rawTitle
          .replace(mediaTitleCleanPattern, '')
          .replace(/\byoutube\b/gi, '')
          .replace(/[()]/g, '')
          .trim();
        // If inline title is empty, look at the PREVIOUS block for a tool name
        if (!rawTitle) {
          for (let k = i - 1; k >= Math.max(0, i - 3); k--) {
            const kContent = decodeText(blocks[k].content?.trim() || '');
            if (!kContent) continue;
            // Skip 'المصدر:' type blocks
            if (mediaTitleCleanPattern.test(kContent)) continue;
            // Skip boundary/heading blocks
            if (sectionBoundaryPattern.test(kContent) || listHeadingPattern.test(kContent)) break;
            // Use if it's a short label (tool name like Microsoft Teams, Google Workspace)
            if (!isUrl(kContent) && kContent.length < 60) {
              rawTitle = kContent.replace(/[()]/g, '').trim();
            }
            break;
          }
        }
        currentElement.subConcepts.push({
          type: 'media',
          title: rawTitle,
          url: url,
          mediaType: isYouTubeReference(content, url) ? 'video' : 'link'
        });
      }
      else {
        if (content.includes('يصبح المتدرب قادراً')) continue;
        currentElement.subConcepts.push({
          type: 'text',
          title: '',
          text: content
        });
      }

    }
    else if (state === 'activities') {
      if (content.match(/نشاط/)) {
        let taskText = content;
        if (i + 1 < blocks.length && !blocks[i+1].content.match(/نشاط|التقويم|ملخص/)) {
          taskText += ' - ' + decodeText(blocks[i+1].content.trim());
          i++;
        }
        currentLesson.activities.push(taskText);
      } else if (content !== 'الأنشطة') {
        const last = currentLesson.activities.length - 1;
        if (last >= 0) {
           currentLesson.activities[last] += ' - ' + content;
        } else {
           currentLesson.activities.push(content);
        }
      }
    }
    else if (state === 'assessments') {
      if (content.includes('اختيار من متعدد') || content.includes('اولا:') || content.includes('أولا:')) {
        currentAssessmentType = 'mcq';
        continue;
      }
      if (content.includes('صح أم خطأ') || content.includes('ثانيا:')) {
        currentAssessmentType = 'tf';
        continue;
      }
      if (content.includes('مهمة أدائية') || content.includes('ثالثا:')) {
        currentAssessmentType = 'task';
        continue;
      }

      if (currentAssessmentType === 'mcq') {
         if (!content.match(/^(?:\.\s*)?[اأبجد][)-]/)) {
            // Strip leading question numbers like "1-" or "1." or "2:"
            const qText = content.replace(/^\d+[-.:)\s]+/, '').trim();
            const choices: string[] = [];
            let correctAnswer: string | undefined;
            let j = i + 1;
            while (j < blocks.length && choices.length < 4) {
               const nextContent = decodeText(blocks[j].content.trim());
               const inlineMatch = nextContent.match(/^(?:\.\s*)?[اأبجد][)-]\s*(.+)/);
               if (inlineMatch) {
                  const answerText = cleanAnswerMarker(inlineMatch[1]);
                  choices.push(answerText);
                  correctAnswer = correctAnswer || choiceAnswer(inlineMatch[1]);
                  j++;
                  continue;
               }
               // Reversed format: 'Microsoft Teamsب)' — letter at end
               const reversedMatch = nextContent.match(/^(.+?)\s*[اأبجد][)-]$/);
               if (reversedMatch && reversedMatch[1].trim().length > 0) {
                  const answerText = cleanAnswerMarker(reversedMatch[1].trim());
                  choices.push(answerText);
                  j++;
                  continue;
               }
               if (/^(?:\.\s*)?[اأبجد][)-]$/.test(nextContent) && j + 1 < blocks.length) {
                  const answerText = decodeText(blocks[j+1].content.trim());
                  choices.push(cleanAnswerMarker(answerText));
                  correctAnswer = correctAnswer || choiceAnswer(answerText);
                  j += 2;
                  continue;
               }
               break;
            }
            if (choices.length > 0) {
              // If no ✓ marker found, look up from static key
              if (!correctAnswer) {
                correctAnswer = lookupAnswer(qText, choices) || lookupAnswer(content, choices);
              }
              currentLesson.assessments.push({ id: block.id, type: 'mcq', text: qText, options: choices, correctAnswer });
              i = j - 1;
            }
         }
      }
      else if (currentAssessmentType === 'tf') {
         const tfText = cleanAnswerMarker(content);
         const markerAns = markerAnswer(content);
         const correct = markerAns || lookupAnswer(tfText) || lookupAnswer(content);
         currentLesson.assessments.push({ id: block.id, type: 'tf', text: tfText, correctAnswer: correct });
      }
      else if (currentAssessmentType === 'task') {
         const last = currentLesson.assessments[currentLesson.assessments.length - 1];
         if (last && last.type === 'task') {
           last.text += '\n- ' + content;
         } else {
           currentLesson.assessments.push({ id: block.id, type: 'task', text: content });
         }
      }
    }
    else if (state === 'summary') {
      if (content !== 'ملخص' && !content.includes('الخلاصة')) {
         currentLesson.summary = (currentLesson.summary || '') + content + '\n';
      }
    }
  }

  if (currentLesson) {
    if (currentElement) currentLesson.elements.push(currentElement);
    parsedModule.lessons.push(currentLesson);
  }

  return parsedModule;
}
