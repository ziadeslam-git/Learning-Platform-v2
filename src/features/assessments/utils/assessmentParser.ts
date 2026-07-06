import type { AssessmentModel } from '../../../../types/assessment';
import type { ParsedQuestion } from '../../../types/assessment';

const cognitiveLevels = new Set(['تذكر', 'فهم', 'تطبيق', 'تقويم', 'تحليل']);
const likertChoices = ['أوافق بشدة', 'أوافق', 'لا أدري', 'لا أوافق', 'لا أوافق بشدة'];

function isChoiceMarker(text: string) {
  return /^[أبجده][-.ـ]?$/.test(text.trim());
}

export function parseAssessmentQuestions(data: AssessmentModel): ParsedQuestion[] {
  const blocks = data.sections[0]?.blocks || [];
  const questions: ParsedQuestion[] = [];
  const title = `${data.id} ${data.title}`;

  if (title.includes('مقياس')) {
    const secondHeaderIndex = blocks.findIndex((block, index) => {
      return index > 30 && block.content.trim() === 'العبارة';
    });
    const startIndex = secondHeaderIndex >= 0 ? secondHeaderIndex + 1 : 0;

    for (let i = startIndex; i < blocks.length; i++) {
      const statement = blocks[i].content.trim();
      if (
        statement.length > 10 &&
        !statement.startsWith('المحور') &&
        !likertChoices.includes(statement)
      ) {
        questions.push({ id: blocks[i].id, text: statement, choices: likertChoices });
      }
    }
    return questions;
  }

  for (let i = 0; i < blocks.length; i++) {
    const text = blocks[i].content.trim();

    if (text === 'صواب' && blocks[i + 1]?.content.trim() === 'خطأ') {
      const previous = blocks[i - 1]?.content.trim();
      if (previous && !cognitiveLevels.has(previous)) {
        questions.push({ id: blocks[i - 1].id, text: previous, choices: ['صواب', 'خطأ'] });
      }
      i += 1;
      continue;
    }

    if (isChoiceMarker(text) && i > 0) {
      const choices: string[] = [];
      let j = i;

      while (j < blocks.length && choices.length < 4 && isChoiceMarker(blocks[j].content)) {
        const choiceText = blocks[j + 1]?.content.trim();
        if (!choiceText || isChoiceMarker(choiceText) || cognitiveLevels.has(choiceText)) break;
        choices.push(choiceText);
        j += 2;
      }

      const questionText = blocks[i - 1].content.trim();
      if (choices.length >= 2 && questionText && !cognitiveLevels.has(questionText)) {
        questions.push({ id: blocks[i - 1].id, text: questionText, choices });
        i = j - 1;
      }
    }
  }

  return questions;
}
