import { motion } from 'framer-motion';
import { contentRepository } from '../services/content/contentRepository';
import { User, Users, Info, ChevronLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function AboutPlatform() {
  const navigate = useNavigate();
  const platformData = contentRepository.getPlatform();
  
  if (!platformData) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center text-white">
        <p>جاري تحميل البيانات...</p>
      </div>
    );
  }

  // Extracting data dynamically from generic blocks
  const blocks = platformData.sections[0]?.blocks || [];
  
  // Based on the generated JSON structure
  const researcherName = blocks.find(b => b.content === 'أيه محمد عنتر على')?.content || 'أيه محمد عنتر على';
  const supervisor1 = blocks.find(b => b.content?.includes('الغريب زاهر إسماعيل'))?.content || 'أ.د / الغريب زاهر إسماعيل';
  const supervisor1Title = blocks.find(b => b.content?.includes('أستاذ تكنولوجيا التعليم بكلية التربية جامعة المنصورة'))?.content || '';
  const supervisor2 = blocks.find(b => b.content?.includes('رشا حمدى حسن هداية'))?.content || 'أ.د / رشا حمدى حسن هداية';
  const supervisor2Title = blocks.find(b => b.content === 'استاذ تكنولوجيا التعليم' || b.content?.includes('كلية التربية'))?.content || '';
  const description = blocks.find(b => b.content?.includes('بيئة تدريب شخصية قائمة على تطبيقات الذكاء الاصطناعي'))?.content || '';

  return (
    <div className="min-h-screen bg-black text-white p-6 md:p-12 font-arabic selection:bg-orange-500/30 overflow-hidden relative" dir="rtl">
      {/* Dynamic Background Effects */}
      <div className="absolute top-0 inset-x-0 h-64 bg-gradient-to-b from-orange-500/10 to-transparent pointer-events-none" />
      <div className="absolute -top-32 -right-32 w-96 h-96 bg-orange-600/20 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute top-1/2 -left-32 w-80 h-80 bg-orange-500/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-4xl mx-auto relative z-10">
        <button 
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-gray-400 hover:text-orange-400 transition-colors mb-8 group"
        >
          <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform rotate-180" />
          <span>العودة للرئيسية</span>
        </button>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-orange-400 to-orange-600 mb-4">
            عن المنصة
          </h1>
          <p className="text-gray-400 text-lg">منصة تفاعلية قائمة على تطبيقات الذكاء الاصطناعي</p>
        </motion.div>

        {/* Researcher Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="glass-orange rounded-3xl p-8 mb-12 text-center relative overflow-hidden group"
        >
          <div className="absolute inset-0 bg-gradient-to-b from-orange-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <div className="w-20 h-20 bg-orange-500/20 rounded-full flex items-center justify-center mx-auto mb-4 border border-orange-500/30">
            <User className="w-10 h-10 text-orange-400" />
          </div>
          <h2 className="text-sm text-orange-400 uppercase tracking-wider mb-2 font-semibold">إعداد الباحثة</h2>
          <h3 className="text-2xl font-bold text-white mb-2">{researcherName}</h3>
          <p className="text-gray-400 max-w-2xl mx-auto leading-relaxed">
            للحصول على درجة الدكتوراه في التربية تخصص تكنولوجيا التعليم
          </p>
        </motion.div>

        {/* Supervisors Pyramid */}
        <div className="text-center mb-16">
          <div className="inline-block relative w-full">
            <h2 className="text-xl font-bold text-gray-300 mb-8 flex items-center justify-center gap-3">
              <Users className="w-6 h-6 text-orange-500" />
              <span>إشراف</span>
            </h2>
            
            <div className="grid md:grid-cols-2 gap-6 relative">
              {/* Decorative connecting lines for pyramid effect on desktop */}
              <div className="hidden md:block absolute top-0 left-1/4 right-1/4 h-px bg-gradient-to-r from-transparent via-orange-500/50 to-transparent -translate-y-4" />
              <div className="hidden md:block absolute top-0 left-1/4 w-px h-4 bg-orange-500/50 -translate-y-4" />
              <div className="hidden md:block absolute top-0 right-1/4 w-px h-4 bg-orange-500/50 -translate-y-4" />

              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="glass-card rounded-2xl p-6 hover:border-orange-500/30 transition-colors"
              >
                <h4 className="text-xl font-bold text-orange-400 mb-3">{supervisor1}</h4>
                <p className="text-sm text-gray-400 leading-relaxed">{supervisor1Title}</p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="glass-card rounded-2xl p-6 hover:border-orange-500/30 transition-colors"
              >
                <h4 className="text-xl font-bold text-orange-400 mb-3">{supervisor2}</h4>
                <p className="text-sm text-gray-400 leading-relaxed">{supervisor2Title}<br/>كلية التربية جامعة المنصورة</p>
              </motion.div>
            </div>
          </div>
        </div>

        {/* Description Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="glass-card rounded-3xl p-8 md:p-10"
        >
          <div className="flex items-center gap-3 mb-6">
            <Info className="w-6 h-6 text-orange-500" />
            <h3 className="text-2xl font-bold">عن الدراسة</h3>
          </div>
          <div className="space-y-4">
            <div className="flex items-start gap-4 p-4 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors">
              <div className="w-2 h-2 rounded-full bg-orange-500 mt-2 shrink-0" />
              <p className="text-gray-300 leading-relaxed text-lg">{description}</p>
            </div>
            <div className="flex items-start gap-4 p-4 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors">
              <div className="w-2 h-2 rounded-full bg-orange-500 mt-2 shrink-0" />
              <p className="text-gray-300 leading-relaxed text-lg">
                تهدف المنصة إلى تنمية مهارات التحول الرقمي المهنية والتقبل التكنولوجي لدي القيادات التعليمية من خلال بيئة تدريب شخصية.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
