
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../services/supabase';
import { useAuth } from '../context/AuthContext';
import { Button, Card } from '../components/UIComponents';
import { UploadCloud, AlertCircle, CheckCircle, Code, Copy, ShieldAlert, Loader2, Plus, Image as ImageIcon, Link as LinkIcon } from 'lucide-react';

const EXAMPLE_JSON = `[
  {
    "title": "Example Prompt 1",
    "description": "Short description for card",
    "full_prompt": "Full detailed prompt text here...",
    "tags": ["AI Image", "Business"],
    "image_url": "https://example.com/image1.jpg"
  }
]`;

const AdminUpload: React.FC = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  
  const [jsonInput, setJsonInput] = useState('');
  const [uploading, setUploading] = useState(false);
  const [status, setStatus] = useState<{ type: 'success' | 'error' | 'info'; message: string } | null>(null);
  
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [checkingAdmin, setCheckingAdmin] = useState(true);

  // Quick Add State
  const [quickTitle, setQuickTitle] = useState('');
  const [quickDesc, setQuickDesc] = useState('');
  const [quickUrl, setQuickUrl] = useState('');
  const [quickPrompt, setQuickPrompt] = useState('');

  // Check Admin Status
  useEffect(() => {
    const checkAdminStatus = async () => {
      if (authLoading) return;

      if (!user) {
        navigate('/login');
        return;
      }

      try {
        const { data, error } = await supabase
          .from('admins')
          .select('id')
          .eq('id', user.id)
          .single();

        if (error || !data) {
          console.warn("User is not an admin.");
          setIsAdmin(false);
        } else {
          setIsAdmin(true);
        }
      } catch (e) {
        setIsAdmin(false);
      } finally {
        setCheckingAdmin(false);
      }
    };

    checkAdminStatus();
  }, [user, authLoading, navigate]);

  // Helper: Convert Google Drive Link to Direct Image Link
  const convertDriveLink = (url: string): string => {
    if (!url) return '';
    // Regex to find the File ID in a standard Drive URL
    const idPattern = /\/d\/([a-zA-Z0-9_-]+)|\?id=([a-zA-Z0-9_-]+)/;
    const match = url.match(idPattern);
    
    if (match && (url.includes('drive.google.com') || url.includes('docs.google.com'))) {
      const id = match[1] || match[2];
      // Use standard export view which redirects to content
      return `https://drive.google.com/uc?export=view&id=${id}`;
    }
    return url;
  };

  const handleAddToJson = () => {
    if (!quickTitle || !quickUrl) {
      setStatus({ type: 'error', message: 'Title and Image URL are required for Quick Add.' });
      return;
    }

    const finalUrl = convertDriveLink(quickUrl);
    
    const newItem = {
      title: quickTitle,
      description: quickDesc || "No description",
      full_prompt: quickPrompt || quickDesc || "No prompt details provided.",
      tags: ["AI Image"], // Default tag
      image_url: finalUrl
    };

    try {
      let currentData = [];
      if (jsonInput.trim()) {
        // Try to parse existing JSON to append nicely
        try {
          currentData = JSON.parse(jsonInput);
          if (!Array.isArray(currentData)) currentData = [];
        } catch (e) {
          // If existing text isn't valid JSON, we might just append comma... 
          // but safer to just alert or overwrite if it looks like garbage.
          // For simplicity, if parse fails, we assume user wants to start over or fix it manually.
          console.warn("Could not parse existing JSON, appending to array anyway");
        }
      }
      
      const newData = [...currentData, newItem];
      setJsonInput(JSON.stringify(newData, null, 2));
      
      // Reset fields
      setQuickTitle('');
      setQuickDesc('');
      setQuickPrompt('');
      setQuickUrl('');
      setStatus({ type: 'info', message: 'Added to JSON list! Add more or click Upload below.' });
    } catch (e) {
      setStatus({ type: 'error', message: 'Error generating JSON.' });
    }
  };

  const handleCopyTemplate = () => {
    setJsonInput(EXAMPLE_JSON);
    setStatus({ type: 'info', message: 'Example template loaded!' });
  };

  const handleUpload = async () => {
    setUploading(true);
    setStatus(null);

    try {
      // 1. Validate JSON
      let parsedData;
      try {
        parsedData = JSON.parse(jsonInput);
      } catch (e) {
        throw new Error("Invalid JSON format. Please check your syntax.");
      }

      if (!Array.isArray(parsedData)) {
        throw new Error("JSON must be an array of objects (start with [ and end with ]).");
      }

      if (parsedData.length === 0) {
        throw new Error("Array is empty.");
      }

      // 2. Pre-process Google Drive Links in the JSON just in case
      const processedData = parsedData.map((item: any) => ({
        ...item,
        image_url: convertDriveLink(item.image_url)
      }));

      // 3. Send to Supabase
      const { error } = await supabase
        .from('prompts')
        .insert(processedData);

      if (error) throw error;

      setStatus({ 
        type: 'success', 
        message: `Successfully uploaded ${processedData.length} prompts to the library!` 
      });
      setJsonInput(''); // Clear input on success

    } catch (error: any) {
      setStatus({ type: 'error', message: error.message });
    } finally {
      setUploading(false);
    }
  };

  if (authLoading || checkingAdmin) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-pastel-peach" />
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="max-w-md mx-auto pt-20 text-center animate-in fade-in zoom-in-95 duration-500">
        <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
          <ShieldAlert className="w-10 h-10 text-red-400" />
        </div>
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Access Denied</h1>
        <p className="text-gray-500 mb-8">You do not have permission to access the admin area.</p>
        <Button onClick={() => navigate('/')} variant="secondary">Return to Home</Button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-8 duration-700">
      <div className="text-center mb-8">
        <h1 className="font-display font-bold text-3xl text-gray-800">Admin Upload</h1>
        <p className="text-gray-500 mt-1">Add prompts via Quick Form or JSON.</p>
      </div>

      {/* Quick Generator Bar */}
      <Card className="p-6 mb-8 bg-gradient-to-br from-white to-gray-50 border border-pastel-peach/30">
        <div className="flex items-center gap-2 mb-4 text-pastel-peach font-bold uppercase text-xs tracking-widest">
          <Plus size={14} /> Quick Generator
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <input 
            type="text" 
            placeholder="Prompt Title"
            value={quickTitle}
            onChange={e => setQuickTitle(e.target.value)}
            className="px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-pastel-peach/30 outline-none"
          />
          <div className="relative">
             <LinkIcon className="absolute left-3 top-2.5 text-gray-400 w-4 h-4" />
             <input 
              type="text" 
              placeholder="Image URL (Google Drive links accepted)"
              value={quickUrl}
              onChange={e => setQuickUrl(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-pastel-peach/30 outline-none"
            />
          </div>
          <input 
            type="text" 
            placeholder="Short Description"
            value={quickDesc}
            onChange={e => setQuickDesc(e.target.value)}
            className="px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-pastel-peach/30 outline-none"
          />
          <input 
            type="text" 
            placeholder="Full Prompt (Optional - defaults to Desc)"
            value={quickPrompt}
            onChange={e => setQuickPrompt(e.target.value)}
            className="px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-pastel-peach/30 outline-none"
          />
        </div>
        <Button onClick={handleAddToJson} variant="secondary" className="w-full md:w-auto text-sm">
          <Code size={14} className="mr-2" /> Generate JSON Item
        </Button>
      </Card>

      <Card className="p-6 md:p-8 bg-white/80">
        
        {/* Instructions */}
        <div className="mb-6 bg-blue-50 p-4 rounded-xl border border-blue-100 text-sm text-blue-700">
          <p className="font-bold mb-1 flex items-center gap-2"><ImageIcon size={14} /> Google Drive Support:</p>
          <p className="opacity-80">
            Paste standard Google Drive sharing links (e.g., <code>drive.google.com/file/d/ID/view...</code>). 
            They will be automatically converted to direct image links upon upload.
          </p>
        </div>

        {/* Input Area */}
        <div className="relative">
          <textarea
            value={jsonInput}
            onChange={(e) => setJsonInput(e.target.value)}
            placeholder="Paste your JSON here..."
            className="w-full h-64 p-4 rounded-xl bg-gray-50 border border-gray-200 font-mono text-sm focus:ring-2 focus:ring-pastel-peach/50 outline-none transition-all resize-y"
          />
          <button 
            onClick={handleCopyTemplate}
            className="absolute top-4 right-4 text-xs bg-white border border-gray-200 px-3 py-1.5 rounded-lg text-gray-500 hover:text-pastel-peach hover:border-pastel-peach transition-all flex items-center gap-1 shadow-sm"
          >
            <Copy size={12} /> Load Template
          </button>
        </div>

        {/* Status Messages */}
        {status && (
          <div className={`mt-4 p-4 rounded-xl flex items-start gap-3 text-sm ${
            status.type === 'success' ? 'bg-green-50 text-green-700 border border-green-100' :
            status.type === 'error' ? 'bg-red-50 text-red-700 border border-red-100' :
            'bg-blue-50 text-blue-700 border border-blue-100'
          }`}>
            {status.type === 'success' && <CheckCircle className="shrink-0 w-5 h-5" />}
            {status.type === 'error' && <AlertCircle className="shrink-0 w-5 h-5" />}
            {status.type === 'info' && <Code className="shrink-0 w-5 h-5" />}
            <div>
              <span className="font-bold capitalize">{status.type}: </span>
              {status.message}
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="mt-6 flex justify-end">
          <Button 
            onClick={handleUpload} 
            loading={uploading}
            disabled={!jsonInput.trim()}
            className="w-full md:w-auto px-8"
          >
            <UploadCloud size={18} className="mr-2" /> Upload to Library
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default AdminUpload;
