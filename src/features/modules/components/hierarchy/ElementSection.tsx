import type { ParsedElement } from '../../utils/contentParser';
import { contentRepository } from '../../../../services/content/contentRepository';
import { ExternalLink } from 'lucide-react';

// YouTube SVG logo component
function YouTubeLogo({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
    </svg>
  );
}

export function ElementSection({ element }: { element: ParsedElement }) {
  return (
    <div className="mb-section bg-white/5 border border-white/10 p-6 md:p-8 rounded-3xl shadow-lg backdrop-blur-sm">
      <div className="flex items-center gap-4 mb-element">
        <div className="w-10 h-10 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-orange-400 font-bold text-lg shrink-0">
          {element.badgeNumber}
        </div>
        <h3 className="text-2xl font-bold text-white font-arabic">{element.title}</h3>
      </div>
      
      <div className="space-y-element">
        {(() => {
          // Group consecutive media into pairs for side-by-side display
          type ConceptType = typeof element.subConcepts[0];
          type GroupItem =
            | { type: 'single'; concept: ConceptType; idx: number }
            | { type: 'media-group'; items: { concept: ConceptType; idx: number }[] };

          const grouped: GroupItem[] = [];
          let currentGroup: { concept: ConceptType; idx: number }[] = [];

          element.subConcepts.forEach((concept, idx) => {
            if (concept.type === 'media') {
              currentGroup.push({ concept, idx });
            } else {
              if (currentGroup.length > 0) {
                grouped.push({ type: 'media-group', items: currentGroup });
                currentGroup = [];
              }
              grouped.push({ type: 'single', concept, idx });
            }
          });
          if (currentGroup.length > 0) {
            grouped.push({ type: 'media-group', items: currentGroup });
          }

          return grouped.map((group, groupIdx) => {
            if (group.type === 'single') {
              const { concept, idx } = group;

              // Definition block
              if (concept.type === 'definition') {
                return (
                  <div key={idx} className="bg-black/20 border-r-4 border-r-orange-500/50 p-5 rounded-2xl">
                    <h4 className="text-orange-300 font-bold mb-text text-lg font-arabic">{concept.title}</h4>
                    <p className="text-gray-200 leading-relaxed text-lg font-arabic">{concept.text}</p>
                  </div>
                );
              }

              // List block - shown always open with numbered grid
              if (concept.type === 'list') {
                const cleanTitle = concept.title?.replace(/[()]/g, '').trim();
                return (
                  <div key={idx} className="my-element">
                    {cleanTitle && (
                      <h4 className="text-orange-200 font-semibold text-base font-arabic mb-3">
                        {cleanTitle}:-
                      </h4>
                    )}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {concept.items.map((item: string, i: number) => {
                        const cleanItem = item.replace(/[()]/g, '').trim();
                        return (
                          <div key={i} className="flex items-start gap-3 rounded-xl bg-white/[0.03] border border-white/5 px-4 py-3">
                            <span className="flex items-center justify-center min-w-[1.5rem] h-6 rounded-full bg-orange-500/20 text-orange-400 text-xs font-bold shrink-0 mt-0.5">
                              {i + 1}
                            </span>
                            <span className="leading-relaxed text-gray-300 font-arabic" dir="auto">{cleanItem}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              }

              // Plain text
              if (concept.type === 'text') {
                return (
                  <p key={idx} className="text-gray-300 leading-relaxed text-lg font-arabic">
                    {concept.text}
                  </p>
                );
              }
            }

            // Media group - displayed 2 per row
            if (group.type === 'media-group') {
              return (
                <div key={`group-${groupIdx}`} className="grid grid-cols-1 md:grid-cols-2 gap-4 my-4">
                  {group.items.map(({ concept, idx }) => {
                    const cleanTitle = concept.title?.replace(/[()]/g, '').trim();

                    if (concept.type !== 'media') return null;

                    if (concept.mediaType === 'image') {
                      const imgSrc = contentRepository.getImage(concept.url);
                      return (
                        <div key={idx} className="rounded-2xl overflow-hidden border border-white/10 bg-black/30 p-3 flex flex-col">
                          {imgSrc ? (
                            <img src={imgSrc} alt={cleanTitle} loading="lazy" className="w-full h-auto max-h-72 object-contain rounded-xl" />
                          ) : (
                            <div className="text-gray-500 p-6 text-center bg-white/5 rounded-xl border border-dashed border-white/10 flex-1 flex items-center justify-center text-sm font-arabic">
                              صورة مفقودة
                            </div>
                          )}
                          {cleanTitle && cleanTitle !== 'صورة توضيحية' && (
                            <p className="text-gray-400 text-center text-sm mt-2 font-arabic" dir="auto">{cleanTitle}</p>
                          )}
                        </div>
                      );
                    }

                    // Video — compact YouTube button
                    if (concept.mediaType === 'video') {
                      return (
                        <div key={idx} className="flex flex-col gap-2">
                          {cleanTitle && (
                            <span className="text-orange-200 font-semibold font-arabic text-sm" dir="auto">{cleanTitle}</span>
                          )}
                          <a
                            href={concept.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group inline-flex items-center gap-3 bg-[#FF0000]/10 border border-[#FF0000]/30 hover:bg-[#FF0000]/20 hover:border-[#FF0000]/60 transition-all px-5 py-3 rounded-xl w-full"
                          >
                            <YouTubeLogo className="h-6 w-6 text-[#FF0000] shrink-0" />
                            <span className="text-white font-bold text-sm font-arabic">مشاهدة على YouTube</span>
                            <ExternalLink className="h-3.5 w-3.5 text-gray-400 ml-auto group-hover:text-white transition-colors" />
                          </a>
                        </div>
                      );
                    }

                    // Generic link
                    return (
                      <div key={idx} className="flex flex-col gap-2">
                        {cleanTitle && (
                          <span className="text-orange-200 font-semibold font-arabic text-sm" dir="auto">{cleanTitle}</span>
                        )}
                        <a
                          href={concept.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="group inline-flex items-center gap-3 bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all px-5 py-3 rounded-xl w-full"
                        >
                          <ExternalLink className="h-5 w-5 text-orange-500 shrink-0" />
                          <span className="text-white font-bold text-sm font-arabic truncate">فتح الرابط</span>
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
