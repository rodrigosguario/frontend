import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, ArrowRight, BookOpen } from 'lucide-react';
import { motion } from 'framer-motion';
import { blogAPI } from '@/config/api';

const Blog = () => {
  const [blogPosts, setBlogPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = async () => {
    try {
      const response = await blogAPI.getPosts();
      const postsData = response.data || [];
      
      // Transformar dados da API para o formato esperado
      const transformedPosts = postsData.map(post => ({
        id: post.id,
        title: post.titulo,
        excerpt: post.conteudo.substring(0, 150) + '...',
        category: "Cardiologia",
        readTime: Math.ceil(post.conteudo.length / 1000) + " min" || "3 min",
        date: post.data_criacao,
        image: "/api/placeholder/400/250"
      }));

      setBlogPosts(transformedPosts);
    } catch (error) {
      console.error('Erro ao carregar posts:', error);
      // Fallback para dados estáticos
      setBlogPosts([
        {
          id: 1,
          title: "Transplante Cardíaco: Quando é Necessário?",
          excerpt: "Entenda os critérios médicos que indicam a necessidade de um transplante cardíaco e como é feita a avaliação do paciente.",
          category: "Transplante",
          readTime: "5 min",
          date: "2025-01-15",
          image: "/api/placeholder/400/250"
        },
        {
          id: 2,
          title: "Insuficiência Cardíaca: Sinais de Alerta",
          excerpt: "Conheça os principais sintomas da insuficiência cardíaca e quando procurar ajuda médica especializada.",
          category: "Prevenção",
          readTime: "4 min",
          date: "2025-01-10",
          image: "/api/placeholder/400/250"
        },
        {
          id: 3,
          title: "Cuidados Pós-Transplante Cardíaco",
          excerpt: "Guia completo sobre os cuidados necessários após um transplante cardíaco para garantir o sucesso do procedimento.",
          category: "Pós-operatório",
          readTime: "7 min",
          date: "2025-01-05",
          image: "/api/placeholder/400/250"
        }
      ]);
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

        {/* Loading state */}
        {loading && (
          <div className="text-center mb-12">
            <BookOpen className="w-12 h-12 text-primary mx-auto mb-4 animate-pulse" />
            <p className="text-muted-foreground">Carregando artigos...</p>
          </div>
        )}

        {/* Posts do blog */}
        {!loading && (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {blogPosts.map((post, index) => (
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
                  <Badge className="absolute top-4 left-4 bg-primary text-primary-foreground">
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
                      {formatDate(post.date)}
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      {post.readTime}
                    </div>
                  </div>
                  
                  <Button 
                    variant="ghost" 
                    size="sm"
                    className="w-full justify-between group hover:bg-primary/5"
                  >
                    Ler artigo
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-all duration-300 ease-in-out" />
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        </div>
        )}

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

export default Blog;

