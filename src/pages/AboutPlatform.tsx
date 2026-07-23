import { motion } from 'framer-motion';
import { contentRepository } from '../services/content/contentRepository';
import { Users, Info, ChevronLeft, Target, ShieldCheck } from 'lucide-react';
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
  const supervisor1Title = blocks.find(b => b.content?.includes('أستاذ تكنولوجيا التعليم بكلية التربية جامعة المنصورة'))?.content || 'أستاذ تكنولوجيا التعليم بكلية التربية جامعة المنصورة';
  const description = blocks.find(b => b.content?.includes('بيئة تدريب شخصية قائمة على تطبيقات الذكاء الاصطناعي'))?.content || 'بيئة تدريب شخصية قائمة على تطبيقات الذكاء الاصطناعي لتنمية مهارات التحول الرقمي المهنية والتقبل التكنولوجي لدي القيادات التعليمية';

  return (
    <div className="relative p-6 md:p-12">
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
          <h1 className="text-4xl md:text-5xl font-bold text-orange-500 mb-4 py-2 drop-shadow-md">
            عن المنصة
          </h1>
          <p className="text-gray-400 text-lg">منصة تفاعلية قائمة على تطبيقات الذكاء الاصطناعي</p>
        </motion.div>

        {/* Researcher Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="glass-orange rounded-3xl p-8 mb-12 text-center relative overflow-hidden group border border-orange-500/30"
        >
          <div className="absolute inset-0 bg-gradient-to-b from-orange-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <div className="w-32 h-32 rounded-full mx-auto mb-4 p-1 border-2 border-orange-500/30 shadow-[0_0_20px_rgba(249,115,22,0.2)] overflow-hidden relative">
            <img src="/team/3.jpeg" alt={researcherName} className="w-full h-full object-cover rounded-full" />
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
              <div className="hidden md:block absolute top-0 left-1/4 right-1/4 h-px bg-gradient-to-r from-transparent via-orange-500/50 to-transparent -translate-y-4" />
              <div className="hidden md:block absolute top-0 left-1/4 w-px h-4 bg-orange-500/50 -translate-y-4" />
              <div className="hidden md:block absolute top-0 right-1/4 w-px h-4 bg-orange-500/50 -translate-y-4" />

              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="glass-card rounded-2xl p-6 hover:border-orange-500/30 transition-colors border border-white/10 flex flex-col items-center text-center"
              >
                <div className="w-24 h-24 rounded-full mb-4 p-1 border-2 border-orange-500/20 shadow-[0_0_15px_rgba(255,255,255,0.05)] overflow-hidden relative">
                  <img src="/team/1.jpeg" alt={supervisor1} className="w-full h-full object-cover rounded-full" />
                </div>
                <h4 className="text-xl font-bold text-orange-400 mb-3">{supervisor1}</h4>
                <p className="text-sm text-gray-400 leading-relaxed">{supervisor1Title}</p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="glass-card rounded-2xl p-6 hover:border-orange-500/30 transition-colors border border-white/10 flex flex-col items-center text-center"
              >
                <div className="w-24 h-24 rounded-full mb-4 p-1 border-2 border-orange-500/20 shadow-[0_0_15px_rgba(255,255,255,0.05)] overflow-hidden relative">
                  <img src="/team/2.jpeg" alt="أ.د / رشا هدية" className="w-full h-full object-cover rounded-full" />
                </div>
                <h4 className="text-xl font-bold text-orange-400 mb-3">أ.د / رشا حمدي حسن هداية</h4>
                <p className="text-sm text-gray-400 leading-relaxed">أستاذ تكنولوجيا التعليم بكلية التربية النوعية جامعة المنصورة</p>
              </motion.div>
            </div>
          </div>
        </div>

        {/* Study Details */}
        <div className="space-y-6 mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="glass p-8 rounded-3xl border border-white/10 hover:border-orange-500/30 transition-all bg-white/[0.02]"
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-blue-500/20 rounded-xl text-blue-400">
                <Info className="w-6 h-6" />
              </div>
              <h2 className="text-2xl font-bold text-white">عن الدراسة</h2>
            </div>
            <p className="text-gray-300 leading-relaxed text-lg">
              {description}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="glass p-8 rounded-3xl border border-white/10 hover:border-orange-500/30 transition-all bg-white/[0.02]"
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-green-500/20 rounded-xl text-green-400">
                <Target className="w-6 h-6" />
              </div>
              <h2 className="text-2xl font-bold text-white">أهداف المنصة</h2>
            </div>
            <p className="text-gray-300 leading-relaxed text-lg">
              تهدف هذه المنصة إلى تنمية مهارات التحول الرقمي المهنية والتقبل التكنولوجي لدى القيادات التعليمية من خلال مسار تعليمي متكامل يتضمن وحدات تدريبية، تقييمات، وأنشطة تفاعلية مدعومة بتقنيات الذكاء الاصطناعي.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="glass p-8 rounded-3xl border border-white/10 hover:border-orange-500/30 transition-all bg-white/[0.02]"
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-purple-500/20 rounded-xl text-purple-400">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h2 className="text-2xl font-bold text-white">الفئة المستهدفة</h2>
            </div>
            <p className="text-gray-300 leading-relaxed text-lg">
              القيادات التعليمية بوزارة التربية والتعليم، بما في ذلك مديري المدارس، والمشرفين التربويين، ورؤساء الأقسام.
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
