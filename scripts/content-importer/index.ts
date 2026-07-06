import * as fs from 'fs-extra';
import * as path from 'path';
import * as mammoth from 'mammoth';
import { contentConfig } from '../../config/content.config.ts';
import { DocumentModel, Block, DocumentType } from '../../types/document.ts';
import { HeadingBlock, ParagraphBlock, UnknownBlock } from '../../types/blocks.ts';

// Ensure directories exist
fs.ensureDirSync(contentConfig.generatedPath);
fs.ensureDirSync(contentConfig.imagesPath);

let totalProcessed = 0;
let totalSkipped = 0;
let warnings: string[] = [];

async function parseDocx(filePath: string, docType: DocumentType, docId: string): Promise<DocumentModel | null> {
  try {
    const fileName = path.basename(filePath, path.extname(filePath));
    const imageDir = path.join(contentConfig.imagesPath, docId);
    fs.ensureDirSync(imageDir);

    let imageCounter = 0;

    const options = {
      convertImage: mammoth.images.imgElement(function(image: any) {
        return image.read("base64").then(function(imageBuffer: string) {
          imageCounter++;
          const imgName = `image_${imageCounter}.png`;
          const imgPath = path.join(imageDir, imgName);
          // Mammoth returns a base64 string, so we convert it to a buffer
          const buffer = Buffer.from(imageBuffer, 'base64');
          fs.writeFileSync(imgPath, buffer);
          
          // Return the relative URL for the JSON
          const relativePath = path.posix.join('generated/images', docId, imgName);
          return { src: relativePath };
        });
      })
    };

    const result = await mammoth.convertToHtml({ path: filePath }, options);
    
    if (result.messages && result.messages.length > 0) {
      result.messages.forEach((msg: any) => warnings.push(`[${fileName}] ${msg.message}`));
    }

    const html = result.value;
    
    // Very simple regex parsing of the generated HTML for Phase 3 
    // Mammoth outputs standard tags like <h1>, <p>, <img src="...">
    const blocks: Block[] = [];
    let blockIndex = 1;

    // Use a simple regex to split blocks
    const blockRegex = /<(h[1-6]|p|img)[^>]*>(.*?)<\/\1>|<img[^>]+src="([^"]+)"[^>]*>/g;
    let match;

    while ((match = blockRegex.exec(html)) !== null) {
      const tag = match[1];
      const content = match[2];
      const imgSrc = match[3];

      if (tag && tag.startsWith('h')) {
        blocks.push({
          id: `heading_${blockIndex++}`,
          type: 'HeadingBlock',
          level: parseInt(tag.charAt(1)),
          content: content.replace(/<[^>]+>/g, '').trim()
        } as HeadingBlock);
      } else if (tag === 'p') {
        const text = content.replace(/<[^>]+>/g, '').trim();
        if (text) {
          blocks.push({
            id: `paragraph_${blockIndex++}`,
            type: 'ParagraphBlock',
            content: text
          } as ParagraphBlock);
        }
      } else if (imgSrc || tag === 'img') {
        // Image extraction logic matched
        const finalSrc = imgSrc || (content && content.match(/src="([^"]+)"/)?.[1]);
        if (finalSrc) {
          blocks.push({
            id: `image_${blockIndex++}`,
            type: 'ImageBlock',
            src: finalSrc,
            content: ''
          });
        }
      } else {
        // Unrecognized
        blocks.push({
          id: `unknown_${blockIndex++}`,
          type: 'UnknownBlock',
          rawHtml: match[0],
          content: ''
        } as UnknownBlock);
      }
    }

    const doc: DocumentModel = {
      id: docId,
      title: fileName,
      type: docType,
      language: 'ar',
      sections: [
        {
          id: 'section_1',
          title: 'Main Section',
          blocks
        }
      ]
    };

    return doc;

  } catch (error: any) {
    warnings.push(`[${filePath}] Error: ${error.message}`);
    return null;
  }
}

async function run() {
  const startTime = Date.now();
  console.log('Starting Content Importer...');

  const dirs = fs.readdirSync(contentConfig.docsPath, { withFileTypes: true });

  for (const dir of dirs) {
    if (dir.isDirectory()) {
      const docType = dir.name as DocumentType; // e.g., 'modules', 'assessments'
      
      // Normalize docType (e.g., 'modules' -> 'module')
      const normalizedType = docType.endsWith('s') ? docType.slice(0, -1) as DocumentType : docType;

      const filesPath = path.join(contentConfig.docsPath, dir.name);
      const files = fs.readdirSync(filesPath).filter(f => f.endsWith('.docx'));

      for (const file of files) {
        const filePath = path.join(filesPath, file);
        const docId = path.basename(file, '.docx').toLowerCase().replace(/\s+/g, '-');
        
        console.log(`Processing ${file}...`);
        
        const doc = await parseDocx(filePath, normalizedType, docId);
        if (doc) {
          const outPath = path.join(contentConfig.generatedPath, `${docId}.json`);
          fs.writeJsonSync(outPath, doc, { spaces: 2 });
          totalProcessed++;
        } else {
          totalSkipped++;
        }
      }
    }
  }

  // Generate Reports
  const report = `# Import Report\n\n- **Imported Files**: ${totalProcessed}\n- **Skipped Files**: ${totalSkipped}\n- **Elapsed Time**: ${Date.now() - startTime}ms\n\n## Warnings\n${warnings.map(w => `- ${w}`).join('\n') || '- None'}`;
  
  fs.writeFileSync(path.join('generated', 'import-report.md'), report);
  fs.writeFileSync(path.join('generated', 'validation-report.md'), '# Validation Report\n\n(Validation checks will go here)');
  fs.writeJsonSync(path.join('generated', 'manifest.json'), { lastRun: new Date().toISOString(), totalProcessed });

  console.log(`Finished. Processed: ${totalProcessed}. Skipped: ${totalSkipped}.`);
}

run().catch(console.error);
