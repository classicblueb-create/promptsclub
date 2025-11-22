
import React from 'react';
import { Outlet, NavLink, useLocation, Link } from 'react-router-dom';
import { Sparkles, PlusCircle, LayoutGrid, LogIn, UserCircle, Lightbulb } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const FloatingOrb = ({ className }: { className: string }) => (
  <div className={`absolute rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-float ${className}`}></div>
);

const NavBar = () => {
  const { user } = useAuth();
  
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 px-4 py-4 md:px-8 md:py-6">
      <div className="max-w-6xl mx-auto">
        <div className="glass-panel rounded-2xl px-6 py-3 flex items-center justify-between shadow-sm">
          
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-pastel-peach to-pastel-lavender flex items-center justify-center shadow-inner">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <span className="font-display font-bold text-lg tracking-tight text-gray-800">Prompt Club</span>
          </Link>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-1 bg-gray-50/50 rounded-full p-1 border border-gray-100">
            <NavLink 
              to="/" 
              className={({ isActive }) => `px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 ${isActive ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500 hover:text-gray-700'}`}
            >
              หน้าหลัก
            </NavLink>
            <NavLink 
              to="/tips" 
              className={({ isActive }) => `px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 ${isActive ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500 hover:text-gray-700'}`}
            >
              เทคนิคลับ
            </NavLink>
            <NavLink 
              to="/request" 
              className={({ isActive }) => `px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 ${isActive ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500 hover:text-gray-700'}`}
            >
              Request
            </NavLink>
          </div>

          {/* Desktop Auth */}
          <div className="hidden md:flex items-center">
            {user ? (
               <div className="flex items-center gap-3">
                 <span className="text-xs text-gray-500 font-medium truncate max-w-[100px]">{user.email}</span>
                 <NavLink 
                   to="/profile"
                   className={({ isActive }) => `transition-colors ${isActive ? 'text-pastel-peach' : 'text-gray-400 hover:text-pastel-peach'}`}
                   title="My Profile"
                 >
                   <UserCircle size={24} />
                 </NavLink>
               </div>
            ) : (
              <NavLink to="/login" className="flex items-center gap-1 text-sm font-medium text-pastel-peach hover:text-pink-400 transition-colors">
                <LogIn size={16} /> Login
              </NavLink>
            )}
          </div>

          {/* Mobile Icon Links */}
          <div className="flex md:hidden items-center gap-4">
            <NavLink to="/" className={({isActive}) => isActive ? 'text-pastel-mint' : 'text-gray-400'}>
               <LayoutGrid size={24} />
            </NavLink>
            <NavLink to="/tips" className={({isActive}) => isActive ? 'text-purple-400' : 'text-gray-400'}>
               <Lightbulb size={24} />
            </NavLink>
            <NavLink to="/request" className={({isActive}) => isActive ? 'text-pastel-peach' : 'text-gray-400'}>
               <PlusCircle size={24} />
            </NavLink>
            {user ? (
                <NavLink to="/profile" className={({isActive}) => isActive ? 'text-pastel-lavender' : 'text-gray-400'}>
                  <UserCircle size={24} />
                </NavLink>
            ) : (
                <NavLink to="/login" className={({isActive}) => isActive ? 'text-pastel-blue' : 'text-gray-400'}>
                   <LogIn size={24} />
                </NavLink>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

const Layout: React.FC = () => {
  return (
    <div className="relative min-h-screen overflow-hidden font-sans selection:bg-pastel-peach/30">
      
      {/* Background Gradients & Orbs */}
      <div className="fixed inset-0 w-full h-full pointer-events-none z-0">
        <FloatingOrb className="bg-pastel-peach w-96 h-96 top-0 -left-20" />
        <FloatingOrb className="bg-pastel-mint w-96 h-96 bottom-0 -right-20 animate-float-delayed" />
        <FloatingOrb className="bg-pastel-lavender w-72 h-72 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute inset-0 bg-white/40 backdrop-blur-[100px]"></div>
      </div>

      <NavBar />

      <main className="relative z-10 pt-28 pb-12 px-4 max-w-6xl mx-auto min-h-screen flex flex-col">
        <Outlet />
      </main>

      <footer className="relative z-10 text-center py-8 text-gray-400 text-xs">
        <p>© {new Date().getFullYear()} Prompt Club. Built for Creators.</p>
      </footer>
    </div>
  );
};

export default Layout;
