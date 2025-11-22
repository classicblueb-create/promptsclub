
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../services/supabase';
import { Button, Card } from '../components/UIComponents';
import { User, LogOut, Save, Loader2, MessageCircle, RefreshCw, Sparkles } from 'lucide-react';

interface ProfileData {
  id: string;
  display_name: string | null;
  line_name: string | null;
  avatar_url: string | null;
}

const Profile: React.FC = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState<ProfileData>({
    id: '',
    display_name: '',
    line_name: '',
    avatar_url: null
  });

  useEffect(() => {
    const getProfile = async () => {
      if (!user) return;
      
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        if (error && error.code !== 'PGRST116') {
          console.error('Error loading profile:', error.message);
        }

        if (data) {
          setProfile(data);
        } else {
            // Initialize empty profile for new users
            setProfile(prev => ({ ...prev, id: user.id }));
            // Auto-generate an avatar for new users
            generateNewAvatar();
        }
      } catch (error: any) {
        console.error('Error loading profile:', error.message);
      } finally {
        setLoading(false);
      }
    };

    getProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const generateNewAvatar = () => {
    const seed = Math.random().toString(36).substring(7);
    const pastelBackgrounds = 'ffdfbf,c0aede,b6e3f4,ffd1dc,b5ead7';
    
    // Logic: 80% chance to generate a female-leaning character
    const isFemale = Math.random() < 0.8;

    let urlParams = `seed=${seed}&backgroundColor=${pastelBackgrounds}`;

    if (isFemale) {
      // Female/Soft settings: No beard, lower chance of glasses for cleaner look
      urlParams += '&beardProbability=0&glassesProbability=20';
    } else {
      // Male/General settings: Allow beards
      urlParams += '&beardProbability=60';
    }

    // Using 'notionists' style for the infographic/creator look
    const newUrl = `https://api.dicebear.com/9.x/notionists/svg?${urlParams}`;
    setProfile(prev => ({ ...prev, avatar_url: newUrl }));
  };

  const updateProfile = async () => {
    if (!user) return;

    try {
      setSaving(true);
      const updates = {
        id: user.id,
        display_name: profile.display_name,
        line_name: profile.line_name,
        avatar_url: profile.avatar_url,
        updated_at: new Date(),
      };

      const { error } = await supabase.from('profiles').upsert(updates);

      if (error) throw error;
      alert('Profile updated successfully!');
    } catch (error: any) {
      alert('Error updating profile: ' + error.message);
    } finally {
      setSaving(false);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/login');
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <Loader2 className="w-8 h-8 animate-spin text-pastel-peach" />
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto animate-in fade-in slide-in-from-bottom-8 duration-700">
      <div className="text-center mb-8">
        <h1 className="font-display font-bold text-3xl text-gray-800">My Profile</h1>
        <p className="text-gray-500 mt-1">Manage your creator identity.</p>
      </div>

      <Card className="p-8 bg-white/80 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-pastel-peach to-pastel-lavender"></div>

        {/* Avatar Section */}
        <div className="flex flex-col items-center mb-8">
          <div className="relative group">
            <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-lg bg-gray-50 relative">
              {profile.avatar_url ? (
                <img 
                  src={profile.avatar_url} 
                  alt="Avatar" 
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-300">
                  <User size={48} />
                </div>
              )}
            </div>
            
            {/* Randomize Button */}
            <button 
              onClick={generateNewAvatar}
              className="absolute bottom-0 right-0 p-2 bg-white rounded-full shadow-md border border-gray-100 text-gray-500 hover:text-pastel-peach hover:scale-110 transition-all"
              title="Randomize Character"
            >
              <RefreshCw size={18} />
            </button>
          </div>
          
          <div className="mt-3 flex items-center gap-2 text-xs text-gray-400 bg-gray-50 px-3 py-1 rounded-full border border-gray-100">
             <Sparkles size={12} className="text-pastel-peach" />
             <span>Randomly generated infographic character</span>
          </div>
        </div>

        {/* Form Fields */}
        <div className="space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Display Name</label>
            <div className="relative">
              <User className="absolute left-4 top-3.5 text-gray-400 w-5 h-5" />
              <input
                type="text"
                value={profile.display_name || ''}
                onChange={(e) => setProfile({ ...profile, display_name: e.target.value })}
                className="w-full pl-12 pr-4 py-3 rounded-xl bg-white border border-gray-200 focus:ring-2 focus:ring-pastel-peach/50 focus:border-transparent outline-none transition-all"
                placeholder="Your Name"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">LINE Name (Prompt Club ID)</label>
            <div className="relative">
              <MessageCircle className="absolute left-4 top-3.5 text-gray-400 w-5 h-5" />
              <input
                type="text"
                value={profile.line_name || ''}
                onChange={(e) => setProfile({ ...profile, line_name: e.target.value })}
                className="w-full pl-12 pr-4 py-3 rounded-xl bg-white border border-gray-200 focus:ring-2 focus:ring-pastel-peach/50 focus:border-transparent outline-none transition-all"
                placeholder="@username"
              />
            </div>
            <p className="text-xs text-gray-400 text-right">Used to track your requests.</p>
          </div>

          <div className="pt-4 space-y-3">
            <Button 
              onClick={updateProfile} 
              loading={saving}
              className="w-full py-3"
            >
              <Save size={18} className="mr-2" /> Save Changes
            </Button>
            
            <button
              onClick={handleSignOut}
              className="w-full py-3 rounded-xl border border-gray-200 text-gray-500 hover:bg-red-50 hover:text-red-500 hover:border-red-100 transition-all flex items-center justify-center gap-2 font-medium text-sm"
            >
              <LogOut size={18} /> Sign Out
            </button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Profile;
