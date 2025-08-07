import React, { useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, ArrowLeft, BookOpen, Eye, Share2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { blogAPI } from '@/config/api';

const BlogPost = () => {
  const { slug } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadPost();
  }, [slug]);

  const loadPost = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Se temos o post no state da navegação, usar ele
      if (location.state?.post) {
        setPost(location.state.post);
        setLoading(false);
        return;
      }

      // Caso contrário, tentar carregar da API
      const response = await blogAPI.getPosts();
      const posts = response.data || [];
      
      console.log('Posts carregados:', posts);
      console.log('Slug procurado:', slug);
      
      // Encontrar o post pelo slug de forma mais robusta
      const foundPost = posts.find(p => {
        if (!p.titulo) return false;
        
        const postSlug = p.titulo
          .toLowerCase()
          .normalize('NFD')
          .replace(/[\u0300-\u036f]/g, '') // Remove acentos
          .replace(/[^a-z0-9\s-]/g, '')
          .replace(/\s+/g, '-')
          .replace(/-+/g, '-')
          .trim();
        
        console.log('Slug do post:', postSlug, 'vs slug procurado:', slug);
        return postSlug === slug;
      });

      if (foundPost) {
        console.log('Post encontrado:', foundPost);
        setPost({
          id: foundPost.id,
          title: foundPost.titulo,
          content: foundPost.conteudo,
          excerpt: foundPost.conteudo.substring(0, 150) + '...',
          category: "Cardiologia",
          read_time: Math.ceil(foundPost.conteudo.length / 1000) || 3,
          created_at: foundPost.data_criacao,
          views: Math.floor(Math.random() * 200) + 50,
          author: "Dr. Rodrigo Sguario"
        });
      } else {
        console.log('Post não encontrado para slug:', slug);
        setError('Artigo não encontrado');
      }
    } catch (error) {
      console.error('Erro ao carregar artigo:', error);
      setError('Erro ao carregar o artigo');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: post?.title,
        text: post?.excerpt,
        url: window.location.href
      });
    } else {
      // Fallback para copiar URL
      navigator.clipboard.writeText(window.location.href);
      alert('Link copiado para a área de transferência!');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="text-center">
            <BookOpen className="w-12 h-12 text-primary mx-auto mb-4 animate-pulse" />
            <p className="text-muted-foreground">Carregando artigo...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-foreground mb-4">
              Artigo não encontrado
            </h1>
            <p className="text-muted-foreground mb-6">
              O artigo que você está procurando não foi encontrado.
            </p>
            <Button onClick={() => navigate('/')}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar ao início
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Botão voltar */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
          className="mb-8"
        >
          <Button 
            variant="ghost" 
            onClick={() => navigate('/')}
            className="text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar ao início
          </Button>
        </motion.div>

        {/* Artigo */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="border-0 shadow-lg">
            {/* Header do artigo */}
            <CardHeader className="pb-6">
              <div className="space-y-4">
                {/* Categoria */}
                <Badge className="w-fit" style={{ backgroundColor: '#3B82F6' }}>
                  {post.category}
                </Badge>

                {/* Título */}
                <CardTitle className="text-3xl lg:text-4xl font-bold text-foreground leading-tight">
                  {post.title}
                </CardTitle>

                {/* Meta informações */}
                <div className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    {formatDate(post.created_at)}
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    {post.read_time} min de leitura
                  </div>
                  <div className="flex items-center gap-2">
                    <Eye className="w-4 h-4" />
                    {post.views} visualizações
                  </div>
                  <div className="flex items-center gap-2">
                    <span>Por {post.author}</span>
                  </div>
                </div>
              </div>
            </CardHeader>

            {/* Conteúdo do artigo */}
            <CardContent className="space-y-6">
              {/* Imagem de destaque */}
              <div className="aspect-video bg-gradient-to-br from-primary/20 to-accent/20 rounded-lg flex items-center justify-center">
                <BookOpen className="w-16 h-16 text-primary/60" />
              </div>

              {/* Conteúdo */}
              <div className="prose prose-lg max-w-none">
                <div className="text-foreground leading-relaxed space-y-4">
                  {post.content.split('\n').map((paragraph, index) => (
                    <p key={index} className="text-base leading-7">
                      {paragraph}
                    </p>
                  ))}
                </div>
              </div>

              {/* Botões de ação */}
              <div className="flex flex-wrap gap-4 pt-8 border-t">
                <Button 
                  variant="outline"
                  onClick={handleShare}
                  className="flex items-center gap-2"
                >
                  <Share2 className="w-4 h-4" />
                  Compartilhar
                </Button>
                <Button 
                  onClick={() => navigate('/')}
                  className="flex items-center gap-2"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Voltar ao blog
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default BlogPost;

