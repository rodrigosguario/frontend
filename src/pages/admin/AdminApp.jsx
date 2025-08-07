import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import AdminLogin from './AdminLogin';
import AdminDashboard from '../../components/AdminDashboard';
import VisualEditor from './VisualEditor';
import WordPressCMS from './WordPressCMS';
import Settings from './Settings';
import BlogManager from './BlogManager';
import ReviewsManager from './ReviewsManager';
import { adminAPI } from '../../config/api';

const AdminApp = () => {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const response = await adminAPI.checkAuth();
      console.log('Status de autenticação:', response);
      
      if (response.success && response.data.authenticated) {
        setAdmin(response.data.admin || response.data.user);
      } else {
        setAdmin(null);
      }
    } catch (error) {
      console.error('Erro ao verificar autenticação:', error);
      setAdmin(null);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = (adminData) => {
    setAdmin(adminData);
  };

  const handleLogout = () => {
    setAdmin(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-muted/30 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Verificando autenticação...</p>
        </div>
      </div>
    );
  }

  if (!admin) {
    return <AdminLogin onLogin={handleLogin} />;
  }

  return (
    <Routes>
      <Route path="/" element={<Navigate to="/admin/dashboard" replace />} />
      <Route path="/dashboard" element={<AdminDashboard admin={admin} onLogout={handleLogout} />} />
      <Route path="/editor" element={<VisualEditor />} />
      <Route path="/cms" element={<WordPressCMS />} />
      <Route path="/settings" element={<Settings />} />
      <Route path="/blog" element={<BlogManager />} />
      <Route path="/reviews" element={<ReviewsManager />} />
      <Route path="*" element={<Navigate to="/admin/dashboard" replace />} />
    </Routes>
  );
};

export default AdminApp;
