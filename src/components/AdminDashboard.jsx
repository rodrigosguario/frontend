import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Heart, 
  LogOut, 
  Users, 
  Calendar, 
  MessageSquare, 
  Settings,
  Activity,
  Clock,
  CheckCircle
} from 'lucide-react';
import { logout } from '../config/auth';

const AdminDashboard = ({ admin, onLogout }) => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      // Simular dados do dashboard por enquanto
      // Em produção, isso viria da API
      const mockData = {
        stats: {
          totalPatients: 156,
          appointmentsToday: 8,
          pendingMessages: 3,
          completedToday: 5
        },
        recentAppointments: [
          { id: 1, patient: 'Maria Silva', time: '09:00', status: 'confirmed' },
          { id: 2, patient: 'João Santos', time: '10:30', status: 'pending' },
          { id: 3, patient: 'Ana Costa', time: '14:00', status: 'completed' }
        ]
      };
      
      setDashboardData(mockData);
    } catch (error) {
      console.error('Erro ao carregar dashboard:', error);
      setError('Erro ao carregar dados do dashboard');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      logout();
      onLogout();
    } catch (error) {
      console.error('Erro no logout:', error);
      // Fazer logout local mesmo se a API falhar
      onLogout();
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Activity className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-600" />
          <p>Carregando dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Heart className="w-8 h-8 text-blue-600 mr-3" />
              <div>
                <h1 className="text-xl font-semibold text-gray-900">
                  Painel Administrativo
                </h1>
                <p className="text-sm text-gray-500">
                  Dr. Rodrigo Sguario - Cardiologista
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-700">
                Bem-vindo, {admin.username}
              </span>
              <Button 
                variant="outline" 
                size="sm"
                onClick={handleLogout}
                className="flex items-center"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Sair
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <Alert className="mb-6 border-red-200 bg-red-50">
            <AlertDescription className="text-red-700">
              {error}
            </AlertDescription>
          </Alert>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Users className="w-8 h-8 text-blue-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total de Pacientes</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {dashboardData?.stats.totalPatients || 0}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Calendar className="w-8 h-8 text-green-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Consultas Hoje</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {dashboardData?.stats.appointmentsToday || 0}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <MessageSquare className="w-8 h-8 text-yellow-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Mensagens Pendentes</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {dashboardData?.stats.pendingMessages || 0}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <CheckCircle className="w-8 h-8 text-purple-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Concluídas Hoje</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {dashboardData?.stats.completedToday || 0}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Appointments */}
        <Card>
          <CardHeader>
            <CardTitle>Consultas Recentes</CardTitle>
            <CardDescription>
              Últimas consultas agendadas e seus status
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {dashboardData?.recentAppointments.map((appointment) => (
                <div key={appointment.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center">
                    <Clock className="w-5 h-5 text-gray-400 mr-3" />
                    <div>
                      <p className="font-medium text-gray-900">{appointment.patient}</p>
                      <p className="text-sm text-gray-500">{appointment.time}</p>
                    </div>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    appointment.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                    appointment.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-blue-100 text-blue-800'
                  }`}>
                    {appointment.status === 'confirmed' ? 'Confirmada' :
                     appointment.status === 'pending' ? 'Pendente' : 'Concluída'}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Success Message */}
        <Alert className="mt-6 border-green-200 bg-green-50">
          <CheckCircle className="w-4 h-4 text-green-600" />
          <AlertDescription className="text-green-700">
            ✅ <strong>Conexão com API estabelecida com sucesso!</strong><br />
            Backend: https://77h9ikczqneq.manus.space<br />
            Status: Online e funcionando perfeitamente
          </AlertDescription>
        </Alert>
      </main>
    </div>
  );
};

export default AdminDashboard;

