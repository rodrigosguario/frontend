import React, { useState, useEffect } from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { 
  Users, 
  Calendar, 
  MessageSquare, 
  TrendingUp, 
  Heart,
  Settings,
  FileText,
  Eye,
  Plus,
  Edit,
  Trash2,
  Star
} from 'lucide-react';
import AdminSettingsAdvanced from './AdminSettingsAdvanced';
import ContentEditorAdvanced from './ContentEditorAdvanced';
import BlogEditorSimple from './BlogEditorSimple';
import ReviewsManager from './ReviewsManager';
import WordPressCMS from './WordPressCMS';
import VisualEditor from './VisualEditor';
import { blogAPI, adminAPI } from '@/config/api';

const AdminDashboard = () => {
  const [activeView, setActiveView] = useState('dashboard');
  const [stats, setStats] = useState({
    totalPosts: 0,
    totalViews: 0,
    totalContacts: 0,
    totalAppointments: 0
  });

  const [recentPosts, setRecentPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      // Carregar posts do blog
      const posts = await blogAPI.getPosts();
      const postsData = posts.data || [];
      setRecentPosts(postsData.slice(0, 5));
      setStats(prev => ({ ...prev, totalPosts: postsData.length }));

      // Simular outras estatísticas (você pode implementar APIs reais depois)
      setStats(prev => ({
        ...prev,
        totalViews: 1247,
        totalContacts: 23,
        totalAppointments: 45
      }));
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
      // Fallback para dados simulados se a API falhar
      setRecentPosts([]);
      setStats({
        totalPosts: 0,
        totalViews: 1247,
        totalContacts: 23,
        totalAppointments: 45
      });
    } finally {
      setLoading(false);
    }
  };

  // Dados simulados para gráficos
  const monthlyData = [
    { month: 'Jan', consultas: 12, visualizacoes: 245 },
    { month: 'Fev', consultas: 19, visualizacoes: 312 },
    { month: 'Mar', consultas: 15, visualizacoes: 289 },
    { month: 'Abr', consultas: 22, visualizacoes: 398 },
    { month: 'Mai', consultas: 18, visualizacoes: 445 },
    { month: 'Jun', consultas: 25, visualizacoes: 502 }
  ];

  const serviceData = [
    { name: 'Transplante Cardíaco', value: 35, color: '#1e293b' },
    { name: 'Insuficiência Cardíaca', value: 28, color: '#64748b' },
    { name: 'Cardiologia Preventiva', value: 22, color: '#d4af37' },
    { name: 'Ecocardiografia', value: 15, color: '#94a3b8' }
  ];

  const statCards = [
    {
      title: 'Posts do Blog',
      value: stats.totalPosts,
      icon: FileText,
      color: 'bg-blue-500',
      change: '+12%'
    },
    {
      title: 'Visualizações',
      value: stats.totalViews.toLocaleString(),
      icon: Eye,
      color: 'bg-green-500',
      change: '+23%'
    },
    {
      title: 'Contatos',
      value: stats.totalContacts,
      icon: MessageSquare,
      color: 'bg-purple-500',
      change: '+8%'
    },
    {
      title: 'Agendamentos',
      value: stats.totalAppointments,
      icon: Calendar,
      color: 'bg-orange-500',
      change: '+15%'
    }
  ];

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: BarChart },
    { id: 'settings', label: 'Configurações', icon: Settings },
    { id: 'visual-editor', label: 'Editor Visual', icon: Edit },
    { id: 'content', label: 'Editor de Conteúdo', icon: FileText },
    { id: 'blog', label: 'Blog', icon: FileText },
    { id: 'reviews', label: 'Avaliações', icon: Star },
    { id: 'contacts', label: 'Contatos', icon: MessageSquare },
    { id: 'wordpress', label: 'WordPress CMS', icon: Edit },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Sidebar */}
      <div className="fixed left-0 top-0 h-full w-64 bg-card border-r border-border p-6">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-foreground">Admin Panel</h2>
          <p className="text-muted-foreground">Dr. Rodrigo Sguario</p>
        </div>

        <nav className="space-y-2">
          {menuItems.map((item) => {
            const IconComponent = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => setActiveView(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  activeView === item.id
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                }`}
              >
                <IconComponent className="w-5 h-5" />
                {item.label}
              </button>
            );
          })}
        </nav>

        <div className="absolute bottom-6 left-6 right-6">
          <button
            onClick={() => {
              sessionStorage.removeItem('admin_logged_in');
              window.location.href = '/admin';
            }}
            className="w-full px-4 py-2 text-sm text-muted-foreground hover:text-foreground border border-border rounded-lg hover:bg-muted transition-colors"
          >
            Sair
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="ml-64 p-8">
        {activeView === 'dashboard' && (
          <>
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-foreground mb-2">
                Dashboard
              </h1>
              <p className="text-muted-foreground">
                Visão geral do seu site e atividades
              </p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {statCards.map((stat, index) => {
                const IconComponent = stat.icon;
                return (
                  <div key={index} className="bg-card rounded-lg p-6 border border-border">
                    <div className="flex items-center justify-between mb-4">
                      <div className={`p-3 rounded-lg ${stat.color}`}>
                        <IconComponent className="w-6 h-6 text-white" />
                      </div>
                      <span className="text-sm text-green-600 font-medium">
                        {stat.change}
                      </span>
                    </div>
                    <h3 className="text-2xl font-bold text-foreground mb-1">
                      {stat.value}
                    </h3>
                    <p className="text-muted-foreground text-sm">
                      {stat.title}
                    </p>
                  </div>
                );
              })}
            </div>

            {/* Charts */}
            <div className="grid lg:grid-cols-2 gap-8 mb-8">
              {/* Monthly Activity */}
              <div className="bg-card rounded-lg p-6 border border-border">
                <h3 className="text-xl font-semibold mb-4">Atividade Mensal</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={monthlyData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Line 
                      type="monotone" 
                      dataKey="consultas" 
                      stroke="#1e293b" 
                      strokeWidth={2}
                      name="Consultas"
                    />
                    <Line 
                      type="monotone" 
                      dataKey="visualizacoes" 
                      stroke="#d4af37" 
                      strokeWidth={2}
                      name="Visualizações"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              {/* Services Distribution */}
              <div className="bg-card rounded-lg p-6 border border-border">
                <h3 className="text-xl font-semibold mb-4">Distribuição de Serviços</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={serviceData}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {serviceData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Recent Posts */}
            <div className="bg-card rounded-lg p-6 border border-border">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold">Posts Recentes</h3>
                <button
                  onClick={() => setActiveView('blog')}
                  className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90"
                >
                  <Plus className="w-4 h-4" />
                  Novo Post
                </button>
              </div>

              {recentPosts.length > 0 ? (
                <div className="space-y-4">
                  {recentPosts.map((post) => (
                    <div key={post.id} className="flex items-center justify-between p-4 border border-border rounded-lg">
                      <div>
                        <h4 className="font-semibold text-foreground">{post.titulo}</h4>
                        <p className="text-sm text-muted-foreground">
                          {new Date(post.data_criacao).toLocaleDateString('pt-BR')}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">
                          Publicado
                        </span>
                        <button 
                          onClick={() => setActiveView('blog')}
                          className="p-2 text-muted-foreground hover:text-foreground"
                          title="Editar no Blog Editor"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">Nenhum post encontrado</p>
                  <button
                    onClick={() => setActiveView('blog')}
                    className="mt-4 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90"
                  >
                    Criar Primeiro Post
                  </button>
                </div>
              )}
            </div>
          </>
        )}

        {activeView === 'settings' && <AdminSettingsAdvanced />}

        {activeView === 'visual-editor' && <VisualEditor />}

        {activeView === 'content' && <ContentEditorAdvanced />}

        {activeView === 'blog' && <BlogEditorSimple />}

        {activeView === 'reviews' && <ReviewsManager />}

        {activeView === 'wordpress' && <WordPressCMS />}

        {activeView === 'contacts' && (
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Contatos
            </h1>
            <p className="text-muted-foreground mb-8">
              Em breve: Gerenciamento de contatos
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
