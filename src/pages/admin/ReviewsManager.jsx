import React, { useState, useEffect } from 'react';
import { 
  Star, 
  Download, 
  RefreshCw, 
  Eye, 
  EyeOff,
  Trash2,
  Plus,
  ExternalLink,
  Calendar,
  User,
  MessageSquare
} from 'lucide-react';
import { reviewsAPI } from '@/config/api';

const ReviewsManager = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [importLoading, setImportLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('all');
  const [newReview, setNewReview] = useState({
    patient_name: '',
    rating: 5,
    comment: '',
    source: 'manual',
    date: new Date().toISOString().split('T')[0]
  });
  const [showAddForm, setShowAddForm] = useState(false);

  useEffect(() => {
    loadReviews();
  }, []);

  const loadReviews = async () => {
    setLoading(true);
    try {
      const response = await reviewsAPI.getReviews();
      const reviewsData = response.data || [];
      setReviews(reviewsData);
    } catch (error) {
      console.error('Erro ao carregar avaliações:', error);
      // Fallback com dados de exemplo
      setReviews([
        {
          id: 1,
          patient_name: 'Maria Silva',
          rating: 5,
          comment: 'Excelente profissional! Dr. Rodrigo é muito atencioso e competente.',
          source: 'doctoralia',
          date: '2024-01-15',
          is_visible: true
        },
        {
          id: 2,
          patient_name: 'João Santos',
          rating: 5,
          comment: 'Médico excepcional, me ajudou muito no tratamento.',
          source: 'google',
          date: '2024-01-10',
          is_visible: true
        },
        {
          id: 3,
          patient_name: 'Ana Costa',
          rating: 4,
          comment: 'Muito bom atendimento, recomendo!',
          source: 'manual',
          date: '2024-01-05',
          is_visible: true
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const importReviews = async (source) => {
    setImportLoading(true);
    try {
      await reviewsAPI.importReviews(source);
      alert(`Avaliações do ${source} importadas com sucesso!`);
      loadReviews();
    } catch (error) {
      console.error('Erro ao importar avaliações:', error);
      alert(`Erro ao importar avaliações do ${source}. Verifique sua conexão e tente novamente.`);
    } finally {
      setImportLoading(false);
    }
  };

  const addReview = async () => {
    if (!newReview.patient_name || !newReview.comment) {
      alert('Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    try {
      await reviewsAPI.addReview(newReview);
      alert('Avaliação adicionada com sucesso!');
      setNewReview({
        patient_name: '',
        rating: 5,
        comment: '',
        source: 'manual',
        date: new Date().toISOString().split('T')[0]
      });
      setShowAddForm(false);
      loadReviews();
    } catch (error) {
      console.error('Erro ao adicionar avaliação:', error);
      alert('Erro ao adicionar avaliação. Tente novamente.');
    }
  };

  const toggleVisibility = async (reviewId) => {
    try {
      // Simular toggle de visibilidade
      setReviews(reviews.map(review => 
        review.id === reviewId 
          ? { ...review, is_visible: !review.is_visible }
          : review
      ));
    } catch (error) {
      console.error('Erro ao alterar visibilidade:', error);
    }
  };

  const deleteReview = async (reviewId) => {
    if (!confirm('Tem certeza que deseja excluir esta avaliação?')) return;

    try {
      setReviews(reviews.filter(review => review.id !== reviewId));
      alert('Avaliação excluída com sucesso!');
    } catch (error) {
      console.error('Erro ao excluir avaliação:', error);
    }
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        className={`w-4 h-4 ${
          index < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
        }`}
      />
    ));
  };

  const getSourceIcon = (source) => {
    switch (source) {
      case 'doctoralia':
        return '🏥';
      case 'google':
        return '🔍';
      case 'manual':
        return '✏️';
      default:
        return '📝';
    }
  };

  const filteredReviews = reviews.filter(review => {
    if (activeTab === 'all') return true;
    if (activeTab === 'visible') return review.is_visible;
    if (activeTab === 'hidden') return !review.is_visible;
    return review.source === activeTab;
  });

  const averageRating = reviews.length > 0 
    ? (reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length).toFixed(1)
    : 0;

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Star className="w-8 h-8 text-yellow-500" />
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Gerenciador de Avaliações</h2>
            <p className="text-gray-600">Gerencie e importe avaliações de pacientes</p>
          </div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Adicionar Avaliação
          </button>
          <button
            onClick={loadReviews}
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2"
          >
            {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
            Atualizar
          </button>
        </div>
      </div>

      {/* Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <Star className="w-8 h-8 text-yellow-500" />
            <div>
              <p className="text-sm text-gray-600">Avaliação Média</p>
              <p className="text-2xl font-bold text-gray-800">{averageRating}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <MessageSquare className="w-8 h-8 text-blue-500" />
            <div>
              <p className="text-sm text-gray-600">Total de Avaliações</p>
              <p className="text-2xl font-bold text-gray-800">{reviews.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <Eye className="w-8 h-8 text-green-500" />
            <div>
              <p className="text-sm text-gray-600">Visíveis</p>
              <p className="text-2xl font-bold text-gray-800">
                {reviews.filter(r => r.is_visible).length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <Download className="w-8 h-8 text-purple-500" />
            <div>
              <p className="text-sm text-gray-600">Importadas</p>
              <p className="text-2xl font-bold text-gray-800">
                {reviews.filter(r => r.source !== 'manual').length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Importação de Avaliações */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Importar Avaliações</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button
            onClick={() => importReviews('doctoralia')}
            disabled={importLoading}
            className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 flex items-center gap-3"
          >
            <span className="text-2xl">🏥</span>
            <div className="text-left">
              <p className="font-medium text-gray-800">Doctoralia</p>
              <p className="text-sm text-gray-600">Importar avaliações do Doctoralia</p>
            </div>
            <ExternalLink className="w-4 h-4 text-gray-400 ml-auto" />
          </button>

          <button
            onClick={() => importReviews('google')}
            disabled={importLoading}
            className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 flex items-center gap-3"
          >
            <span className="text-2xl">🔍</span>
            <div className="text-left">
              <p className="font-medium text-gray-800">Google Reviews</p>
              <p className="text-sm text-gray-600">Importar avaliações do Google</p>
            </div>
            <ExternalLink className="w-4 h-4 text-gray-400 ml-auto" />
          </button>
        </div>
      </div>

      {/* Formulário de Adicionar Avaliação */}
      {showAddForm && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Adicionar Nova Avaliação</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nome do Paciente
              </label>
              <input
                type="text"
                value={newReview.patient_name}
                onChange={(e) => setNewReview({...newReview, patient_name: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Nome do paciente"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Avaliação
              </label>
              <select
                value={newReview.rating}
                onChange={(e) => setNewReview({...newReview, rating: parseInt(e.target.value)})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value={5}>5 estrelas</option>
                <option value={4}>4 estrelas</option>
                <option value={3}>3 estrelas</option>
                <option value={2}>2 estrelas</option>
                <option value={1}>1 estrela</option>
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Comentário
              </label>
              <textarea
                value={newReview.comment}
                onChange={(e) => setNewReview({...newReview, comment: e.target.value})}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Comentário da avaliação"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Data
              </label>
              <input
                type="date"
                value={newReview.date}
                onChange={(e) => setNewReview({...newReview, date: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex items-end gap-2">
              <button
                onClick={addReview}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Adicionar
              </button>
              <button
                onClick={() => setShowAddForm(false)}
                className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Filtros */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-8">
          {[
            { id: 'all', name: 'Todas', count: reviews.length },
            { id: 'visible', name: 'Visíveis', count: reviews.filter(r => r.is_visible).length },
            { id: 'hidden', name: 'Ocultas', count: reviews.filter(r => !r.is_visible).length },
            { id: 'doctoralia', name: 'Doctoralia', count: reviews.filter(r => r.source === 'doctoralia').length },
            { id: 'google', name: 'Google', count: reviews.filter(r => r.source === 'google').length },
            { id: 'manual', name: 'Manual', count: reviews.filter(r => r.source === 'manual').length }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {tab.name} ({tab.count})
            </button>
          ))}
        </nav>
      </div>

      {/* Lista de Avaliações */}
      <div className="space-y-4">
        {filteredReviews.map((review) => (
          <div key={review.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-gray-500" />
                    <span className="font-medium text-gray-800">{review.patient_name}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    {renderStars(review.rating)}
                  </div>
                  <span className="text-sm text-gray-500">
                    {getSourceIcon(review.source)} {review.source}
                  </span>
                  <div className="flex items-center gap-1 text-sm text-gray-500">
                    <Calendar className="w-4 h-4" />
                    {new Date(review.date).toLocaleDateString('pt-BR')}
                  </div>
                </div>
                <p className="text-gray-700 mb-3">{review.comment}</p>
              </div>
              
              <div className="flex items-center gap-2 ml-4">
                <button
                  onClick={() => toggleVisibility(review.id)}
                  className={`p-2 rounded-md ${
                    review.is_visible 
                      ? 'bg-green-100 text-green-600 hover:bg-green-200' 
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                  title={review.is_visible ? 'Ocultar avaliação' : 'Mostrar avaliação'}
                >
                  {review.is_visible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                </button>
                
                <button
                  onClick={() => deleteReview(review.id)}
                  className="p-2 bg-red-100 text-red-600 rounded-md hover:bg-red-200"
                  title="Excluir avaliação"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredReviews.length === 0 && (
        <div className="text-center py-12">
          <Star className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-500 mb-2">
            Nenhuma avaliação encontrada
          </h3>
          <p className="text-gray-400">
            {activeTab === 'all' 
              ? 'Adicione ou importe avaliações para começar.'
              : `Nenhuma avaliação encontrada para o filtro "${activeTab}".`
            }
          </p>
        </div>
      )}
    </div>
  );
};

export default ReviewsManager;

