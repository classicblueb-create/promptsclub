
import React, { useState, useEffect, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, ArrowUpRight, Loader2, Sparkles, Zap, Trophy, Layout, Heart, ShieldCheck, Quote, Check, Lock, X } from 'lucide-react';
import { Badge } from '../components/UIComponents';
import { StorageService, Prompt } from '../services/storage';
import { useAuth } from '../context/AuthContext';

const FILTER_TAGS = ['All', 'AI Image', 'AI Video', 'Business', 'Social', 'Writing', 'Vibe'];

const TESTIMONIALS = [
  {
    id: 1,
    name: "Meena",
    text: "น่ารักมาก ขออวดเลยค่ะ",
    role: "Content Creator",
    color: "bg-rose-50 border-rose-100 text-rose-600"
  },
  {
    id: 2,
    name: "Meena",
    text: "น่ารักจริงทำออกมาสวยมาก ต้องเอามาทำกรอบรูปจริงเลย",
    role: "Designer",
    color: "bg-blue-50 border-blue-100 text-blue-600"
  },
  {
    id: 3,
    name: "Beauty",
    text: "199บาทต่อเดือนได้Prompts ทุกวันแถมขอได้อีกคุ้มมากเลยค่ะ",
    role: "Business Owner",
    color: "bg-purple-50 border-purple-100 text-purple-600"
  }
];

const PromptItem: React.FC<{ prompt: Prompt; onClick: () => void }> = ({ prompt, onClick }) => {
  // Defensive check for tags
  const tags = Array.isArray(prompt.tags) ? prompt.tags : [];

  return (
    <div onClick={onClick} className="block group h-full cursor-pointer">
      <div className="relative w-full aspect-[4/5] rounded-[2rem] overflow-hidden transition-all duration-500 hover:-translate-y-3 hover:scale-[1.02] hover:shadow-[0_30px_60px_-15px_rgba(0,0,0,0.15)] border border-white/50 bg-white">
        
        {/* Background Image */}
        <img 
          src={prompt.imageUrl} 
          alt={prompt.title} 
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900/90 via-gray-900/30 to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />
        
        {/* Glass Content Panel */}
        <div className="absolute inset-x-0 bottom-0 p-6 flex flex-col justify-end h-full">
          
          <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500 ease-out">
            {/* Floating Icon */}
            <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500 transform translate-x-2 group-hover:translate-x-0 delay-100">
              <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center text-white shadow-lg">
                <ArrowUpRight size={20} />
              </div>
            </div>

            <div className="flex gap-2 mb-3 flex-wrap">
              {tags.slice(0, 2).map(tag => (
                <span key={tag} className="px-2 py-1 rounded-md bg-white/20 backdrop-blur-sm border border-white/10 text-[10px] font-bold uppercase tracking-wider text-white/90">
                  {tag}
                </span>
              ))}
            </div>
            
            <h3 className="font-display font-bold text-xl md:text-2xl text-white leading-tight mb-2 text-shadow-sm">
              {prompt.title}
            </h3>
            
            <p className="text-sm text-white/80 line-clamp-2 font-light mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
              {prompt.description}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

const TestimonialCard: React.FC<{ item: typeof TESTIMONIALS[0] }> = ({ item }) => (
  <div className={`p-6 rounded-2xl border ${item.color} mb-6 shadow-sm backdrop-blur-sm bg-white/80 hover:shadow-md transition-shadow`}>
    <Quote className={`w-6 h-6 mb-3 opacity-50 ${item.color.split(' ')[2]}`} />
    <p className="text-gray-700 font-medium leading-relaxed mb-4 font-sans">"{item.text}"</p>
    <div className="flex items-center gap-3">
      <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-white shadow-sm bg-gradient-to-br ${
        item.name === 'Meena' ? 'from-rose-400 to-pink-500' : 
        item.name === 'J' ? 'from-blue-400 to-indigo-500' : 'from-purple-400 to-violet-500'
      }`}>
        {item.name.charAt(0)}
      </div>
      <div>
        <h4 className="font-bold text-gray-900 text-sm">{item.name}</h4>
        <span className="text-xs text-gray-400 uppercase tracking-wider">{item.role}</span>
      </div>
    </div>
  </div>
);

const Library: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [search, setSearch] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [loading, setLoading] = useState(true);
  const [showMemberModal, setShowMemberModal] = useState(false);
  
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      const data = await StorageService.getLibrary();
      setPrompts(data);
      setLoading(false);
    };
    loadData();
  }, []);

  const filteredPrompts = useMemo(() => {
    return prompts.filter(p => {
      const matchesSearch = p.title.toLowerCase().includes(search.toLowerCase()) || 
                            p.description.toLowerCase().includes(search.toLowerCase());
      const matchesFilter = activeFilter === 'All' ||
        p.tags.some(tag => tag.toLowerCase() === activeFilter.toLowerCase());
      return matchesSearch && matchesFilter;
    });
  }, [prompts, search, activeFilter]);

  const handlePromptClick = (promptId: string) => {
    if (user) {
      navigate(`/prompt/${promptId}`);
    } else {
      setShowMemberModal(true);
    }
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 space-y-20">
      
      {/* HERO SECTION */}
      <div className="relative w-full max-w-[90rem] mx-auto px-4 md:px-6">
        
        {/* Main Card Container */}
        <div className="relative bg-gradient-to-b from-[#F6F0FF] via-[#FDFDFD] to-white rounded-[3rem] md:rounded-[4rem] p-6 pt-12 md:p-20 overflow-hidden text-center shadow-[0_40px_80px_-20px_rgba(147,51,234,0.07)] border border-white/60">
          
          {/* Soft Glows */}
          <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
            <div className="absolute top-[-20%] left-[20%] w-[500px] h-[500px] bg-pastel-lavender/30 rounded-full blur-[100px] animate-pulse-slow"></div>
            <div className="absolute bottom-[-20%] right-[20%] w-[400px] h-[400px] bg-pastel-peach/20 rounded-full blur-[100px]"></div>
          </div>

          <div className="relative z-10 flex flex-col items-center">
            
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-white/90 backdrop-blur-md border border-purple-100 rounded-full px-5 py-2 mb-6 md:mb-8 shadow-sm hover:shadow-md transition-all cursor-default group">
              <div className="w-6 h-6 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                 <Zap className="w-3 h-3 text-white fill-white" />
              </div>
              <span className="text-xs font-bold text-gray-600 uppercase tracking-wider group-hover:text-purple-600 transition-colors">Pro Collection</span>
              <span className="w-1 h-1 rounded-full bg-gray-300 mx-1"></span>
              <span className="text-xs text-purple-500 font-medium">Updated Daily</span>
            </div>

            {/* Headline */}
            <h1 className="font-display font-bold text-3xl md:text-7xl text-gray-900 tracking-tight mb-6 leading-[1.1]">
              Seamless Prompt Discovery <br className="hidden md:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-pink-500 to-orange-400">
                With Nano Banana
              </span>
            </h1>

            {/* Description */}
            <div className="max-w-2xl mx-auto mb-12 md:mb-16 space-y-4">
              <p className="text-base md:text-xl text-gray-600 font-sans leading-relaxed font-medium">
                คอลเลกชัน Prompts พรีเมียมที่เรา “คัดปรับแต่ง” ให้ใช้งานกับ Gemini ได้แบบไม่ต้องคิดเยอะ
              </p>
              <p className="text-xs md:text-base text-gray-400 font-light tracking-wide px-4">
                พื้นที่สำหรับสมาชิก modty.ai — สร้างงานไวขึ้น 2 เท่าด้วยไอเดียระดับโปร
              </p>
            </div>

            {/* 3D Visual Mockup Area */}
            <div className="relative h-[220px] md:h-[350px] w-full max-w-3xl mx-auto perspective-[1200px] pointer-events-none select-none mb-[-50px] md:mb-[-100px]">
              
              {/* Left Card */}
              <div className="hidden md:flex absolute left-1/2 top-0 w-56 h-72 bg-white rounded-3xl shadow-[0_20px_40px_-12px_rgba(0,0,0,0.1)] border border-gray-100 transform -translate-x-[140%] translate-y-16 -rotate-12 opacity-60 scale-90 z-10 flex-col p-4 origin-bottom-right">
                 <div className="w-full h-32 bg-gradient-to-br from-purple-100 to-white rounded-xl mb-4"></div>
                 <div className="space-y-2">
                   <div className="w-3/4 h-3 bg-gray-100 rounded-full"></div>
                   <div className="w-1/2 h-3 bg-gray-100 rounded-full"></div>
                 </div>
              </div>

              {/* Right Card */}
              <div className="hidden md:flex absolute left-1/2 top-0 w-56 h-72 bg-white rounded-3xl shadow-[0_20px_40px_-12px_rgba(0,0,0,0.1)] border border-gray-100 transform translate-x-[40%] translate-y-16 rotate-12 opacity-60 scale-90 z-10 flex-col p-4 origin-bottom-left">
                 <div className="w-full h-32 bg-gradient-to-br from-pink-100 to-white rounded-xl mb-4"></div>
                 <div className="space-y-2">
                   <div className="w-3/4 h-3 bg-gray-100 rounded-full"></div>
                   <div className="w-1/2 h-3 bg-gray-100 rounded-full"></div>
                 </div>
              </div>

              {/* Center Hero Card */}
              <div className="absolute left-1/2 top-0 w-56 h-72 md:w-72 md:h-96 bg-white rounded-[2.5rem] shadow-[0_50px_100px_-20px_rgba(50,50,93,0.15)] border border-gray-50 transform -translate-x-1/2 z-20 flex flex-col p-5 transition-transform hover:-translate-y-2 duration-500">
                 {/* Card Image Area */}
                 <div className="w-full h-36 md:h-48 bg-gradient-to-br from-pastel-peach via-pastel-lavender to-white rounded-3xl mb-4 md:mb-6 relative overflow-hidden group">
                    <div className="absolute inset-0 bg-white/10 backdrop-blur-[2px]"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                       <div className="w-14 h-14 md:w-16 md:h-16 bg-white/40 rounded-full backdrop-blur-md border border-white/60 flex items-center justify-center shadow-inner animate-pulse-slow">
                          <Sparkles className="w-6 h-6 md:w-8 md:h-8 text-white drop-shadow-md" />
                       </div>
                    </div>
                 </div>
                 {/* Card Content Lines */}
                 <div className="space-y-3 md:space-y-4 px-2">
                    <div className="flex items-center gap-3">
                       <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-gray-50 border border-gray-100"></div>
                       <div className="flex-1 space-y-1">
                          <div className="h-2 md:h-3 bg-gray-100 rounded-full w-full"></div>
                          <div className="h-2 md:h-3 bg-gray-50 rounded-full w-2/3"></div>
                       </div>
                    </div>
                    <div className="pt-2 md:pt-4">
                       <div className="h-8 md:h-10 bg-gray-900 rounded-xl w-full flex items-center justify-center text-white text-[10px] md:text-xs font-bold tracking-wider">
                          GET PROMPT
                       </div>
                    </div>
                 </div>
              </div>

            </div>
          </div>
        </div>

        {/* FLOATING SEARCH BAR */}
        {/* Adjusted margin to mt-4 on mobile to avoid overlap, md:-mt-8 on desktop */}
        <div className="max-w-2xl mx-auto mt-4 md:-mt-8 relative z-30 px-4">
           <div className="bg-white/90 backdrop-blur-xl rounded-3xl p-2 md:p-3 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] border border-white/80 ring-4 md:ring-8 ring-white/40 group hover:ring-white/60 transition-all">
              <div className="relative flex items-center">
                <Search className="absolute left-4 md:left-5 text-purple-400 w-5 h-5 md:w-6 md:h-6 transition-colors group-hover:text-purple-500" />
                <input 
                  type="text"
                  placeholder="Find the right prompt..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-12 md:pl-14 pr-4 md:pr-6 py-3 md:py-4 rounded-2xl bg-transparent text-gray-800 placeholder-gray-400 focus:outline-none text-base md:text-lg font-medium"
                />
                <button className="hidden md:block bg-gray-900 text-white px-8 py-3.5 rounded-xl font-medium hover:bg-gray-800 transition-all active:scale-95 shadow-lg shadow-gray-900/20">
                  Search
                </button>
              </div>
           </div>
           
           {/* Filters */}
           <div className="flex flex-wrap justify-center gap-2 mt-6 md:mt-8">
              {FILTER_TAGS.map(tag => (
                <Badge 
                  key={tag} 
                  active={activeFilter === tag} 
                  onClick={() => setActiveFilter(tag)}
                  color={activeFilter === tag ? 'lavender' : 'gray'}
                >
                  {tag}
                </Badge>
              ))}
           </div>
        </div>
      </div>

      {/* GRID SECTION */}
      {/* Added mt-16 to push it down properly */}
      <div className="max-w-6xl mx-auto px-4 mt-16 md:mt-24">
        <div className="flex items-end justify-between mb-8 px-2">
           <div className="space-y-1">
              <h2 className="font-display font-bold text-2xl md:text-3xl text-gray-800">Latest Arrivals</h2>
              <p className="text-gray-400 text-sm">Fresh ideas for your next project</p>
           </div>
           <div className="hidden md:block text-sm font-medium text-purple-500 cursor-pointer hover:text-purple-600">
              View All Prompts →
           </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center min-h-[200px]">
            <Loader2 className="w-10 h-10 animate-spin text-pastel-lavender" />
          </div>
        ) : filteredPrompts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPrompts.map(prompt => (
              <PromptItem key={prompt.id} prompt={prompt} onClick={() => handlePromptClick(prompt.id)} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
               <Search className="w-8 h-8 text-gray-300" />
            </div>
            <h3 className="text-lg font-bold text-gray-600">No prompts found</h3>
            <p className="text-gray-400">Try adjusting your search or filters.</p>
          </div>
        )}
      </div>

      {/* WHY CHOOSE US SECTION */}
      {/* Increased mb to 40 (approx 15cm space feel) */}
      <div className="relative w-full max-w-6xl mx-auto px-4 pb-8 pt-10 mb-40 md:mb-56 overflow-hidden md:overflow-visible">
        <div className="text-center mb-8 md:mb-16 relative z-10">
           <div className="inline-flex items-center gap-2 bg-white border border-gray-100 rounded-full px-4 py-1.5 mb-6 shadow-sm animate-in fade-in slide-in-from-bottom-2 duration-1000">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Why Choose Us</span>
           </div>
           <h2 className="font-display font-bold text-3xl md:text-5xl text-gray-800 mb-4 tracking-tight leading-tight">
             Designed Around Your <br />
             <span className="text-transparent bg-clip-text bg-gradient-to-r from-pastel-peach to-purple-400">Creative Lifestyle</span>
           </h2>
        </div>

        {/* Floating Elements Composition */}
        <div className="relative h-auto md:h-[400px] w-full max-w-4xl mx-auto perspective-[1000px] flex flex-col gap-4 items-center md:block">
           
           {/* Badge 1: Left - Request Feature */}
           <div className="md:absolute md:top-0 md:left-[15%] z-10 animate-float">
             <div className="transform md:-rotate-6 hover:rotate-0 transition-transform duration-500 scale-90 md:scale-100">
               <div className="bg-gradient-to-r from-purple-50 to-white border border-purple-100 p-3 pr-6 rounded-full flex items-center gap-3 shadow-[0_10px_30px_-10px_rgba(168,85,247,0.2)] hover:shadow-purple-200/50 transition-shadow backdrop-blur-sm">
                  <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm text-purple-500 font-bold text-xs border border-purple-50">03</div>
                  <span className="text-purple-900 font-medium font-sans text-sm md:text-base">ขอ Prompt พิเศษได้!</span>
               </div>
             </div>
           </div>

           {/* Badge 2: Right - Updates */}
           <div className="md:absolute md:top-12 md:right-[5%] lg:right-[15%] z-20 animate-float-delayed">
             <div className="transform md:rotate-3 hover:rotate-0 transition-transform duration-500 scale-90 md:scale-100">
               <div className="bg-gradient-to-r from-indigo-50 to-white border border-indigo-100 p-3 pl-6 rounded-full flex items-center gap-3 shadow-[0_10px_30px_-10px_rgba(99,102,241,0.2)] hover:shadow-indigo-200/50 transition-shadow backdrop-blur-sm">
                  <span className="text-indigo-900 font-medium font-sans text-sm md:text-base">หลากหลายแนว อัพเดททุกวัน</span>
                  <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm text-indigo-500 font-bold text-xs border border-indigo-50">02</div>
               </div>
             </div>
           </div>

           {/* Badge 3: Center - Quality */}
           <div className="md:absolute md:top-32 md:left-1/2 md:transform md:-translate-x-1/2 z-30 w-auto animate-float">
             <div className="transform md:-rotate-2 hover:rotate-0 hover:scale-105 transition-all duration-500 origin-center scale-90 md:scale-100">
               <div className="bg-gradient-to-r from-sky-50 to-white border border-sky-100 p-4 pr-6 rounded-full flex items-center gap-4 shadow-[0_20px_40px_-10px_rgba(14,165,233,0.15)] hover:shadow-sky-200/40 transition-shadow backdrop-blur-md min-w-[280px] md:min-w-[400px] justify-between">
                  <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm text-sky-500 border border-sky-50 shrink-0">
                     <Trophy size={22} className="fill-sky-100" />
                  </div>
                  <span className="text-sky-900 font-sans font-semibold text-sm md:text-xl tracking-tight text-center md:text-left flex-1 px-2">
                    ได้ Prompt สวยพร้อมใช้ไม่เหมือนใคร
                  </span>
                  <div className="w-8 h-8 bg-sky-100/50 rounded-full flex items-center justify-center text-sky-700 font-bold text-[10px] shrink-0">01</div>
               </div>
             </div>
           </div>

           {/* Badge 4: Left - Loved By Creators */}
           {/* Adjusted to top-28 to close gap */}
           <div className="md:absolute md:top-28 md:left-[8%] lg:left-[12%] z-20 animate-float-delayed" style={{ animationDelay: '1s' }}>
             <div className="transform md:rotate-2 hover:rotate-0 transition-transform duration-500 scale-90 md:scale-100">
               <div className="bg-gradient-to-r from-rose-50 to-white border border-rose-100 p-3 px-6 rounded-full flex items-center gap-3 shadow-[0_10px_30px_-10px_rgba(244,63,94,0.2)] hover:shadow-rose-200/50 transition-shadow backdrop-blur-sm">
                  <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm text-rose-500 font-bold text-xs border border-rose-50">
                    04
                  </div>
                  <span className="text-rose-900 font-medium font-sans text-sm md:text-base">Loved By Creators ❤️</span>
               </div>
             </div>
           </div>

        </div>
      </div>

      {/* TESTIMONIALS SECTION */}
      <div className="relative w-full bg-transparent py-24 overflow-hidden">
        <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row gap-12">
          
          {/* Text Side */}
          <div className="md:w-1/3 relative z-10">
            <div className="inline-flex items-center gap-2 bg-white border border-gray-200 rounded-full px-4 py-1.5 mb-6 shadow-sm">
              <div className="w-2 h-2 rounded-full bg-rose-400 animate-pulse"></div>
              <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Community</span>
            </div>
            <h2 className="font-display font-bold text-4xl md:text-5xl text-gray-900 mb-6 leading-tight">
              What Our Users <br/>
              Are Saying
            </h2>
            <p className="text-gray-500 leading-relaxed mb-8">
              From daily readers to curious minds—hear how our AI-powered prompt app is changing the way people discover and enjoy content.
            </p>
          </div>

          {/* Marquee Columns Side */}
          <div className="md:w-2/3 relative h-[400px] md:h-[500px] overflow-hidden [mask-image:linear-gradient(to_bottom,transparent,black_10%,black_90%,transparent)]">
             
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
               <div className="animate-scroll-up">
                  {[...TESTIMONIALS, ...TESTIMONIALS, ...TESTIMONIALS].map((item, idx) => (
                    <TestimonialCard key={`col1-${idx}`} item={item} />
                  ))}
               </div>
               <div className="hidden md:block animate-scroll-up" style={{ animationDelay: '-5s' }}>
                  {[...TESTIMONIALS, ...TESTIMONIALS, ...TESTIMONIALS].reverse().map((item, idx) => (
                    <TestimonialCard key={`col2-${idx}`} item={item} />
                  ))}
               </div>
               <div className="hidden lg:block animate-scroll-up" style={{ animationDelay: '-10s' }}>
                  {[...TESTIMONIALS, ...TESTIMONIALS, ...TESTIMONIALS].map((item, idx) => (
                    <TestimonialCard key={`col3-${idx}`} item={item} />
                  ))}
               </div>
             </div>
          </div>

        </div>
      </div>

      {/* MEMBERSHIP & CONTACT SECTION */}
      <div className="max-w-6xl mx-auto px-4 pb-20">
        <div className="flex flex-col md:flex-row gap-6 overflow-x-auto snap-x snap-mandatory md:overflow-visible pb-4 md:pb-0">
          
          {/* Card 1: Membership (Wide) */}
          <div className="flex-none w-[90%] md:w-auto flex-1 bg-gradient-to-br from-[#F4F0FF] to-[#EBE5FF] rounded-[2.5rem] p-8 md:p-10 relative overflow-hidden border border-purple-100 group snap-center">
             <div className="absolute top-0 right-0 w-96 h-96 bg-white/40 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none"></div>
             
             <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
                <div className="flex-1 space-y-6 text-center md:text-left">
                   <div>
                     <span className="inline-block py-1 px-3 rounded-full bg-purple-100 text-purple-600 text-xs font-bold tracking-wider uppercase mb-3">
                       Premium Plan
                     </span>
                     <h3 className="font-display font-bold text-3xl md:text-4xl text-gray-900 leading-tight">
                       สมัครสมาชิก <br/>
                       <span className="text-purple-600">199 THB</span> / เดือน
                     </h3>
                   </div>
                   
                   <ul className="space-y-3 text-left mx-auto md:mx-0 max-w-sm">
                      {[
                        "ส่ง Prompts สวยๆพร้อมใช้ทุกวัน 4 Prompts",
                        "หลากหลายแนวผสมกัน",
                        "รีเควสพิเศษได้ 2 ครั้ง/สัปดาห์ (ครั้งละไม่เกิน 3 Prompts)",
                        "แนะนำทริคพิเศษในการสร้างภาพด้วย Gemini",
                        "เข้ากลุ่มไลน์อัพเดทไว"
                      ].map((benefit, i) => (
                        <li key={i} className="flex items-start gap-3">
                          <div className="w-5 h-5 rounded-full bg-white flex items-center justify-center shrink-0 mt-0.5 shadow-sm">
                            <Check className="w-3 h-3 text-purple-600" />
                          </div>
                          <span className="text-gray-700 font-medium text-sm">{benefit}</span>
                        </li>
                      ))}
                   </ul>

                   <div className="pt-4 h-14 flex justify-center md:justify-start">
                     <a 
                       href="#" 
                       className="group/btn relative flex items-center h-14 rounded-2xl transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] w-14 hover:w-48 bg-white/40 hover:bg-[#0F172A] border border-white/60 hover:border-transparent backdrop-blur-md shadow-sm hover:shadow-xl hover:shadow-purple-900/20 overflow-hidden"
                     >
                       <div className="absolute inset-0 flex items-center justify-center group-hover/btn:opacity-0 transition-opacity duration-300 delay-100">
                          <ArrowUpRight className="w-6 h-6 text-gray-800" />
                       </div>
                       <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300 delay-75 min-w-full px-2">
                          <span className="text-white font-bold text-sm whitespace-nowrap mr-2">สมัครเลย (Stripe)</span>
                          <ArrowUpRight className="w-4 h-4 text-white" />
                       </div>
                     </a>
                   </div>
                </div>

                {/* Visual Mockup: 3D Illustration */}
                <div className="w-full md:w-[280px] aspect-[3/4] relative hidden md:flex items-center justify-center group/image">
                   <div className="relative w-full h-full transform transition-transform duration-700 group-hover/image:scale-105 group-hover/image:rotate-1">
                      <img 
                        src="https://images.unsplash.com/photo-1633356122544-f134324a6cee?q=80&w=800&auto=format&fit=crop" 
                        alt="3D Abstract" 
                        className="w-full h-full object-cover rounded-3xl shadow-[0_20px_50px_-12px_rgba(147,51,234,0.2)]"
                      />
                      <div className="absolute -bottom-4 -right-4 w-16 h-16 bg-white rounded-2xl shadow-xl flex items-center justify-center animate-float" style={{ animationDuration: '4s' }}>
                          <Sparkles className="text-purple-500 w-8 h-8 fill-purple-200" />
                      </div>
                   </div>
                </div>
             </div>
          </div>

          {/* Card 2: Contact */}
          <div className="flex-none w-[90%] md:w-1/3 bg-gradient-to-br from-[#F0FAFF] to-[#E0F5FF] rounded-[2.5rem] p-8 md:p-10 flex flex-col justify-between border border-sky-100 text-center md:text-left group snap-center">
             <div>
                <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-sm mb-6 mx-auto md:mx-0 text-3xl transform group-hover:scale-110 transition-transform duration-300">
                  💬
                </div>
                <h3 className="font-display font-bold text-2xl text-gray-900 mb-3">
                  ติดต่อสอบถาม
                </h3>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  มีข้อสงสัย หรือต้องการคำแนะนำเพิ่มเติม? <br/>
                  ทักไลน์หาเราได้เลย
                </p>
             </div>
             
             <div className="mt-4">
                <a 
                  href="https://line.me" 
                  target="_blank" 
                  rel="noreferrer" 
                  className="flex items-center justify-center w-full bg-[#06C755] text-white px-6 py-4 rounded-xl font-bold hover:bg-[#05b54b] hover:shadow-lg hover:shadow-green-200 transition-all"
                >
                  Add Line Friend
                </a>
             </div>
          </div>

        </div>
      </div>

      {/* Member Only Modal */}
      {showMemberModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-white/10 backdrop-blur-sm transition-opacity" onClick={() => setShowMemberModal(false)}></div>
          <div className="relative bg-white/80 backdrop-blur-xl border border-white/50 rounded-3xl p-8 max-w-sm w-full shadow-[0_20px_50px_-12px_rgba(0,0,0,0.25)] animate-in zoom-in-95 duration-300">
             
             <button 
               onClick={() => setShowMemberModal(false)} 
               className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-full hover:bg-gray-100"
             >
               <X size={20} />
             </button>

             <div className="text-center space-y-6">
               <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto shadow-inner">
                 <Lock className="w-8 h-8 text-red-400" />
               </div>
               
               <div className="space-y-2">
                 <h3 className="text-xl font-display font-bold text-gray-900">Member Only</h3>
                 <p className="text-gray-500 leading-relaxed text-sm px-2">
                   สำหรับสมาชิกเท่านั้น สนใจกรุณาสมัครสมาชิก
                 </p>
               </div>
               
               <div className="space-y-3 pt-2">
                  <a 
                    href="#" 
                    className="flex items-center justify-center gap-2 w-full py-3.5 px-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-bold shadow-lg shadow-purple-500/20 hover:shadow-purple-500/30 hover:scale-[1.02] transition-all"
                  >
                     สมัครสมาชิก (รายเดือน) <ArrowUpRight size={16} />
                  </a>
                  <button 
                    onClick={() => navigate('/login')} 
                    className="block w-full py-3.5 px-4 bg-gray-50 text-gray-700 rounded-xl font-bold hover:bg-gray-100 border border-gray-200 transition-all"
                  >
                     เข้าสู่ระบบ
                  </button>
               </div>
             </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Library;
