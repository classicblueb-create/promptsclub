
import React from 'react';
import { Link } from 'react-router-dom';
import { Card } from '../components/UIComponents';
import { Lightbulb, Wand2, Sparkles, Zap, ArrowRight } from 'lucide-react';

const TIPS = [
  {
    title: "The Power of Negative Prompts",
    description: "Learn how to remove unwanted elements from your AI images by mastering negative prompting.",
    icon: <Zap className="text-purple-500" />,
    color: "from-purple-50 to-white",
    borderColor: "border-purple-100"
  },
  {
    title: "Lighting Mastery",
    description: "Keywords like 'Volumetric lighting', 'Cinematic lighting', and 'Rembrandt lighting' can instantly upgrade your visuals.",
    icon: <Lightbulb className="text-amber-500" />,
    color: "from-amber-50 to-white",
    borderColor: "border-amber-100"
  },
  {
    title: "Style Mixing",
    description: "Try combining conflicting styles like 'Cyberpunk' and 'Victorian Era' to create unique, never-before-seen aesthetics.",
    icon: <Wand2 className="text-rose-500" />,
    color: "from-rose-50 to-white",
    borderColor: "border-rose-100"
  },
  {
    title: "Aspect Ratio Secrets",
    description: "Choosing the right aspect ratio (--ar 16:9 vs 4:5) changes the composition entirely. Match the ratio to the platform.",
    icon: <Sparkles className="text-sky-500" />,
    color: "from-sky-50 to-white",
    borderColor: "border-sky-100"
  }
];

const Tips: React.FC = () => {
  return (
    <div className="max-w-5xl mx-auto animate-in fade-in slide-in-from-bottom-8 duration-700">
      
      <div className="text-center mb-16">
        <div className="inline-flex items-center gap-2 bg-white border border-gray-100 rounded-full px-4 py-1.5 mb-6 shadow-sm">
           <Sparkles className="w-4 h-4 text-pastel-peach" />
           <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Secret Techniques</span>
        </div>
        <h1 className="font-display font-bold text-4xl md:text-5xl text-gray-900 mb-6">
          Unlock the Full Potential <br/>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-pastel-peach to-purple-400">of AI Generation</span>
        </h1>
        <p className="text-gray-500 text-lg max-w-2xl mx-auto leading-relaxed">
          Exclusive tips and tricks to help you write better prompts, control output consistency, and achieve professional results.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {TIPS.map((tip, idx) => (
          <Card key={idx} className={`p-8 bg-gradient-to-br ${tip.color} border ${tip.borderColor} hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group cursor-pointer`}>
             <div className="flex items-start justify-between mb-6">
                <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm border border-gray-50 group-hover:scale-110 transition-transform">
                   {tip.icon}
                </div>
                <div className="w-8 h-8 rounded-full bg-white/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                   <ArrowRight size={16} className="text-gray-400" />
                </div>
             </div>
             <h3 className="font-display font-bold text-xl text-gray-800 mb-3 group-hover:text-purple-600 transition-colors">
               {tip.title}
             </h3>
             <p className="text-gray-600 leading-relaxed">
               {tip.description}
             </p>
          </Card>
        ))}
      </div>

      <div className="mt-16 text-center p-10 bg-gray-50 rounded-[2rem] border border-gray-100">
         <h3 className="font-bold text-xl text-gray-800 mb-2">Want more advanced tricks?</h3>
         <p className="text-gray-500 mb-6">Join our private LINE group for daily updates and deep dives.</p>
         <button className="px-8 py-3 bg-white text-gray-700 font-bold rounded-xl border border-gray-200 hover:bg-gray-100 transition-colors">
            Join Community
         </button>
      </div>

    </div>
  );
};

export default Tips;
