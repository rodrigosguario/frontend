import React, { useState, useEffect } from 'react';
import { 
  BarChart3, 
  FileText, 
  Settings, 
  Users, 
  Star,
  Heart,
  Calendar,
  TrendingUp,
  MessageSquare,
  Edit3
} from 'lucide-react';
import BlogEditorSimple from './BlogEditorSimple';
import ContentEditorAdvanced from './ContentEditorAdvanced';
import AdminSettingsAdvanced from './AdminSettingsAdvanced';
import ReviewsManager from './ReviewsManager';
import WordPressCMS from './WordPressCMS';
import { blogAPI, reviewsAPI } from '../../config/api';

const AdminDashboard = () => {
  const [activeView, setActiveView] = useState('dashboard');
  const [stats, setStats] = useState({
    totalPosts: 0,
    totalReviews: 0,
    avgRating: 0,
    totalViews: 0
  });

  useEffect(() => {
    loadDashboardStats();
  }, []);

  const loadDashboardStats = async () => {
    try {
      // Carregar estatísticas reais do backend
      const [postsRes, reviewsRes] = await Promise.all([
        blogAPI.getPosts(),
        reviewsAPI.getReviews()
      ]);

      const posts = postsRes.data?.data || [];
      const reviews = reviewsRes.data?.data || [];

      const avgRating = reviews.length > 0 
        ? (reviews.reduce((sum, r) => sum + (r.rating || 0), 0) / reviews.length).toFixed(1)
        : 0;

      setStats({
        totalPosts: Array.isArray(posts) ? posts.length : 0,
        totalReviews: Array.isArray(reviews) ? reviews.length : 0,
        avgRating: avgRating,
        totalViews: Math.floor(Math.random() * 1000) + 500 // Simulado
      });
    } catch (error) {
      console.error('Erro ao carregar estatísticas:', error);
      // Manter valores padrão em caso de erro
    }
  };

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
    { id: 'wordpress', label: 'WordPress CMS', icon: Edit3 },
    { id: 'blog', label: 'Blog', icon: FileText },
    { id: 'content', label: 'Editor de Conteúdo', icon: FileText },
    { id: 'reviews', label: 'Avaliações', icon: Star },
    { id: 'settings', label: 'Configurações', icon: Settings }
  ];

  const StatCard = ({ title, value, icon: Icon, color = "blue" }) => (
    <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-500">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
        </div>
        <div className={`p-3 rounded-full bg-${color}-100`}>
          <Icon className={`h-6 w-6 text-${color}-600`} />
        </div>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeView) {
      case 'dashboard':
        return (
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
              <p className="text-gray-600">Visão geral do seu site</p>
            </div>

            {/* Estatísticas */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatCard
                title="Total de Posts"
                value={stats.totalPosts}
                icon={FileText}
                color="blue"
              />
              <StatCard
                title="Avaliações"
                value={stats.totalReviews}
                icon={Star}
                color="yellow"
              />
              <StatCard
                title="Avaliação Média"
                value={`${stats.avgRating} ⭐`}
                icon={TrendingUp}
                color="green"
              />
              <StatCard
                title="Visualizações"
                value={stats.totalViews}
                icon={Users}
                color="purple"
              />
            </div>

            {/* Ações Rápidas */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Ações Rápidas</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <button
                  onClick={() => setActiveView('wordpress')}
                  className="flex items-center p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
                >
                  <Edit3 className="h-8 w-8 text-blue-600 mr-3" />
                  <div className="text-left">
                    <h3 className="font-medium text-gray-900">WordPress CMS</h3>
                    <p className="text-sm text-gray-600">Edite todo o conteúdo do site</p>
                  </div>
                </button>
                
                <button
                  onClick={() => setActiveView('blog')}
                  className="flex items-center p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors"
                >
                  <FileText className="h-8 w-8 text-green-600 mr-3" />
                  <div className="text-left">
                    <h3 className="font-medium text-gray-900">Novo Post</h3>
                    <p className="text-sm text-gray-600">Criar novo artigo do blog</p>
                  </div>
                </button>
                
                <button
                  onClick={() => setActiveView('reviews')}
                  className="flex items-center p-4 bg-yellow-50 rounded-lg hover:bg-yellow-100 transition-colors"
                >
                  <Star className="h-8 w-8 text-yellow-600 mr-3" />
                  <div className="text-left">
                    <h3 className="font-medium text-gray-900">Importar Avaliações</h3>
                    <p className="text-sm text-gray-600">Doctoralia e Google</p>
                  </div>
                </button>
              </div>
            </div>

            {/* Atividade Recente */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Atividade Recente</h2>
              <div className="space-y-3">
                <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                  <Calendar className="h-5 w-5 text-gray-400 mr-3" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Sistema CMS atualizado</p>
                    <p className="text-xs text-gray-500">Hoje às 14:30</p>
                  </div>
                </div>
                <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                  <MessageSquare className="h-5 w-5 text-gray-400 mr-3" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Novas avaliações disponíveis</p>
                    <p className="text-xs text-gray-500">Ontem às 16:45</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'wordpress':
        return <WordPressCMS />;
      case 'blog':
        return <BlogEditorSimple />;
      case 'content':
        return <ContentEditorAdvanced />;
      case 'reviews':
        return <ReviewsManager />;
      case 'settings':
        return <AdminSettingsAdvanced />;
      default:
        return <div>Seção não encontrada</div>;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 bg-white shadow-lg min-h-screen">
          <div className="p-6 border-b">
            <h2 className="text-xl font-bold text-gray-800">Admin Panel</h2>
            <p className="text-sm text-gray-600">Dr. Rodrigo Sguario</p>
          </div>
          
          <nav className="mt-6">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveView(item.id)}
                  className={`w-full flex items-center px-6 py-3 text-left hover:bg-gray-50 transition-colors ${
                    activeView === item.id 
                      ? 'bg-blue-50 border-r-2 border-blue-500 text-blue-700' 
                      : 'text-gray-700'
                  }`}
                >
                  <Icon className="h-5 w-5 mr-3" />
                  {item.label}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-8">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
