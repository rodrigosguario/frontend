import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';

const BlogPage = () => {
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [loading, setLoading] = useState(true);

  // Posts de exemplo (você pode substituir por dados reais da API)
  const samplePosts = [
    {
      id: 1,
      title: "Transplante Cardíaco: Uma Nova Chance de Vida",
      excerpt: "Entenda como funciona o processo de transplante cardíaco e quais são os critérios para ser um candidato.",
      content: "O transplante cardíaco é um procedimento cirúrgico complexo que oferece uma nova oportunidade de vida para pacientes com insuficiência cardíaca terminal...",
      category: "transplante",
      image: "/api/placeholder/400/250",
      date: "2024-01-15",
      author: "Dr. Rodrigo Sguario",
      readTime: "5 min"
    },
    {
      id: 2,
      title: "Insuficiência Cardíaca: Sintomas e Tratamentos",
      excerpt: "Conheça os principais sintomas da insuficiência cardíaca e as opções de tratamento disponíveis.",
      content: "A insuficiência cardíaca é uma condição em que o coração não consegue bombear sangue de forma eficiente...",
      category: "insuficiencia",
      image: "/api/placeholder/400/250",
      date: "2024-01-10",
      author: "Dr. Rodrigo Sguario",
      readTime: "4 min"
    },
    {
      id: 3,
      title: "Prevenção de Doenças Cardiovasculares",
      excerpt: "Dicas essenciais para manter seu coração saudável e prevenir doenças cardiovasculares.",
      content: "A prevenção é sempre o melhor remédio. Quando se trata de saúde cardiovascular, pequenas mudanças no estilo de vida...",
      category: "prevencao",
      image: "/api/placeholder/400/250",
      date: "2024-01-05",
      author: "Dr. Rodrigo Sguario",
      readTime: "6 min"
    },
    {
      id: 4,
      title: "Avanços na Cardiologia Moderna",
      excerpt: "Descubra as mais recentes inovações tecnológicas no tratamento de doenças cardíacas.",
      content: "A cardiologia moderna tem evoluído rapidamente com novas tecnologias e técnicas...",
      category: "cardiologia",
      image: "/api/placeholder/400/250",
      date: "2023-12-28",
      author: "Dr. Rodrigo Sguario",
      readTime: "7 min"
    },
    {
      id: 5,
      title: "Cuidados Pós-Transplante Cardíaco",
      excerpt: "Orientações importantes para pacientes que passaram por transplante cardíaco.",
      content: "O período pós-transplante é crucial para o sucesso do procedimento. Requer cuidados especiais...",
      category: "transplante",
      image: "/api/placeholder/400/250",
      date: "2023-12-20",
      author: "Dr. Rodrigo Sguario",
      readTime: "8 min"
    },
    {
      id: 6,
      title: "Exercícios Seguros para Cardiopatas",
      excerpt: "Como manter-se ativo de forma segura quando se tem problemas cardíacos.",
      content: "A atividade física é fundamental para a saúde cardiovascular, mas pacientes cardiopatas precisam de orientação...",
      category: "prevencao",
      image: "/api/placeholder/400/250",
      date: "2023-12-15",
      author: "Dr. Rodrigo Sguario",
      readTime: "5 min"
    }
  ];

  const categories = [
    { id: 'all', name: 'Todos os artigos', count: samplePosts.length },
    { id: 'transplante', name: 'Transplante Cardíaco', count: samplePosts.filter(p => p.category === 'transplante').length },
    { id: 'insuficiencia', name: 'Insuficiência Cardíaca', count: samplePosts.filter(p => p.category === 'insuficiencia').length },
    { id: 'prevencao', name: 'Prevenção', count: samplePosts.filter(p => p.category === 'prevencao').length },
    { id: 'cardiologia', name: 'Cardiologia', count: samplePosts.filter(p => p.category === 'cardiologia').length }
  ];

  useEffect(() => {
    // Simular carregamento
    setTimeout(() => {
      setPosts(samplePosts);
      setFilteredPosts(samplePosts);
      setLoading(false);
    }, 1000);
  }, []);

  const handleCategoryFilter = (categoryId) => {
    setSelectedCategory(categoryId);
    if (categoryId === 'all') {
      setFilteredPosts(posts);
    } else {
      setFilteredPosts(posts.filter(post => post.category === categoryId));
    }
  };

  const handleReadMore = (postId) => {
    // Navegar para página individual do post (implementar depois)
    console.log('Lendo post:', postId);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100">
        <Header />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Carregando artigos...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100">
      <Header />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Blog Médico
          </h1>
          <p className="text-xl md:text-2xl mb-8 opacity-90">
            Artigos e informações sobre cardiologia, transplante cardíaco e cuidados com o coração
          </p>
          <div className="max-w-md mx-auto">
            <input
              type="text"
              placeholder="Pesquisar artigos..."
              className="w-full px-4 py-3 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-300"
            />
          </div>
        </div>
      </section>

      {/* Filtros de Categoria */}
      <section className="py-8 bg-white shadow-sm">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap justify-center gap-4">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => handleCategoryFilter(category.id)}
                className={`px-6 py-3 rounded-full font-medium transition-all duration-300 ${
                  selectedCategory === category.id
                    ? 'bg-blue-600 text-white shadow-lg'
                    : 'bg-gray-100 text-gray-700 hover:bg-blue-100 hover:text-blue-600'
                }`}
              >
                {category.name} ({category.count})
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Lista de Posts */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPosts.map((post) => (
              <article
                key={post.id}
                className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
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
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
                        DR
                      </div>
                      <span className="ml-2 text-sm text-gray-600">{post.author}</span>
                    </div>
                    
                    <button
                      onClick={() => handleReadMore(post.id)}
                      className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-300 text-sm font-medium"
                    >
                      Ler artigo
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>

          {filteredPosts.length === 0 && (
            <div className="text-center py-12">
              <div className="text-gray-400 text-6xl mb-4">📝</div>
              <h3 className="text-xl font-semibold text-gray-600 mb-2">
                Nenhum artigo encontrado
              </h3>
              <p className="text-gray-500">
                Tente selecionar uma categoria diferente ou aguarde novos conteúdos.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Newsletter */}
      <section className="bg-blue-600 text-white py-12">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Receba Novos Artigos
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Inscreva-se para receber os mais recentes artigos sobre cardiologia
          </p>
          <div className="max-w-md mx-auto flex gap-4">
            <input
              type="email"
              placeholder="Seu e-mail"
              className="flex-1 px-4 py-3 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-300"
            />
            <button className="bg-yellow-500 text-blue-900 px-6 py-3 rounded-lg font-bold hover:bg-yellow-400 transition-colors duration-300">
              Inscrever
            </button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default BlogPage;
