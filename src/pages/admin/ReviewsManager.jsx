import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  ArrowLeft, 
  Plus, 
  Edit, 
  Trash2, 
  Save, 
  CheckCircle, 
  Star,
  User,
  Calendar,
  MessageSquare
} from 'lucide-react';
import { reviewsAPI } from '../../config/api';

const ReviewsManager = () => {
  const navigate = useNavigate();
  const [reviews, setReviews] = useState([]);
  const [editingReview, setEditingReview] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    rating: 5,
    comment: '',
    approved: true
  });

  useEffect(() => {
    loadReviews();
  }, []);

  const loadReviews = async () => {
    try {
      setLoading(true);
      const response = await reviewsAPI.getReviews();
      if (response.success && response.data) {
        setReviews(response.data);
      }
    } catch (error) {
      console.error('Erro ao carregar avaliações:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      const newReview = {
        ...formData,
        id: editingReview ? editingReview.id : Date.now(),
        createdAt: editingReview ? editingReview.createdAt : new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      const updatedReviews = editingReview 
        ? reviews.map(r => r.id === editingReview.id ? newReview : r)
        : [...reviews, newReview];

      // Simular salvamento
      localStorage.setItem('dr_rodrigo_reviews', JSON.stringify(updatedReviews));
      
      setReviews(updatedReviews);
      setEditingReview(null);
      setShowForm(false);
      setFormData({
        name: '',
        rating: 5,
        comment: '',
        approved: true
      });
    } catch (error) {
      console.error('Erro ao salvar avaliação:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (review) => {
    setEditingReview(review);
    setFormData({
      name: review.name,
      rating: review.rating,
      comment: review.comment,
      approved: review.approved
    });
    setShowForm(true);
  };

  const handleDelete = (reviewId) => {
    if (window.confirm('Tem certeza que deseja excluir esta avaliação?')) {
      const updatedReviews = reviews.filter(r => r.id !== reviewId);
      setReviews(updatedReviews);
      localStorage.setItem('dr_rodrigo_reviews', JSON.stringify(updatedReviews));
    }
  };

  const handleToggleApproval = (reviewId) => {
    const updatedReviews = reviews.map(review => 
      review.id === reviewId 
        ? { ...review, approved: !review.approved }
        : review
    );
    setReviews(updatedReviews);
    localStorage.setItem('dr_rodrigo_reviews', JSON.stringify(updatedReviews));
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
      />
    ));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Button variant="ghost" size="sm" onClick={() => navigate('/admin/dashboard')} className="mr-4">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Voltar
              </Button>
              <Star className="w-8 h-8 text-blue-600 mr-3" />
              <div>
                <h1 className="text-xl font-semibold text-gray-900">Gerenciar Avaliações</h1>
                <p className="text-sm text-gray-500">Gerencie as avaliações dos pacientes</p>
              </div>
            </div>
            <Button onClick={() => setShowForm(true)} className="flex items-center">
              <Plus className="w-4 h-4 mr-2" />
              Nova Avaliação
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {showForm && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>{editingReview ? 'Editar Avaliação' : 'Nova Avaliação'}</CardTitle>
              <CardDescription>
                {editingReview ? 'Edite as informações da avaliação' : 'Adicione uma nova avaliação'}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="name">Nome do Paciente</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Nome completo"
                />
              </div>
              
              <div>
                <Label htmlFor="rating">Avaliação</Label>
                <div className="flex items-center space-x-2 mt-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, rating: star }))}
                      className="focus:outline-none"
                    >
                      <Star
                        className={`w-6 h-6 ${
                          star <= formData.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                        }`}
                      />
                    </button>
                  ))}
                  <span className="ml-2 text-sm text-gray-600">{formData.rating}/5</span>
                </div>
              </div>
              
              <div>
                <Label htmlFor="comment">Comentário</Label>
                <Textarea
                  id="comment"
                  value={formData.comment}
                  onChange={(e) => setFormData(prev => ({ ...prev, comment: e.target.value }))}
                  placeholder="Comentário da avaliação"
                  rows={4}
                />
              </div>
              
              <div className="flex justify-end space-x-2">
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setShowForm(false);
                    setEditingReview(null);
                    setFormData({
                      name: '',
                      rating: 5,
                      comment: '',
                      approved: true
                    });
                  }}
                >
                  Cancelar
                </Button>
                <Button onClick={handleSave} disabled={saving} className="flex items-center">
                  <Save className="w-4 h-4 mr-2" />
                  {saving ? 'Salvando...' : 'Salvar'}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reviews.map((review) => (
            <Card key={review.id} className={`hover:shadow-lg transition-shadow ${
              !review.approved ? 'opacity-60' : ''
            }`}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <CardTitle className="text-lg flex items-center">
                      <User className="w-4 h-4 mr-2 text-gray-500" />
                      {review.name}
                    </CardTitle>
                    <CardDescription className="mt-2">
                      <div className="flex items-center text-sm text-gray-500">
                        <Calendar className="w-4 h-4 mr-1" />
                        {formatDate(review.createdAt)}
                      </div>
                    </CardDescription>
                  </div>
                  <div className="flex space-x-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEdit(review)}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleToggleApproval(review.id)}
                      className={review.approved ? 'text-green-600' : 'text-yellow-600'}
                    >
                      <CheckCircle className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(review.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center mb-3">
                  <div className="flex mr-2">
                    {renderStars(review.rating)}
                  </div>
                  <span className="text-sm text-gray-600">{review.rating}/5</span>
                </div>
                <p className="text-gray-600 mb-4 line-clamp-3">
                  {review.comment}
                </p>
                <div className="flex justify-between items-center">
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    review.approved 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {review.approved ? 'Aprovada' : 'Pendente'}
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {reviews.length === 0 && !loading && (
          <Card>
            <CardContent className="text-center py-12">
              <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhuma avaliação encontrada</h3>
              <p className="text-gray-600 mb-4">Comece adicionando a primeira avaliação.</p>
              <Button onClick={() => setShowForm(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Adicionar Primeira Avaliação
              </Button>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
};

export default ReviewsManager;

