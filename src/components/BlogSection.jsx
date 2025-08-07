import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, ArrowRight, BookOpen, Eye, Search } from 'lucide-react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { blogAPI } from '@/config/api';

const BlogSection = () => {
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [featuredPosts, setFeaturedPosts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('');

  useEffect(() => {
    loadBlogData();
  }, []);

  const loadBlogData = async () => {
    try {
      // Carregar posts usando a API configurada
      const postsResponse = await blogAPI.getPosts();
      const postsData = postsResponse.data || [];
      
      // Transformar dados da API para o formato esperado pelo componente
      const transformedPosts = postsData.map(post => ({
        id: post.id,
        title: post.titulo,
        excerpt: post.conteudo.substring(0, 150) + '...',
        category: "Cardiologia",
        read_time: Math.ceil(post.conteudo.length / 1000) || 3,
        created_at: post.data_criacao,
        views: Math.floor(Math.random() * 200) + 50,
        is_featured: Math.random() > 0.7
      }));

      setPosts(transformedPosts);
      setFeaturedPosts(transformedPosts.filter(p => p.is_featured));
      
      // Definir categorias padrão
      setCategories([
        { name: "Transplante Cardíaco", color: "#EF4444" },
        { name: "Insuficiência Cardíaca", color: "#3B82F6" },
        { name: "Cardiologia", color: "#10B981" }
      ]);
      
    } catch (error) {
      console.error('Erro ao carregar dados do blog:', error);
      // Fallback para dados estáticos se a API não estiver disponível
      setFallbackData();
    } finally {
      setLoading(false);
    }
  };

  const setFallbackData = () => {
    const fallbackPosts = [
      {
        id: 1,
        title: "Transplante Cardíaco: Quando é Necessário?",
        excerpt: "Entenda os critérios médicos que indicam a necessidade de um transplante cardíaco e como é feita a avaliação do paciente.",
        category: "Transplante Cardíaco",
        read_time: 5,
        created_at: "2025-01-15T00:00:00Z",
        views: 245,
        is_featured: true
      },
      {
        id: 2,
        title: "Insuficiência Cardíaca: Sinais de Alerta",
        excerpt: "Conheça os principais sintomas da insuficiência cardíaca e quando procurar ajuda médica especializada.",
        category: "Insuficiência Cardíaca",
        read_time: 4,
        created_at: "2025-01-10T00:00:00Z",
        views: 189,
        is_featured: false
      },
      {
        id: 3,
        title: "Cuidados Pós-Transplante Cardíaco",
        excerpt: "Guia completo sobre os cuidados necessários após um transplante cardíaco para garantir o sucesso do procedimento.",
        category: "Transplante Cardíaco",
        read_time: 7,
        created_at: "2025-01-05T00:00:00Z",
        views: 156,
        is_featured: true
      }
    ];

    setFeaturedPosts(fallbackPosts.filter(p => p.is_featured));
    setPosts(fallbackPosts);
    setCategories([
      { name: "Transplante Cardíaco", color: "#EF4444" },
      { name: "Insuficiência Cardíaca", color: "#3B82F6" },
      { name: "Prevenção", color: "#10B981" }
    ]);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const getCategoryColor = (categoryName) => {
    const category = categories.find(cat => cat.name === categoryName);
    return category?.color || '#3B82F6';
  };

  const handleReadArticle = (post) => {
    // Criar um slug baseado no título do post
    const slug = post.title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
    
    navigate(`/blog/${slug}`, { 
      state: { post } 
    });
  };

  const filteredPosts = selectedCategory 
    ? posts.filter(post => post.category === selectedCategory)
    : posts;

  if (loading) {
    return (
      <section id="blog" className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <BookOpen className="w-12 h-12 text-primary mx-auto mb-4 animate-pulse" />
            <p className="text-muted-foreground">Carregando artigos...</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="blog" className="py-20 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header da seção */}
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
            Blog Médico
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Artigos e informações sobre cardiologia, transplante cardíaco e cuidados com o coração
          </p>
        </motion.div>

        {/* Posts em destaque */}
        {featuredPosts.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="mb-16"
          >
            <h3 className="text-2xl font-semibold text-foreground mb-8 text-center">
              Artigos em Destaque
            </h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredPosts.map((post, index) => (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <Card className="h-full card-shadow hover-lift border-0 overflow-hidden">
                    <div className="aspect-video bg-gradient-to-br from-primary/20 to-accent/20 relative overflow-hidden">
                      <div className="absolute inset-0 flex items-center justify-center">
                        <BookOpen className="w-12 h-12 text-primary/60" />
                      </div>
                      <Badge 
                        className="absolute top-4 left-4 text-white"
                        style={{ backgroundColor: getCategoryColor(post.category) }}
                      >
                        {post.category}
                      </Badge>
                      <Badge className="absolute top-4 right-4 bg-amber-500 text-white">
                        Destaque
                      </Badge>
                    </div>
                    
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg leading-tight hover:text-primary transition-all duration-300 ease-in-out cursor-pointer">
                        {post.title}
                      </CardTitle>
                    </CardHeader>
                    
                    <CardContent className="space-y-4">
                      <p className="text-muted-foreground text-sm leading-relaxed">
                        {post.excerpt}
                      </p>
                      
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4" />
                          {formatDate(post.created_at)}
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            {post.read_time} min
                          </div>
                          <div className="flex items-center gap-1">
                            <Eye className="w-4 h-4" />
                            {post.views}
                          </div>
                        </div>
                      </div>
                      
                      <Button 
                        variant="ghost" 
                        size="sm"
                        className="w-full justify-between group hover:bg-primary/5"
                        onClick={() => handleReadArticle(post)}
                      >
                        Ler artigo
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-all duration-300 ease-in-out" />
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Filtros de categoria */}
        {categories.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="mb-12"
          >
            <div className="flex flex-wrap justify-center gap-3">
              <Button
                variant={selectedCategory === '' ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory('')}
                className={selectedCategory === '' ? "medical-gradient text-white" : ""}
              >
                Todos os artigos
              </Button>
              {categories.map((category) => (
                <Button
                  key={category.name}
                  variant={selectedCategory === category.name ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(category.name)}
                  className={selectedCategory === category.name ? "medical-gradient text-white" : ""}
                >
                  {category.name}
                </Button>
              ))}
            </div>
          </motion.div>
        )}

        {/* Posts do blog */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {filteredPosts.map((post, index) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <Card className="h-full card-shadow hover-lift border-0 overflow-hidden">
                <div className="aspect-video bg-muted relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                    <BookOpen className="w-12 h-12 text-primary/60" />
                  </div>
                  <Badge 
                    className="absolute top-4 left-4 text-white"
                    style={{ backgroundColor: getCategoryColor(post.category) }}
                  >
                    {post.category}
                  </Badge>
                </div>
                
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg leading-tight hover:text-primary transition-all duration-300 ease-in-out cursor-pointer">
                    {post.title}
                  </CardTitle>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {post.excerpt}
                  </p>
                  
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      {formatDate(post.created_at)}
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {post.read_time} min
                      </div>
                      <div className="flex items-center gap-1">
                        <Eye className="w-4 h-4" />
                        {post.views}
                      </div>
                    </div>
                  </div>
                  
                  <Button 
                    variant="ghost" 
                    size="sm"
                    className="w-full justify-between group hover:bg-primary/5"
                    onClick={() => handleReadArticle(post)}
                  >
                    Ler artigo
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-all duration-300 ease-in-out" />
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Call to action */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <Button 
            variant="outline"
            size="lg"
            className="border-primary text-primary hover:bg-primary hover:text-white"
          >
            Ver todos os artigos
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </motion.div>
      </div>
    </section>
  );
};

export default BlogSection;

