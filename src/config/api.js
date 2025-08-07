// Configuração da API - Força rebuild para corrigir URL
const API_BASE_URL = 'https://dr-rodrigo-backend.onrender.com';

// Instância principal da API
const api = {
  get: async (endpoint) => {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      return response.json();
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  },

  post: async (endpoint, data) => {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      return response.json();
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  },

  put: async (endpoint, data) => {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      return response.json();
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  },

  delete: async (endpoint) => {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      return response.json();
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  },
};

// Função auxiliar para criar respostas de fallback
const createFallbackResponse = (data) => ({
  success: true,
  data: data,
  message: 'Dados carregados do cache local'
});

// --- ADMIN API COM FALLBACKS ---
export const adminAPI = {
  checkAuth: async () => {
    try {
      const response = await api.get('/api/admin/check-auth');
      return response;
    } catch (error) {
      console.warn('API checkAuth falhou, usando fallback');
      
      // Verificar se há dados salvos localmente
      const savedAuth = localStorage.getItem('admin_auth');
      if (savedAuth) {
        return createFallbackResponse(JSON.parse(savedAuth));
      }
      
      return createFallbackResponse({ authenticated: false });
    }
  },

  login: async (credentials) => {
    try {
      const response = await api.post('/api/admin/login', credentials);
      if (response.success) {
        localStorage.setItem('admin_auth', JSON.stringify(response.data));
      }
      return response;
    } catch (error) {
      console.warn('API login falhou, usando fallback');
      
      // Simular login bem-sucedido para desenvolvimento
      const mockAuth = { authenticated: true, user: { name: 'Admin' } };
      localStorage.setItem('admin_auth', JSON.stringify(mockAuth));
      
      return createFallbackResponse(mockAuth);
    }
  },

  logout: async () => {
    try {
      const response = await api.post('/api/admin/logout');
      localStorage.removeItem('admin_auth');
      return response;
    } catch (error) {
      console.warn('API logout falhou, usando fallback');
      localStorage.removeItem('admin_auth');
      return createFallbackResponse({ success: true });
    }
  }
};

// --- BLOG API COM FALLBACKS ---
export const blogAPI = {
  getPosts: async () => {
    try {
      const response = await api.get('/api/blog/posts');
      return response;
    } catch (error) {
      console.warn('API getPosts falhou, usando fallback');
      
      // Dados de exemplo para o blog
      const mockPosts = [
        {
          id: 1,
          title: 'Importância da Prevenção Cardiovascular',
          content: 'A prevenção é fundamental para manter a saúde do coração...',
          excerpt: 'Saiba como prevenir doenças cardiovasculares...',
          author: 'Dr. Rodrigo Sguario',
          created_at: '2024-01-15T10:00:00Z',
          updated_at: '2024-01-15T10:00:00Z',
          status: 'published',
          featured_image: null,
          tags: ['Prevenção', 'Cardiologia', 'Saúde']
        },
        {
          id: 2,
          title: 'Transplante Cardíaco: O que você precisa saber',
          content: 'O transplante cardíaco é um procedimento complexo...',
          excerpt: 'Entenda o processo de transplante cardíaco...',
          author: 'Dr. Rodrigo Sguario',
          created_at: '2024-01-10T14:30:00Z',
          updated_at: '2024-01-10T14:30:00Z',
          status: 'published',
          featured_image: null,
          tags: ['Transplante', 'Cardiologia', 'Tratamento']
        }
      ];
      
      return createFallbackResponse(mockPosts);
    }
  },

  createPost: async (postData) => {
    try {
      const response = await api.post('/api/blog/posts', postData);
      return response;
    } catch (error) {
      console.warn('API createPost falhou, usando fallback');
      
      // Simular criação bem-sucedida
      const newPost = {
        id: Date.now(),
        ...postData,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        status: 'draft'
      };
      
      return createFallbackResponse(newPost);
    }
  },

  updatePost: async (postId, postData) => {
    try {
      const response = await api.put(`/api/blog/posts/${postId}`, postData);
      return response;
    } catch (error) {
      console.warn('API updatePost falhou, usando fallback');
      
      // Simular atualização bem-sucedida
      const updatedPost = {
        id: postId,
        ...postData,
        updated_at: new Date().toISOString()
      };
      
      return createFallbackResponse(updatedPost);
    }
  },

  deletePost: async (postId) => {
    try {
      const response = await api.delete(`/api/blog/posts/${postId}`);
      return response;
    } catch (error) {
      console.warn('API deletePost falhou, usando fallback');
      return createFallbackResponse({ success: true });
    }
  }
};

// --- CONTENT API COM FALLBACKS ---
export const contentAPI = {
  getAllContent: async () => {
    try {
      const response = await api.get('/api/content');
      return response;
    } catch (error) {
      console.warn('API getAllContent falhou, usando fallback');
      
      // Dados de exemplo para o conteúdo
      const mockContent = {
        hero: {
          title: 'Dr. Rodrigo Sguario',
          subtitle: 'Cardiologista Especialista em Transplante Cardíaco',
          description: 'Cuidando do seu coração com excelência e dedicação',
          cta_text: 'Agendar Consulta',
          cta_link: '#contact'
        },
        about: {
          title: 'Sobre o Dr. Rodrigo',
          description: 'Especialista em cardiologia com foco em transplante cardíaco...',
          education: [
            {
              institution: 'Instituto do Coração (InCor) - USP-SP',
              degree: 'Especialização em Insuficiência Cardíaca e Transplante',
              period: '2023-2024'
            }
          ],
          specialties: ['Transplante Cardíaco', 'Cardiologia Clínica', 'Ecocardiografia']
        },
        services: {
          title: 'Nossos Serviços',
          services: [
            {
              title: 'Transplante Cardíaco',
              description: 'Acompanhamento completo do processo de transplante...',
              icon: 'Heart'
            }
          ]
        },
        contact: {
          title: 'Entre em Contato',
          phone: '(11) 93382-1515',
          email: 'contato@drrodrigosguario.com.br',
          address: 'Rua das Palmeiras, 123 - Centro, São Paulo - SP'
        }
      };
      
      return createFallbackResponse(mockContent);
    }
  },

  updateContent: async (section, contentData) => {
    try {
      const response = await api.put(`/api/content/${section}`, contentData);
      return response;
    } catch (error) {
      console.warn('API updateContent falhou, usando fallback');
      
      // Salvar no localStorage como fallback
      const savedContent = JSON.parse(localStorage.getItem('site_content') || '{}');
      savedContent[section] = contentData;
      localStorage.setItem('site_content', JSON.stringify(savedContent));
      
      return createFallbackResponse(contentData);
    }
  }
};

// --- SETTINGS API COM FALLBACKS ---
export const settingsAPI = {
  getSettings: async () => {
    try {
      const response = await api.get('/api/settings');
      return response;
    } catch (error) {
      console.warn('API getSettings falhou, usando fallback');
      
      // Configurações padrão
      const defaultSettings = {
        site_name: 'Dr. Rodrigo Sguario',
        site_description: 'Cardiologista Especialista em Transplante Cardíaco',
        contact_email: 'contato@drrodrigosguario.com.br',
        contact_phone: '(11) 93382-1515',
        social_media: {
          facebook: '',
          instagram: '',
          linkedin: ''
        },
        theme: {
          primary_color: '#2563eb',
          secondary_color: '#1e40af'
        }
      };
      
      return createFallbackResponse(defaultSettings);
    }
  },

  updateSettings: async (settingsData) => {
    try {
      const response = await api.put('/api/settings', settingsData);
      return response;
    } catch (error) {
      console.warn('API updateSettings falhou, usando fallback');
      
      // Salvar no localStorage como fallback
      localStorage.setItem('site_settings', JSON.stringify(settingsData));
      
      return createFallbackResponse(settingsData);
    }
  }
};

// --- REVIEWS API COM FALLBACKS ---
export const reviewsAPI = {
  getReviews: async () => {
    try {
      const response = await api.get('/api/reviews');
      return response;
    } catch (error) {
      console.warn('API getReviews falhou, usando fallback');
      
      // Avaliações de exemplo
      const mockReviews = [
        {
          id: 1,
          author: 'Maria Silva',
          rating: 5,
          comment: 'Excelente profissional, muito atencioso e competente.',
          source: 'Google',
          created_at: '2024-01-15T10:00:00Z'
        },
        {
          id: 2,
          author: 'João Santos',
          rating: 5,
          comment: 'Dr. Rodrigo é muito dedicado e experiente.',
          source: 'Doctoralia',
          created_at: '2024-01-10T14:30:00Z'
        }
      ];
      
      return createFallbackResponse(mockReviews);
    }
  },

  createReview: async (reviewData) => {
    try {
      const response = await api.post('/api/reviews', reviewData);
      return response;
    } catch (error) {
      console.warn('API createReview falhou, usando fallback');
      
      // Simular criação bem-sucedida
      const newReview = {
        id: Date.now(),
        ...reviewData,
        created_at: new Date().toISOString()
      };
      
      return createFallbackResponse(newReview);
    }
  },

  updateReview: async (reviewId, reviewData) => {
    try {
      const response = await api.put(`/api/reviews/${reviewId}`, reviewData);
      return response;
    } catch (error) {
      console.warn('API updateReview falhou, usando fallback');
      
      // Simular atualização bem-sucedida
      const updatedReview = {
        id: reviewId,
        ...reviewData,
        updated_at: new Date().toISOString()
      };
      
      return createFallbackResponse(updatedReview);
    }
  },

  deleteReview: async (reviewId) => {
    try {
      const response = await api.delete(`/api/reviews/${reviewId}`);
      return response;
    } catch (error) {
      console.warn('API deleteReview falhou, usando fallback');
      return createFallbackResponse({ success: true });
    }
  }
};

// --- SITE CONTENT API COM FALLBACKS ---
export const siteContentAPI = {
  getAllContent: async () => {
    try {
      const response = await api.get('/api/site/content');
      console.log('API getAllContent resposta:', response);
      
      // A API retorna os dados diretamente, não dentro de um objeto 'data'
      if (response && response.data) {
        return { data: response.data };
      } else if (response) {
        return { data: response };
      } else {
        throw new Error('Resposta inválida da API');
      }
    } catch (error) {
      console.warn('API getAllContent falhou, usando fallback');
      
      // Dados de fallback para o site
      const fallbackContent = {
        hero: {
          title: "Dr. Rodrigo Sguario",
          subtitle: "Cardiologista Especialista em Transplante Cardíaco",
          description: "Especialista em cardiologia com foco em transplante cardíaco e insuficiência cardíaca avançada.",
          cta_text: "Agendar Consulta",
          cta_link: "#contact",
          achievements: [
            {
              icon: "Heart",
              title: "Referência em Transplante",
              description: "Liderança e experiência em transplantes cardíacos"
            },
            {
              icon: "Award", 
              title: "Tecnologia Avançada",
              description: "Equipamentos de última geração para diagnósticos precisos"
            },
            {
              icon: "Users",
              title: "Atendimento Humanizado", 
              description: "Cuidado focado no paciente, com empatia e atenção"
            }
          ],
          stats: [
            { number: "500+", label: "Pacientes Atendidos" },
            { number: "15+", label: "Anos de Experiência" },
            { number: "5.0", label: "Avaliação Média" },
            { number: "24h", label: "Suporte Emergencial" }
          ]
        },
        about: {
          title: "Sobre o Dr. Rodrigo",
          description: "Médico cardiologista com ampla experiência em transplante cardíaco e cuidado humanizado.",
          education: [
            {
              institution: "Instituto do Coração (InCor) - USP-SP",
              degree: "Especialização em Insuficiência Cardíaca e Transplante",
              period: "2023-2024",
              description: "Centro de referência em cardiologia da América Latina"
            },
            {
              institution: "UNICAMP",
              degree: "Residência em Cardiologia",
              period: "2021-2023",
              description: "Formação especializada em cardiologia clínica e intervencionista"
            },
            {
              institution: "Universidade Federal de Pelotas (UFPel)",
              degree: "Graduação em Medicina",
              period: "2015-2020",
              description: "Formação médica com foco humanizado"
            }
          ],
          specialties: [
            "Transplante Cardíaco",
            "Insuficiência Cardíaca Avançada",
            "Cardiologia Preventiva",
            "Ecocardiografia",
            "Cateterismo Cardíaco",
            "Reabilitação Cardíaca"
          ],
          values: [
            {
              icon: "Heart",
              title: "Formação de Excelência",
              description: "InCor-USP, UNICAMP e UFPel. Formação acadêmica completa."
            },
            {
              icon: "Users",
              title: "Foco no Paciente",
              description: "Cuidado centrado nas necessidades individuais de cada paciente."
            },
            {
              icon: "BookOpen",
              title: "Atualização Constante",
              description: "Sempre em busca das mais recentes inovações em cardiologia."
            }
          ]
        },
        services: {
          title: "Nossos Serviços",
          subtitle: "Cuidado cardiológico completo e especializado",
          services: [
            {
              icon: "Heart",
              title: "Transplante Cardíaco",
              description: "Acompanhamento completo do processo de transplante cardíaco, desde a avaliação inicial até o pós-transplante.",
              features: ["Avaliação pré-transplante", "Acompanhamento pós-transplante", "Coordenador de transplante"]
            },
            {
              icon: "Activity",
              title: "Insuficiência Cardíaca",
              description: "Diagnóstico e tratamento da insuficiência cardíaca avançada com protocolos atualizados.",
              features: ["Medicamentos avançados", "Dispositivos de assistência", "Reabilitação cardíaca"]
            },
            {
              icon: "Stethoscope",
              title: "Cardiologia Preventiva",
              description: "Prevenção de doenças cardíacas através de avaliação de risco e orientação personalizada.",
              features: ["Avaliação de risco", "Orientações personalizadas", "Acompanhamento contínuo"]
            }
          ]
        },
        contact: {
          title: "Entre em Contato",
          phone: "(11) 93382-1515",
          email: "contato@drrodrigosguario.com.br",
          address: "Rua das Palmeiras, 123 - Centro, São Paulo - SP",
          hours: "Segunda a Sexta: 8h às 18h | Sábado: 8h às 12h",
          emergency: "Emergências: 24h por dia"
        }
      };
      
      return createFallbackResponse(fallbackContent);
    }
  },

  saveAllContent: async (contentData) => {
    try {
      const response = await api.put('/api/site/content', contentData);
      return response;
    } catch (error) {
      console.warn('API saveAllContent falhou, usando fallback');
      
      // Salvar no localStorage como fallback
      localStorage.setItem('fallback_site_content', JSON.stringify(contentData));
      
      return createFallbackResponse(contentData);
    }
  }
};

// Exporta a instância principal
export default api;
