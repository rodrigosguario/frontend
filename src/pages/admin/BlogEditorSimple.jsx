import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Save, 
  ArrowLeft,
  FileText
} from 'lucide-react';
import { blogAPI } from '@/config/api';

const BlogEditorSimple = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeView, setActiveView] = useState('list'); // list, edit, new
  const [selectedPost, setSelectedPost] = useState(null);
  const [postData, setPostData] = useState({
    title: '',
    content: ''
  });

  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = async () => {
    setLoading(true);
    try {
      // Carregar posts reais da API
      const response = await blogAPI.getPosts();
      const postsData = response.data || [];
      
      // Transformar dados se necessário
      const transformedPosts = postsData.map(post => ({
        id: post.id,
        titulo: post.titulo,
        conteudo: post.conteudo,
        data_criacao: post.data_criacao
      }));
      
      setPosts(transformedPosts);
    } catch (error) {
      console.error('Erro ao carregar posts:', error);
      // Fallback para dados de exemplo apenas se API falhar
      setPosts([
        {
          id: 1,
          titulo: 'Post de Exemplo 1',
          conteudo: 'Este é o conteúdo do primeiro post de exemplo.',
          data_criacao: '2025-08-05'
        },
        {
          id: 2,
          titulo: 'Post de Exemplo 2',
          conteudo: 'Este é o conteúdo do segundo post de exemplo.',
          data_criacao: '2025-08-04'
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const savePost = async () => {
    if (!postData.title || !postData.content) {
      alert("Título e Conteúdo são obrigatórios!");
      return;
    }

    setLoading(true);
    try {
      const postPayload = {
        titulo: postData.title,
        conteudo: postData.content
      };

      if (selectedPost) {
        // Atualizar post existente usando API real
        await blogAPI.updatePost(selectedPost.id, postPayload);
        
        // Atualizar estado local
        setPosts(posts.map(post => 
          post.id === selectedPost.id 
            ? { ...post, titulo: postData.title, conteudo: postData.content }
            : post
        ));
        alert('Post atualizado com sucesso!');
      } else {
        // Criar novo post usando API real
        const response = await blogAPI.createPost(postPayload);
        
        // Recarregar posts para pegar o novo post com ID do banco
        await loadPosts();
        alert('Post criado com sucesso!');
      }
      
      setActiveView('list');
      resetEditor();
    } catch (error) {
      console.error('Erro ao salvar post:', error);
      alert('Erro ao salvar post. Verifique sua conexão e tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const deletePost = async (postId) => {
    if (!window.confirm('Tem certeza que deseja deletar este post?')) {
      return;
    }

    setLoading(true);
    try {
      // Deletar post usando API real
      await blogAPI.deletePost(postId);
      
      // Atualizar estado local removendo o post
      setPosts(posts.filter(post => post.id !== postId));
      alert('Post deletado com sucesso!');
    } catch (error) {
      console.error('Erro ao deletar post:', error);
      alert('Erro ao deletar post. Verifique sua conexão e tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const editPost = (post) => {
    setSelectedPost(post);
    setPostData({
      title: post.titulo,
      content: post.conteudo
    });
    setActiveView('edit');
  };

  const resetEditor = () => {
    setSelectedPost(null);
    setPostData({
      title: '',
      content: ''
    });
  };

  const handleNewPost = () => {
    resetEditor();
    setActiveView('new');
  };

  const handleBack = () => {
    setActiveView('list');
    resetEditor();
  };

  if (loading && activeView === 'list') {
    return (
      <div className="p-8">
        <div className="text-center">
          <FileText className="w-12 h-12 text-primary mx-auto mb-4 animate-pulse" />
          <p className="text-muted-foreground">Carregando posts...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              {activeView === 'list' ? 'Gerenciar Blog' : 
               activeView === 'new' ? 'Novo Post' : 'Editar Post'}
            </h1>
            <p className="text-muted-foreground mt-2">
              {activeView === 'list' ? 'Gerencie os posts do seu blog' : 
               'Preencha as informações do post'}
            </p>
          </div>
          
          {activeView === 'list' && (
            <button
              onClick={handleNewPost}
              className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Novo Post
            </button>
          )}
          
          {activeView !== 'list' && (
            <button
              onClick={handleBack}
              className="flex items-center gap-2 bg-muted text-muted-foreground px-4 py-2 rounded-lg hover:bg-muted/80 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Voltar
            </button>
          )}
        </div>
      </div>

      {/* Lista de Posts */}
      {activeView === 'list' && (
        <div className="space-y-4">
          {posts.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">
                Nenhum post encontrado
              </h3>
              <p className="text-muted-foreground mb-4">
                Comece criando seu primeiro post
              </p>
              <button
                onClick={handleNewPost}
                className="bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors"
              >
                Criar Primeiro Post
              </button>
            </div>
          ) : (
            posts.map((post) => (
              <div key={post.id} className="bg-card border border-border rounded-lg p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-foreground mb-2">
                      {post.titulo}
                    </h3>
                    <p className="text-muted-foreground mb-4 line-clamp-2">
                      {post.conteudo.substring(0, 150)}...
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Criado em: {new Date(post.data_criacao).toLocaleDateString('pt-BR')}
                    </p>
                  </div>
                  
                  <div className="flex items-center gap-2 ml-4">
                    <button
                      onClick={() => editPost(post)}
                      className="p-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-colors"
                      title="Editar"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => deletePost(post.id)}
                      className="p-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg transition-colors"
                      title="Deletar"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Editor de Post */}
      {(activeView === 'new' || activeView === 'edit') && (
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Título do Post
            </label>
            <input
              type="text"
              value={postData.title}
              onChange={(e) => setPostData({ ...postData, title: e.target.value })}
              className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="Digite o título do post..."
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Conteúdo do Post
            </label>
            <textarea
              value={postData.content}
              onChange={(e) => setPostData({ ...postData, content: e.target.value })}
              rows={12}
              className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
              placeholder="Digite o conteúdo do post..."
            />
          </div>
          
          <div className="flex items-center gap-4">
            <button
              onClick={savePost}
              disabled={loading}
              className="flex items-center gap-2 bg-primary text-primary-foreground px-6 py-2 rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Save className="w-4 h-4" />
              {loading ? 'Salvando...' : 'Salvar Post'}
            </button>
            
            <button
              onClick={handleBack}
              className="px-6 py-2 border border-border rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
            >
              Cancelar
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default BlogEditorSimple;
