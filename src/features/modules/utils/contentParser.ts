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
}

const sectionBoundaryPattern = /^(الدرس|العنصر|الأهداف التعليمية|عرض المحتوى|الأنشطة|نشاط|التقويم|ملخص|الخلاصة)/;
const listHeadingPattern = /^(أهمية|مجالات|مكونات|خطوات|فوائد|أدوات|خصائص|مهارات|أساليب|متطلبات|إجراءات)/;

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
       parsedModule.subtitle = blocks[i+1].content.trim();
       i++;
       continue;
    }

    if (content === 'الهدف العام للموديول') {
      if (i + 1 < blocks.length) {
        parsedModule.generalObjective = blocks[i+1].content.trim();
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
      
      if (i + 1 < blocks.length && !blocks[i+1].content.trim().startsWith('الأهداف')) {
         currentLesson.title = `${content}: ${blocks[i+1].content.trim()}`;
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
          const next = blocks[i+1].content.trim();
          if (next.endsWith(':')) {
            defText = blocks[i+2]?.content.trim() || '';
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
          const nextContent = blocks[j].content.trim();
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
      else if (content.match(/(https?:\/\/[^\s]+)/)) {
        const urlMatch = content.match(/(https?:\/\/[^\s]+)/);
        const url = urlMatch ? urlMatch[1] : '';
        currentElement.subConcepts.push({
          type: 'media',
          title: content.replace(url, '').trim() || 'رابط مرفق',
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
          taskText += ' - ' + blocks[i+1].content.trim();
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
         if (!content.match(/^(?:\.\s*)?[أبجد][\)\-]/)) {
            const qText = content;
            const choices = [];
            let j = i + 1;
            while (j < blocks.length && choices.length < 4) {
               const nextContent = blocks[j].content.trim();
               const inlineMatch = nextContent.match(/^(?:\.\s*)?[أبجد][\)\-]\s*(.+)/);
               if (inlineMatch) {
                  choices.push(inlineMatch[1]);
                  j++;
                  continue;
               }
               if (/^(?:\.\s*)?[أبجد][\)\-]$/.test(nextContent) && j + 1 < blocks.length) {
                  choices.push(blocks[j+1].content.trim());
                  j += 2;
                  continue;
               }
               break;
            }
            if (choices.length > 0) {
              currentLesson.assessments.push({ id: block.id, type: 'mcq', text: qText, options: choices });
              i = j - 1;
            }
         }
      }
      else if (currentAssessmentType === 'tf') {
         currentLesson.assessments.push({ id: block.id, type: 'tf', text: content });
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
