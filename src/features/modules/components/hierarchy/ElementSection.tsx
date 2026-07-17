import type { ParsedElement } from '../../utils/contentParser';
import { contentRepository } from '../../../../services/content/contentRepository';
import { ExternalLink } from 'lucide-react';

// YouTube SVG logo
function YouTubeLogo({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
    </svg>
  );
}

/** Clean parentheses and noise from any title string */
function cleanTitle(t: string | undefined) {
  if (!t) return '';
  return t.replace(/[()]/g, '').replace(/^المصدر\s*:\s*/i, '').trim();
}

export function ElementSection({ element }: { element: ParsedElement }) {
  return (
    <div className="mb-section bg-white/5 border border-white/10 p-6 md:p-8 rounded-3xl shadow-lg backdrop-blur-sm">
      {/* Element header */}
      <div className="flex items-center gap-4 mb-element">
        <div className="w-10 h-10 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-orange-400 font-bold text-lg shrink-0">
          {element.badgeNumber}
        </div>
        <h3 className="text-2xl font-bold text-white font-arabic">{element.title}</h3>
      </div>

      <div className="space-y-element">
        {(() => {
          type ConceptType = typeof element.subConcepts[0];
          type GroupItem =
            | { kind: 'single'; concept: ConceptType; idx: number }
            | { kind: 'media-group'; items: { concept: ConceptType; idx: number }[] };

          // Group consecutive media items so they render 2-per-row
          const grouped: GroupItem[] = [];
          let mediaAccum: { concept: ConceptType; idx: number }[] = [];

          element.subConcepts.forEach((concept, idx) => {
            if (concept.type === 'media') {
              mediaAccum.push({ concept, idx });
            } else {
              if (mediaAccum.length > 0) {
                grouped.push({ kind: 'media-group', items: mediaAccum });
                mediaAccum = [];
              }
              grouped.push({ kind: 'single', concept, idx });
            }
          });
          if (mediaAccum.length > 0) {
            grouped.push({ kind: 'media-group', items: mediaAccum });
          }

          return grouped.map((group, gi) => {
            if (group.kind === 'single') {
              const { concept, idx } = group;

              // ── Definition ──────────────────────────────────────────────────
              if (concept.type === 'definition') {
                return (
                  <div key={idx} className="bg-black/20 border-r-4 border-r-orange-500/50 p-5 rounded-2xl">
                    <h4 className="text-orange-300 font-bold mb-text text-lg font-arabic">
                      {cleanTitle(concept.title)}
                    </h4>
                    <p className="text-gray-200 leading-relaxed text-lg font-arabic">{concept.text}</p>
                  </div>
                );
              }

              // ── List → toggle with orange bullet points (unchanged style) ───
              if (concept.type === 'list') {
                const title = cleanTitle(concept.title);
                return (
                  <details key={idx} open className="group my-element rounded-2xl border border-white/10 bg-black/20 p-4 open:border-orange-500/30">
                    <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-orange-200 font-semibold text-lg font-arabic">
                      <span>{title}</span>
                      <span className="text-orange-400 transition-transform group-open:rotate-180 text-xl">⌄</span>
                    </summary>
                    <ul className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3 text-gray-300 font-arabic text-right">
                      {concept.items.map((item: string, i: number) => (
                        <li key={i} className="leading-relaxed rounded-xl bg-white/[0.03] border border-white/5 px-4 py-3 relative pr-7">
                          <span className="absolute right-3 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-orange-500 shrink-0"></span>
                          {cleanTitle(item)}
                        </li>
                      ))}
                    </ul>
                  </details>
                );
              }

              // ── Plain text ───────────────────────────────────────────────────
              if (concept.type === 'text') {
                if (!concept.text) return null;
                return (
                  <p key={idx} className="text-gray-300 leading-relaxed text-lg font-arabic">
                    {concept.text}
                  </p>
                );
              }
            }

            // ── Media ────────────────────────────────────────
            if (group.kind === 'media-group') {
              return (
                <div key={`mg-${gi}`} className="flex flex-col gap-6 my-6">
                  {group.items.map(({ concept, idx }) => {
                    if (concept.type !== 'media') return null;
                    const title = cleanTitle(concept.title);

                    // Image
                    if (concept.mediaType === 'image') {
                      const imgSrc = contentRepository.getImage(concept.url);
                      return (
                        <div key={idx} className="rounded-2xl overflow-hidden border border-white/10 bg-black/30 flex flex-col w-full">
                          {imgSrc ? (
                            <img src={imgSrc} alt={title} loading="lazy"
                              className="w-full h-auto object-cover" />
                          ) : (
                            <div className="text-gray-500 p-6 text-center bg-white/5 rounded-xl border border-dashed border-white/10 flex-1 flex items-center justify-center text-sm font-arabic">
                              صورة مفقودة
                            </div>
                          )}
                          {title && title !== 'صورة توضيحية' && (
                            <p className="text-gray-400 text-center text-sm mt-2 font-arabic">{title}</p>
                          )}
                        </div>
                      );
                    }

                    // YouTube video → compact red button
                    if (concept.mediaType === 'video') {
                      return (
                        <div key={idx} className="flex flex-col gap-2">
                          {title && (
                            <span className="text-orange-200 font-semibold font-arabic text-sm text-right">{title}</span>
                          )}
                          <a
                            href={concept.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group inline-flex items-center gap-3 bg-[#FF0000]/10 border border-[#FF0000]/30 hover:bg-[#FF0000]/20 hover:border-[#FF0000]/60 transition-all px-5 py-3 rounded-xl w-full"
                          >
                            <YouTubeLogo className="h-6 w-6 text-[#FF0000] shrink-0" />
                            <span className="text-white font-bold text-sm font-arabic">مشاهدة على YouTube</span>
                            <ExternalLink className="h-3.5 w-3.5 text-gray-400 mr-auto group-hover:text-white transition-colors" />
                          </a>
                        </div>
                      );
                    }

                    // Generic link
                    return (
                      <div key={idx} className="flex flex-col gap-2">
                        {title && (
                          <span className="text-orange-200 font-semibold font-arabic text-sm text-right">{title}</span>
                        )}
                        <a
                          href={concept.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-3 bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all px-5 py-3 rounded-xl w-full"
                        >
                          <ExternalLink className="h-5 w-5 text-orange-500 shrink-0" />
                          <span className="text-white font-bold text-sm font-arabic">فتح الرابط</span>
                        </a>
                      </div>
                    );
                  })}
                </div>
              );
            }

            return null;
          });
        })()}
      </div>
    </div>
  );
}
