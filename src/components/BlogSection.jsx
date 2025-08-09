import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const BlogSection = () => {
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [loading, setLoading] = useState(true);

  // Posts de exemplo
  const samplePosts = [
    {
      id: 1,
      title: "Transplante Cardíaco: Uma Nova Chance de Vida",
      excerpt: "Entenda como funciona o processo de transplante cardíaco e quais são os critérios para ser um candidato.",
      category: "transplante",
      image: "/api/placeholder/400/250",
      date: "2024-01-15",
      readTime: "5 min"
    },
    {
      id: 2,
      title: "Insuficiência Cardíaca: Sintomas e Tratamentos",
      excerpt: "Conheça os principais sintomas da insuficiência cardíaca e as opções de tratamento disponíveis.",
      category: "insuficiencia",
      image: "/api/placeholder/400/250",
      date: "2024-01-10",
      readTime: "4 min"
    },
    {
      id: 3,
      title: "Prevenção de Doenças Cardiovasculares",
      excerpt: "Dicas essenciais para manter seu coração saudável e prevenir doenças cardiovasculares.",
      category: "prevencao",
      image: "/api/placeholder/400/250",
      date: "2024-01-05",
      readTime: "6 min"
    }
  ];

  const categories = [
    { id: 'all', name: 'Todos os artigos' },
    { id: 'transplante', name: 'Transplante Cardíaco' },
    { id: 'insuficiencia', name: 'Insuficiência Cardíaca' },
    { id: 'prevencao', name: 'Prevenção' }
  ];

  useEffect(() => {
    // Simular carregamento
    setTimeout(() => {
      setPosts(samplePosts);
      setFilteredPosts(samplePosts);
      setLoading(false);
    }, 500);
  }, []);

  const handleCategoryFilter = (categoryId) => {
    setSelectedCategory(categoryId);
    if (categoryId === 'all') {
      setFilteredPosts(posts);
    } else {
      setFilteredPosts(posts.filter(post => post.category === categoryId));
    }
  };

  const handleViewAllArticles = () => {
    navigate('/blog');
  };

  const handleReadArticle = (postId) => {
    // Por enquanto, navegar para a página de blog
    navigate('/blog');
  };

  if (loading) {
    return (
      <section id="blog" className="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">Blog Médico</h2>
            <div className="animate-pulse">
              <div className="h-4 bg-gray-300 rounded w-3/4 mx-auto mb-2"></div>
              <div className="h-4 bg-gray-300 rounded w-1/2 mx-auto"></div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="blog" className="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-800 mb-4">Blog Médico</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Artigos e informações sobre cardiologia, transplante cardíaco e cuidados com o coração
          </p>
        </div>

        {/* Filtros de Categoria */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => handleCategoryFilter(category.id)}
              className={`px-6 py-3 rounded-full font-medium transition-all duration-300 ${
                selectedCategory === category.id
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'bg-white text-gray-700 hover:bg-blue-100 hover:text-blue-600 shadow-md'
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>

        {/* Posts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {filteredPosts.map((post) => (
            <article
              key={post.id}
              className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
            >
              <div className="relative">
                <img
                  src={post.image}
                  alt={post.title}
                  className="w-full h-48 object-cover"
                />
                <div className="absolute top-4 left-4">
                  <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                    {categories.find(c => c.id === post.category)?.name}
                  </span>
                </div>
              </div>
              
              <div className="p-6">
                <div className="flex items-center text-sm text-gray-500 mb-3">
                  <span>{new Date(post.date).toLocaleDateString('pt-BR')}</span>
                  <span className="mx-2">•</span>
                  <span>{post.readTime}</span>
                </div>
                
                <h3 className="text-xl font-bold text-gray-800 mb-3 line-clamp-2">
                  {post.title}
                </h3>
                
                <p className="text-gray-600 mb-4 line-clamp-3">
                  {post.excerpt}
                </p>
                
                <button
                  onClick={() => handleReadArticle(post.id)}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-300 text-sm font-medium w-full"
                >
                  Ler artigo
                </button>
              </div>
            </article>
          ))}
        </div>

        {/* Ver Todos os Artigos */}
        <div className="text-center">
          <button
            onClick={handleViewAllArticles}
            className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-8 py-4 rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-300 font-semibold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1"
          >
            Ver todos os artigos →
          </button>
        </div>

        {/* Mensagem se não houver posts */}
        {filteredPosts.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">📝</div>
            <h3 className="text-xl font-semibold text-gray-600 mb-2">
              Nenhum artigo encontrado
            </h3>
            <p className="text-gray-500">
              Tente selecionar uma categoria diferente.
            </p>
          </div>
        )}
      </div>
    </section>
  );
};

export default BlogSection;
