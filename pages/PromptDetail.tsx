
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Copy, Check, Sparkles, Loader2 } from 'lucide-react';
import { Button, Badge } from '../components/UIComponents';
import { StorageService, Prompt } from '../services/storage';

const PromptDetail: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [prompt, setPrompt] = useState<Prompt | undefined>(undefined);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const fetchPrompt = async () => {
      if (id) {
        setLoading(true);
        const found = await StorageService.getPromptById(id);
        if (found) {
          setPrompt(found);
        } else {
          navigate('/');
        }
        setLoading(false);
      }
    };
    fetchPrompt();
  }, [id, navigate]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
         <Loader2 className="w-8 h-8 animate-spin text-pastel-peach" />
      </div>
    );
  }

  if (!prompt) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(prompt.fullPrompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Defensive check for tags
  const tags = Array.isArray(prompt.tags) ? prompt.tags : [];

  return (
    <div className="max-w-5xl mx-auto animate-in fade-in zoom-in-95 duration-500">
      <button 
        onClick={() => navigate(-1)} 
        className="mb-6 flex items-center text-gray-500 hover:text-pastel-peach transition-colors group"
      >
        <div className="w-8 h-8 rounded-full bg-white shadow-sm flex items-center justify-center mr-2 group-hover:scale-110 transition-transform">
          <ArrowLeft size={16} />
        </div>
        <span className="font-medium">Back to Library</span>
      </button>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
        
        {/* Left Column: Image */}
        <div className="relative group">
          {/* Adjusted Radiance/Glow: Softer, centered */}
          <div className="absolute -inset-2 bg-gradient-to-tr from-pastel-peach via-white/50 to-pastel-lavender rounded-[2.5rem] opacity-60 blur-2xl group-hover:opacity-80 transition-all duration-700"></div>
          
          <div className="relative aspect-[4/5] rounded-[2rem] overflow-hidden shadow-2xl border-4 border-white/50 bg-white">
            <img 
              src={prompt.imageUrl} 
              alt={prompt.title} 
              className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
            />
          </div>
        </div>

        {/* Right Column: Content */}
        <div className="flex flex-col justify-center space-y-8">
          
          {/* Header Info */}
          <div className="space-y-4">
            <div className="flex flex-wrap gap-2">
              {tags.map(tag => (
                <Badge key={tag} color="peach">{tag}</Badge>
              ))}
            </div>
            
            <h1 className="font-display font-bold text-4xl md:text-5xl text-gray-800 leading-tight">
              {prompt.title}
            </h1>
            <p className="text-lg text-gray-500 font-light leading-relaxed">
              {prompt.description}
            </p>
          </div>

          {/* Prompt Box */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm font-bold text-gray-400 uppercase tracking-widest">
              <Sparkles size={14} className="text-pastel-peach" />
              The Prompt
            </div>
            
            <div className="glass-panel rounded-2xl p-6 md:p-8 relative group hover:shadow-md transition-shadow border border-white/60 bg-white/40">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-pastel-peach to-pastel-lavender opacity-50 rounded-t-2xl"></div>
              <p className="font-mono text-gray-700 text-base leading-loose selection:bg-pastel-peach/30">
                {prompt.fullPrompt}
              </p>
            </div>
          </div>

          {/* Action */}
          <div className="pt-2">
            <Button 
              onClick={handleCopy}
              variant="primary"
              className={`w-full md:w-auto py-4 px-8 text-lg shadow-xl shadow-pastel-peach/20 ${copied ? '!bg-gradient-to-r !from-emerald-400 !to-emerald-500' : ''}`}
            >
              {copied ? (
                <>
                  <Check className="mr-2" /> Copied to Clipboard
                </>
              ) : (
                <>
                  <Copy className="mr-2" /> Copy Prompt
                </>
              )}
            </Button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default PromptDetail;
