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
  FileText,
  Calendar,
  Eye
} from 'lucide-react';
import { blogAPI } from '../../config/api';

const BlogManager = () => {
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [editingPost, setEditingPost] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    content: '',
    excerpt: '',
    author: 'Dr. Rodrigo Sguario',
    published: true
  });

  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = async () => {
    try {
      setLoading(true);
      const response = await blogAPI.getPosts();
      if (response.success && response.data) {
        setPosts(response.data);
      }
    } catch (error) {
      console.error('Erro ao carregar posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      const newPost = {
        ...formData,
        id: editingPost ? editingPost.id : Date.now(),
        slug: generateSlug(formData.title),
        createdAt: editingPost ? editingPost.createdAt : new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      const updatedPosts = editingPost 
        ? posts.map(p => p.id === editingPost.id ? newPost : p)
        : [...posts, newPost];

      // Simular salvamento
      localStorage.setItem('dr_rodrigo_blog_posts', JSON.stringify(updatedPosts));
      
      setPosts(updatedPosts);
      setEditingPost(null);
      setShowForm(false);
      setFormData({
        title: '',
        content: '',
        excerpt: '',
        author: 'Dr. Rodrigo Sguario',
        published: true
      });
    } catch (error) {
      console.error('Erro ao salvar post:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (post) => {
    setEditingPost(post);
    setFormData({
      title: post.title,
      content: post.content,
      excerpt: post.excerpt,
      author: post.author,
      published: post.published
    });
    setShowForm(true);
  };

  const handleDelete = (postId) => {
    if (window.confirm('Tem certeza que deseja excluir este artigo?')) {
      const updatedPosts = posts.filter(p => p.id !== postId);
      setPosts(updatedPosts);
      localStorage.setItem('dr_rodrigo_blog_posts', JSON.stringify(updatedPosts));
    }
  };

  const generateSlug = (title) => {
    return title
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim('-');
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
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
              <FileText className="w-8 h-8 text-blue-600 mr-3" />
              <div>
                <h1 className="text-xl font-semibold text-gray-900">Gerenciar Blog</h1>
                <p className="text-sm text-gray-500">Crie e edite artigos do blog</p>
              </div>
            </div>
            <Button onClick={() => setShowForm(true)} className="flex items-center">
              <Plus className="w-4 h-4 mr-2" />
              Novo Artigo
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {showForm && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>{editingPost ? 'Editar Artigo' : 'Novo Artigo'}</CardTitle>
              <CardDescription>
                {editingPost ? 'Edite as informações do artigo' : 'Crie um novo artigo para o blog'}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="title">Título</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Título do artigo"
                />
              </div>
              
              <div>
                <Label htmlFor="excerpt">Resumo</Label>
                <Textarea
                  id="excerpt"
                  value={formData.excerpt}
                  onChange={(e) => setFormData(prev => ({ ...prev, excerpt: e.target.value }))}
                  placeholder="Breve resumo do artigo"
                  rows={3}
                />
              </div>
              
              <div>
                <Label htmlFor="content">Conteúdo</Label>
                <Textarea
                  id="content"
                  value={formData.content}
                  onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                  placeholder="Conteúdo completo do artigo"
                  rows={10}
                />
              </div>
              
              <div className="flex justify-end space-x-2">
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setShowForm(false);
                    setEditingPost(null);
                    setFormData({
                      title: '',
                      content: '',
                      excerpt: '',
                      author: 'Dr. Rodrigo Sguario',
                      published: true
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
          {posts.map((post) => (
            <Card key={post.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <CardTitle className="text-lg line-clamp-2">{post.title}</CardTitle>
                    <CardDescription className="mt-2">
                      <div className="flex items-center text-sm text-gray-500">
                        <Calendar className="w-4 h-4 mr-1" />
                        {formatDate(post.createdAt)}
                      </div>
                    </CardDescription>
                  </div>
                  <div className="flex space-x-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEdit(post)}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(post.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 line-clamp-3 mb-4">
                  {post.excerpt || post.content.substring(0, 150) + '...'}
                </p>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">Por {post.author}</span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => window.open(`/blog/${post.slug}`, '_blank')}
                  >
                    <Eye className="w-4 h-4 mr-1" />
                    Visualizar
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {posts.length === 0 && !loading && (
          <Card>
            <CardContent className="text-center py-12">
              <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum artigo encontrado</h3>
              <p className="text-gray-600 mb-4">Comece criando seu primeiro artigo do blog.</p>
              <Button onClick={() => setShowForm(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Criar Primeiro Artigo
              </Button>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
};

export default BlogManager;
