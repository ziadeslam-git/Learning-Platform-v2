import { getRetrievalIndex } from './contentIndexer';
import type { RetrievalResult, RetrievalOptions } from '../../features/assistant/types';

/**
 * Applies conservative Arabic text normalization to improve search matching
 * without destroying the educational context.
 */
export function normalizeArabicSearchText(text: string): string {
  if (!text) return '';
  let n = text.toLowerCase();
  
  // 1. Remove tashkeel (diacritics)
  n = n.replace(/[\u0617-\u061A\u064B-\u0652]/g, '');
  
  // 2. Normalize alef variants to bare alef
  n = n.replace(/[إأآا]/g, 'ا');
  
  // 3. Normalize teh marbuta to heh
  n = n.replace(/ة/g, 'ه');
  
  // 4. Normalize yeh variants
  n = n.replace(/[يى]/g, 'ي');
  
  // 5. Remove excessive whitespace
  n = n.replace(/\s+/g, ' ').trim();
  
  return n;
}

// Minimal stop words to ignore only words that carry zero educational value
const STOP_WORDS = new Set([
  'في', 'من', 'على', 'الى', 'إلى', 'عن', 'مع', 'هل', 'ما', 'ماذا', 'كيف', 'متى', 'أين', 'اين', 'و', 'أو', 'او', 'ثم', 'هذا', 'هذه', 'أن', 'ان'
]);

export function searchContent(query: string, options?: RetrievalOptions): RetrievalResult[] {
  const limit = options?.limit ?? 5;
  const rawQuery = query.trim();
  
  if (!rawQuery) return [];
  
  const normalizedQuery = normalizeArabicSearchText(rawQuery);
  const rawTokens = normalizedQuery.split(' ');
  const queryTokens = rawTokens.filter(t => t.length > 1 && !STOP_WORDS.has(t));
  
  if (queryTokens.length === 0) return [];
  
  const searchTokens = queryTokens;

  const index = getRetrievalIndex();
  const results: RetrievalResult[] = [];

  for (const doc of index) {
    let score = 0;
    const matchedTerms = new Set<string>();
    
    const normTitle = normalizeArabicSearchText(doc.moduleTitle);
    const normLesson = normalizeArabicSearchText(doc.lessonTitle);
    const normSection = doc.sectionTitle ? normalizeArabicSearchText(doc.sectionTitle) : '';
    const normContent = normalizeArabicSearchText(doc.content);

    // 1. EXACT PHRASE MATCHING
    // Highest priority for exact phrases
    if (normSection && normSection.includes(normalizedQuery)) {
      score += 100; // Concept/Section match (strongest)
      matchedTerms.add(rawQuery);
    } else if (normLesson.includes(normalizedQuery)) {
      score += 80; // Lesson match
      matchedTerms.add(rawQuery);
    } else if (normTitle.includes(normalizedQuery)) {
      score += 60; // Module match
      matchedTerms.add(rawQuery);
    } else if (normContent.includes(normalizedQuery)) {
      score += 40; // Body exact phrase match
      matchedTerms.add(rawQuery);
    }

    // 2. TOKEN MATCHING
    let tokensMatched = 0;
    for (const token of searchTokens) {
      let matched = false;
      
      // Title boosts
      if (normSection && normSection.includes(token)) { score += 20; matched = true; }
      else if (normLesson.includes(token)) { score += 15; matched = true; }
      else if (normTitle.includes(token)) { score += 10; matched = true; }
      
      // Body content match
      const regex = new RegExp(token, 'g');
      const bodyMatches = (normContent.match(regex) || []).length;
      if (bodyMatches > 0) {
        // Add points based on frequency, capped to prevent spamming
        score += Math.min(bodyMatches * 3, 15);
        matched = true;
      }
      
      if (matched) {
        tokensMatched++;
        matchedTerms.add(token);
      }
    }

    // Co-occurrence boost: if multiple tokens are found, it's a stronger match
    if (tokensMatched > 1) {
      score += (tokensMatched * 10); 
    }

    // 3. RELEVANCE THRESHOLD
    // Discard documents that barely matched anything (e.g., 1 weak token)
    if (score >= 15) {
      results.push({
        document: doc,
        score,
        matchedTerms: Array.from(matchedTerms)
      });
    }
  }

  // Sort strictly by highest score
  results.sort((a, b) => b.score - a.score);

  return results.slice(0, limit);
}
