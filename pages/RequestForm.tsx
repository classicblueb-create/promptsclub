
import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { UploadCloud, X, Sparkles, AlertCircle, Send, Lock, ArrowUpRight } from 'lucide-react';
import { Card, Button } from '../components/UIComponents';
import { StorageService } from '../services/storage';
import { refineDescription } from '../services/gemini';
import { useAuth } from '../context/AuthContext';
import emailjs from '@emailjs/browser';

const RequestForm: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [lineName, setLineName] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [description, setDescription] = useState('');
  const [images, setImages] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [userStats, setUserStats] = useState({ remainingWeeklySubmissions: 2, limitReached: false });
  const [showMemberModal, setShowMemberModal] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // EmailJS Configuration
  const EMAILJS_SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID || 'service_g4ge30w';
  const EMAILJS_TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID || 'template_wbk3m9b';
  const EMAILJS_PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY || 'jLVAD7U7D5ODkbZxi';

  // Load stats when name changes
  useEffect(() => {
    const stats = StorageService.getUserStats(lineName);
    setUserStats(stats);
  }, [lineName]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      if (images.length + files.length > 5) {
        alert("Maximum 5 images allowed.");
        return;
      }

      files.forEach(file => {
        const reader = new FileReader();
        reader.onloadend = () => {
          setImages(prev => [...prev, reader.result as string]);
        };
        reader.readAsDataURL(file as Blob);
      });
    }
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleAiPolish = async () => {
    if (!description.trim()) return;
    setAiLoading(true);
    const refined = await refineDescription(description);
    setDescription(refined);
    setAiLoading(false);
  };

  const sendEmailNotification = async (requestData: any) => {
    try {
      console.log("Sending email notification...");
      await emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        {
          to_name: "Admin", // Variable in EmailJS template
          from_name: requestData.lineName,
          message: requestData.description,
          quantity: requestData.quantity,
          image_count: requestData.imageUrls.length,
        },
        EMAILJS_PUBLIC_KEY
      );
      console.log('Email notification sent successfully!');
    } catch (error) {
      console.error('Failed to send email notification:', error);
      // We log the error but do not throw it, so the user flow isn't interrupted
      // after a successful database save.
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // 1. Check Auth First
    if (!user) {
      setShowMemberModal(true);
      return;
    }

    if (!lineName.trim() || !description.trim()) {
      alert("Please fill in all required fields.");
      return;
    }

    if (userStats.limitReached) {
      alert("You have reached your weekly submission limit.");
      return;
    }

    setLoading(true);
    
    try {
        // 2. Save to Database (Supabase)
        await StorageService.saveRequest({
            lineName,
            quantity,
            description,
            imageUrls: images
        });

        // 3. Send Email Notification (Non-blocking)
        await sendEmailNotification({
            lineName,
            quantity,
            description,
            imageUrls: images
        });

        // 4. Redirect to Success Page
        setLoading(false);
        navigate('/success', { state: { lineName } });

    } catch (error: any) {
        console.error("Submission error:", error);
        setLoading(false);
        
        const errorMessage = error.message || "Unknown error occurred";
        
        // Specific error message for RLS/Permission issues
        if (errorMessage.includes('policy') || errorMessage.includes('permission')) {
           alert("Access Denied: You may need to log in to submit a request, or the database policy restricts this action.");
        } else {
           alert(`Failed to save request: ${errorMessage}`);
        }
    }
  };

  return (
    <div className="max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom-8 duration-700 relative">
      <div className="text-center mb-8">
        <h1 className="font-display font-bold text-3xl text-gray-800 mb-2">Request a Prompt</h1>
        <p className="text-gray-500">Let our engineers craft the perfect prompt for you.</p>
      </div>

      <Card className="p-6 md:p-10 bg-white/80">
        <form onSubmit={handleSubmit} className="space-y-8">
          
          {/* LINE Name */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700 uppercase tracking-wide">LINE Account Name</label>
            <input 
              type="text"
              value={lineName}
              onChange={(e) => setLineName(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-white border border-gray-200 focus:ring-2 focus:ring-pastel-peach/50 focus:border-transparent outline-none transition-all"
              placeholder="@username"
              required
            />
            {lineName && (
               <div className={`text-xs flex items-center gap-1 ${userStats.limitReached ? 'text-red-400' : 'text-emerald-500'}`}>
                 <AlertCircle size={12} />
                 {userStats.remainingWeeklySubmissions} submissions remaining this week.
               </div>
            )}
          </div>

          {/* Quantity */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700 uppercase tracking-wide">Number of Prompts</label>
            <div className="flex gap-4">
              {[1, 2, 3].map(num => (
                <button
                  key={num}
                  type="button"
                  onClick={() => setQuantity(num)}
                  className={`flex-1 py-3 rounded-xl border transition-all font-medium ${
                    quantity === num 
                    ? 'bg-pastel-peach text-white border-pastel-peach shadow-lg shadow-pastel-peach/30' 
                    : 'bg-gray-50 text-gray-500 border-gray-200 hover:bg-gray-100'
                  }`}
                >
                  {num}
                </button>
              ))}
            </div>
            <p className="text-xs text-gray-400 text-right">Max 2 submissions/week, up to 8/month.</p>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <div className="flex justify-between items-end">
              <label className="text-sm font-semibold text-gray-700 uppercase tracking-wide">Description</label>
              <button 
                type="button"
                onClick={handleAiPolish}
                disabled={aiLoading || !description}
                className="text-xs text-purple-500 hover:text-purple-700 flex items-center gap-1 disabled:opacity-50 transition-colors"
              >
                <Sparkles size={12} /> 
                {aiLoading ? 'Polishing...' : 'AI Polish'}
              </button>
            </div>
            <textarea 
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-white border border-gray-200 focus:ring-2 focus:ring-pastel-peach/50 focus:border-transparent outline-none transition-all min-h-[120px]"
              placeholder="Describe exactly what you want. E.g., 'A futuristic city with flying cars in the style of 80s anime...'"
              required
            />
          </div>

          {/* Image Upload */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700 uppercase tracking-wide">Reference Images (Optional)</label>
            <div 
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-gray-300 rounded-xl p-6 flex flex-col items-center justify-center cursor-pointer hover:border-pastel-peach hover:bg-pastel-peach/5 transition-all group"
            >
              <UploadCloud className="w-8 h-8 text-gray-400 group-hover:text-pastel-peach mb-2 transition-colors" />
              <p className="text-sm text-gray-500 group-hover:text-gray-700">Click to upload references (Max 5)</p>
              <input 
                type="file" 
                ref={fileInputRef} 
                className="hidden" 
                multiple 
                accept="image/*"
                onChange={handleImageUpload}
              />
            </div>
            
            {/* Preview Grid */}
            {images.length > 0 && (
              <div className="grid grid-cols-5 gap-2 mt-4">
                {images.map((img, idx) => (
                  <div key={idx} className="relative aspect-square rounded-lg overflow-hidden group border border-gray-200">
                    <img src={img} alt="preview" className="w-full h-full object-cover" />
                    <button 
                      type="button"
                      onClick={() => removeImage(idx)}
                      className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="text-white w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Submit */}
          <div className="pt-4">
            <Button 
              type="submit" 
              className="w-full py-4 text-lg" 
              loading={loading}
              disabled={userStats.limitReached}
            >
              {userStats.limitReached ? 'Weekly Limit Reached' : 'Submit Request'} <Send size={18} className="ml-2" />
            </Button>
          </div>

        </form>
      </Card>

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
                   ไม่สามารถส่งรีเควส Prompts ได้เนื่องจากต้องสมัครสมาชิกรายเดือนและล้อคอินก่อนค่ะ
                 </p>
               </div>
               
               <div className="space-y-3 pt-2">
                  <a 
                    href="#" 
                    className="flex items-center justify-center gap-2 w-full py-3.5 px-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-bold shadow-lg shadow-purple-500/20 hover:shadow-purple-500/30 hover:scale-[1.02] transition-all"
                  >
                     สมัครสมาชิก (Stripe) <ArrowUpRight size={16} />
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

export default RequestForm;
