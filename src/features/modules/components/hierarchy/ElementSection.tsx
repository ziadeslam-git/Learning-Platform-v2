import type { ParsedElement } from '../../utils/contentParser';
import { contentRepository } from '../../../../services/content/contentRepository';
import { ExternalLink, Play } from 'lucide-react';

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
        {element.subConcepts.map((concept, idx) => {
          if (concept.type === 'definition') {
            return (
              <div key={idx} className="bg-black/20 border-r-4 border-r-white/20 p-5 rounded-2xl">
                <h4 className="text-orange-300 font-bold mb-text text-lg font-arabic">{concept.title}</h4>
                <p className="text-gray-200 leading-relaxed text-lg font-arabic">{concept.text}</p>
              </div>
            );
          }
          if (concept.type === 'list') {
            return (
              <details key={idx} className="group my-element rounded-2xl border border-white/10 bg-black/20 p-4 open:border-orange-500/30">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-orange-200 font-semibold text-lg font-arabic">
                  <span>{concept.title}</span>
                  <span className="text-orange-400 transition-transform group-open:rotate-180">⌄</span>
                </summary>
                <ul className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3 text-gray-300 font-arabic text-right">
                  {concept.items.map((item, i) => (
                    <li key={i} className="leading-relaxed rounded-xl bg-white/[0.03] border border-white/5 px-4 py-3 relative pr-7">
                      <span className="absolute right-3 top-5 w-1.5 h-1.5 rounded-full bg-orange-500"></span>
                      {item}
                    </li>
                  ))}
                </ul>
              </details>
            );
          }
          if (concept.type === 'text') {
            return (
              <p key={idx} className="text-gray-300 leading-relaxed text-lg font-arabic">
                {concept.text}
              </p>
            );
          }
          if (concept.type === 'media') {
             if (concept.mediaType === 'image') {
               const imgSrc = contentRepository.getImage(concept.url);
               return (
                 <div key={idx} className="my-6 rounded-2xl overflow-hidden border border-white/10 bg-black/40 p-4">
                   {imgSrc ? (
                     <img src={imgSrc} alt={concept.title} loading="lazy" className="w-full h-auto max-h-[600px] object-contain rounded-xl" />
                   ) : (
                     <div className="text-gray-400 p-8 text-center bg-white/5 rounded-xl border border-dashed border-white/20">
                       صورة مفقودة: {concept.url}
                     </div>
                   )}
                   {concept.title && concept.title !== 'صورة توضيحية' && (
                     <p className="text-gray-400 text-center mt-4 font-arabic">{concept.title}</p>
                   )}
                 </div>
               );
             }
             if (concept.mediaType === 'video') {
               // Extract YouTube ID
               const videoIdMatch = concept.url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([^&?]+)/);
               const videoId = videoIdMatch ? videoIdMatch[1] : null;
               
               return (
                 <div key={idx} className="my-6 rounded-2xl overflow-hidden border border-orange-500/20 bg-black/40">
                   {videoId ? (
                     <div className="relative w-full pb-[56.25%]">
                       <iframe
                         src={`https://www.youtube.com/embed/${videoId}`}
                         title={concept.title || 'فيديو تعليمي'}
                         loading="lazy"
                         allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                         allowFullScreen
                         className="absolute top-0 left-0 w-full h-full rounded-xl"
                       />
                     </div>
                   ) : (
                     <a
                       href={concept.url}
                       target="_blank"
                       rel="noopener noreferrer"
                       aria-label="فتح فيديو YouTube في نافذة جديدة"
                       className="group flex min-h-52 flex-col items-center justify-center gap-4 bg-gradient-to-br from-orange-500/15 via-black/50 to-black p-8 text-center transition-colors hover:from-orange-500/25"
                     >
                       <span className="flex h-16 w-16 items-center justify-center rounded-full bg-orange-500 text-white shadow-[0_0_30px_rgba(249,115,22,0.35)] transition-transform group-hover:scale-105">
                         <Play className="h-8 w-8" fill="currentColor" />
                       </span>
                       <span className="inline-flex items-center gap-2 text-orange-300 font-bold font-arabic">
                         فتح فيديو YouTube
                         <ExternalLink className="h-4 w-4" />
                       </span>
                     </a>
                   )}
                   <p className="text-orange-400 text-center p-4 font-arabic font-semibold">{concept.title || 'فيديو'}</p>
                 </div>
               );
             }

             return (
               <a key={idx} href={concept.url} target="_blank" rel="noopener noreferrer" aria-label="فتح رابط خارجي في نافذة جديدة" className="block p-4 bg-black/40 border border-white/10 rounded-2xl hover:border-orange-500/50 transition-colors my-4 group">
                  <span className="text-orange-400 font-bold group-hover:text-orange-300 transition-colors">{concept.title}</span>
                  <span className="block text-gray-400 text-sm mt-1 truncate group-hover:text-gray-300 transition-colors">{concept.url}</span>
               </a>
             );
          }
          return null;
        })}
      </div>
    </div>
  );
}
