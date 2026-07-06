
const fs = require('fs');

const data = JSON.parse(fs.readFileSync('generated/content/الاختبار-التحصيلي.json', 'utf8'));

const blocks = data.sections[0].blocks;
const questions = [];
const cognitiveLevels = new Set(['تذكر', 'فهم', 'تطبيق', 'تقويم', 'تحليل']);

function isChoiceMarker(text) {
  return /^[أبجده][-.ـ]?$/.test(text.trim());
}

for (let i = 0; i < blocks.length; i++) {
  const text = blocks[i].content.trim();

  if (text === 'صواب' && blocks[i + 1]?.content.trim() === 'خطأ') {
    const previous = blocks[i - 1]?.content.trim();
    if (previous && !cognitiveLevels.has(previous)) {
      questions.push({ text: previous, options: ['صواب', 'خطأ'] });
    }
    i += 1;
    continue;
  }

  if (isChoiceMarker(text) && i > 0) {
    const choices = [];
    let j = i;

    while (j < blocks.length && choices.length < 4 && isChoiceMarker(blocks[j].content)) {
      const choiceText = blocks[j + 1]?.content.trim();
      if (!choiceText || isChoiceMarker(choiceText) || cognitiveLevels.has(choiceText)) break;
      choices.push(choiceText);
      j += 2;
    }

    const questionText = blocks[i - 1].content.trim();
    if (choices.length >= 2 && questionText && !cognitiveLevels.has(questionText)) {
      questions.push({ text: questionText, options: choices });
      i = j - 1;
    }
  }
}

fs.writeFileSync('questions_dump.json', JSON.stringify(questions, null, 2), 'utf8');
console.log('Dumped ' + questions.length + ' questions.');

