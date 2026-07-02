const fs = require('fs');

const test1 = JSON.parse(fs.readFileSync('./generated/content/الاختبار-التحصيلي.json', 'utf8'));
const test2 = JSON.parse(fs.readFileSync('./generated/content/اجابة-الاختبار.json', 'utf8'));

const blocks1 = test1.sections[0].blocks;
const blocks2 = test2.sections[0].blocks;

let diffCount = 0;
for (let i = 0; i < Math.min(blocks1.length, blocks2.length); i++) {
  if (blocks1[i].content !== blocks2[i].content) {
    console.log(`Diff at index ${i}:`);
    console.log(`  Test1: ${blocks1[i].content}`);
    console.log(`  Test2: ${blocks2[i].content}`);
    diffCount++;
    if (diffCount > 10) break;
  }
}
if (blocks1.length !== blocks2.length) {
  console.log(`Length mismatch: ${blocks1.length} vs ${blocks2.length}`);
} else if (diffCount === 0) {
  console.log('No differences found in content.');
}
