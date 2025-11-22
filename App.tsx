
import React from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Library from './pages/Library';
import RequestForm from './pages/RequestForm';
import Success from './pages/Success';
import PromptDetail from './pages/PromptDetail';
import Login from './pages/Login';
import Profile from './pages/Profile';
import AdminUpload from './pages/AdminUpload';
import Tips from './pages/Tips';
import PromptsPage from './pages/Prompts';   // ← เพิ่มมาใหม่
import { AuthProvider } from './context/AuthContext';

const App: React.FC = () => {
  return (
    <AuthProvider>
      <HashRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Library />} />
            <Route path="login" element={<Login />} />
            <Route path="profile" element={<Profile />} />
            <Route path="prompt/:id" element={<PromptDetail />} />
            <Route path="request" element={<RequestForm />} />
            <Route path="success" element={<Success />} />
            <Route path="admin/upload" element={<AdminUpload />} />
            <Route path="tips" element={<Tips />} />

            {/* ⭐️ หน้าใหม่: Prompt Archive */}
            <Route path="prompts" element={<PromptsPage />} /> 
          </Route>
        </Routes>
      </HashRouter>
    </AuthProvider>
  );
};

export default App;