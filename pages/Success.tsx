import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { CheckCircle2, ArrowLeft, Plus } from 'lucide-react';
import { Button, Card } from '../components/UIComponents';
import { StorageService } from '../services/storage';

const Success: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [stats, setStats] = useState({ weeklyUsage: 0, monthlyUsage: 0, remainingWeeklySubmissions: 0, limitReached: false });
  const lineName = location.state?.lineName;

  useEffect(() => {
    if (lineName) {
      setStats(StorageService.getUserStats(lineName));
    }
  }, [lineName]);

  if (!lineName) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] text-center">
        <p className="text-gray-500 mb-4">No request found.</p>
        <Button onClick={() => navigate('/')}>Go Home</Button>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto pt-10 animate-in zoom-in-95 duration-500">
      <div className="text-center mb-8 relative">
        {/* 3D Mascot representation using CSS */}
        <div className="w-32 h-32 mx-auto bg-gradient-to-br from-pastel-mint to-white rounded-full shadow-[0_20px_50px_-12px_rgba(181,234,215,0.5)] flex items-center justify-center relative animate-float mb-6">
          <div className="absolute inset-2 bg-white/30 rounded-full blur-sm"></div>
          <CheckCircle2 className="w-16 h-16 text-white drop-shadow-md relative z-10" />
        </div>
        
        <h1 className="font-display font-bold text-3xl text-gray-800 mb-2">Request Sent!</h1>
        <p className="text-gray-500">We've received your prompt request.</p>
      </div>

      <Card className="p-6 mb-8 bg-white/90">
        <h2 className="text-xs font-bold text-gray-400 uppercase tracking-widest text-center mb-6">Your Usage Stats</h2>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-gray-50 p-4 rounded-2xl text-center border border-gray-100">
            <div className="text-3xl font-display font-bold text-gray-800 mb-1">{stats.weeklyUsage}</div>
            <div className="text-xs text-gray-500">This Week</div>
          </div>
          <div className="bg-gray-50 p-4 rounded-2xl text-center border border-gray-100">
            <div className="text-3xl font-display font-bold text-pastel-peach mb-1">{stats.remainingWeeklySubmissions}</div>
            <div className="text-xs text-gray-500">Submissions Left</div>
          </div>
        </div>
        
        <div className="mt-4 text-center">
             <span className="text-xs text-gray-400">Resets on Monday</span>
        </div>
      </Card>

      <div className="space-y-3">
        <Button variant="secondary" className="w-full justify-center" onClick={() => navigate('/')}>
          <ArrowLeft size={18} /> Back to Library
        </Button>
        
        <Button 
          variant="outline" 
          className="w-full justify-center border-dashed" 
          onClick={() => navigate('/request')}
          disabled={stats.limitReached}
        >
          <Plus size={18} /> Submit Another Request
        </Button>
      </div>
    </div>
  );
};

export default Success;
