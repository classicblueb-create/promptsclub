
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../services/supabase';
import { Button, Card } from '../components/UIComponents';
import { Sparkles, Mail, Lock, AlertCircle } from 'lucide-react';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (mode === 'signup') {
        const { error } = await supabase.auth.signUp({
          email,
          password,
        });
        if (error) throw error;
        alert('Check your email for the login link!');
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        navigate('/');
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto animate-in fade-in zoom-in-95 duration-700 pt-10">
      <div className="text-center mb-8">
        <div className="w-16 h-16 mx-auto bg-gradient-to-br from-pastel-peach to-pastel-lavender rounded-2xl flex items-center justify-center shadow-lg mb-4 animate-float">
           <Sparkles className="text-white w-8 h-8" />
        </div>
        <h1 className="font-display font-bold text-3xl text-gray-800">Welcome to the Club</h1>
        <p className="text-gray-500 mt-2 font-light">Sign in to manage requests and exclusive prompts.</p>
      </div>

      <Card className="p-8 bg-white/60">
        <form onSubmit={handleAuth} className="space-y-6">
          
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Email</label>
            <div className="relative">
              <Mail className="absolute left-4 top-3.5 text-gray-400 w-5 h-5" />
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-12 pr-4 py-3 rounded-xl bg-white/80 border border-gray-200 focus:ring-2 focus:ring-pastel-peach/50 focus:border-transparent outline-none transition-all"
                placeholder="hello@creator.com"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Password</label>
            <div className="relative">
              <Lock className="absolute left-4 top-3.5 text-gray-400 w-5 h-5" />
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-12 pr-4 py-3 rounded-xl bg-white/80 border border-gray-200 focus:ring-2 focus:ring-pastel-peach/50 focus:border-transparent outline-none transition-all"
                placeholder="••••••••"
                required
              />
            </div>
          </div>

          {error && (
            <div className="bg-red-50 text-red-500 px-4 py-3 rounded-xl text-sm flex items-center gap-2">
              <AlertCircle size={16} /> {error}
            </div>
          )}

          <Button type="submit" className="w-full py-4 text-lg" loading={loading}>
            {mode === 'signin' ? 'Sign In' : 'Sign Up'}
          </Button>

          <div className="text-center">
            <button 
              type="button"
              onClick={() => setMode(mode === 'signin' ? 'signup' : 'signin')}
              className="text-sm text-gray-500 hover:text-pastel-peach transition-colors underline decoration-dotted"
            >
              {mode === 'signin' ? "New here? Create an account" : "Already have an account? Sign In"}
            </button>
          </div>

        </form>
      </Card>
    </div>
  );
};

export default Login;
