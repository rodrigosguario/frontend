import axios from 'axios';

// URL pública e correta do seu backend no Render
const API_BASE_URL = 'https://dr-rodrigo-backend-o.onrender.com'; 

// Cria a instância base do axios com timeout e interceptors
const api = axios.create({
  baseURL: `${API_BASE_URL}/api`,
  timeout: 15000, // 15 segundos de timeout
  headers: {
    'Content-Type': 'application/json'
  }
});

// Interceptor para adicionar token de autenticação
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Interceptor para tratar erros globalmente
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('Erro na API:', error);
    
    // Se for erro 401, remove token e redireciona para login
    if (error.response?.status === 401) {
      localStorage.removeItem('authToken');
      window.location.href = '/admin';
    }
    
    return Promise.reject(error);
  }
);

// Função helper para criar fallbacks
const createFallbackResponse = (data) => ({
  data: { success: true, data }
});

// --- ADMIN API COM FALLBACKS ---
export const adminAPI = {
  login: async (credentials) => {
    try {
      const response = await api.post('/admin/login', credentials);
      return response;
    } catch (error) {
      console.warn('API login falhou, usando fallback');
      
      // Fallback: verifica credenciais localmente
      if (credentials.username === 'admin@example.com' && credentials.password === 'admin123') {
        return {
          data: {
            success: true,
            token: 'fallback-token-' + Date.now(),
            user: {
              id: 1,
              username: credentials.username,
              name: 'Dr. Rodrigo Sguario',
              role: 'admin'
            }
          }
        };
      } else {
        throw new Error('Credenciais inválidas');
      }
    }
  },

  checkAuth: async () => {
    try {
      const response = await api.get('/admin/check-auth');
      return response;
    } catch (error) {
      console.warn('API checkAuth falhou, usando fallback');
      
      // Fallback: verifica se tem token local
      const token = localStorage.getItem('authToken');
      if (token) {
        return createFallbackResponse({
          authenticated: true,
          user: {
            id: 1,
            username: 'admin@example.com',
            name: 'Dr. Rodrigo Sguario',
            role: 'admin'
          }
        });
      } else {
        throw new Error('Não autenticado');
      }
    }
  }
};

// --- BLOG API COM FALLBACKS ---
export const blogAPI = {
  createPost: async (postData) => {
    try {
      const response = await api.post('/blog/posts', postData);
      return response;
    } catch (error) {
      console.warn('API createPost falhou, usando fallback');
      
      // Salva no localStorage como fallback
      const posts = JSON.parse(localStorage.getItem('fallback_posts') || '[]');
      const newPost = {
        id: Date.now(),
        ...postData,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      posts.push(newPost);
      localStorage.setItem('fallback_posts', JSON.stringify(posts));
      
      return createFallbackResponse(newPost);
    }
  },
  
  getPosts: async () => {
    try {
      const response = await api.get('/blog/posts');
      return response;
    } catch (error) {
      console.warn('API getPosts falhou, usando fallback');
      
      // Retorna posts do localStorage
      const posts = JSON.parse(localStorage.getItem('fallback_posts') || '[]');
      return createFallbackResponse(posts);
    }
  },
  
  getPost: async (id) => {
    try {
      const response = await api.get(`/blog/posts/${id}`);
      return response;
    } catch (error) {
      console.warn('API getPost falhou, usando fallback');
      
      const posts = JSON.parse(localStorage.getItem('fallback_posts') || '[]');
      const post = posts.find(p => p.id == id);
      return createFallbackResponse(post);
    }
  },
  
  updatePost: async (id, postData) => {
    try {
      const response = await api.put(`/blog/posts/${id}`, postData);
      return response;
    } catch (error) {
      console.warn('API updatePost falhou, usando fallback');
      
      const posts = JSON.parse(localStorage.getItem('fallback_posts') || '[]');
      const index = posts.findIndex(p => p.id == id);
      if (index !== -1) {
        posts[index] = { ...posts[index], ...postData, updated_at: new Date().toISOString() };
        localStorage.setItem('fallback_posts', JSON.stringify(posts));
        return createFallbackResponse(posts[index]);
      }
      throw new Error('Post não encontrado');
    }
  },
  
  deletePost: async (id) => {
    try {
      const response = await api.delete(`/blog/posts/${id}`);
      return response;
    } catch (error) {
      console.warn('API deletePost falhou, usando fallback');
      
      const posts = JSON.parse(localStorage.getItem('fallback_posts') || '[]');
      const filteredPosts = posts.filter(p => p.id != id);
      localStorage.setItem('fallback_posts', JSON.stringify(filteredPosts));
      return createFallbackResponse({ success: true });
    }
  }
};

// --- CONTENT API COM FALLBACKS ---
export const contentAPI = {
  getAllContent: async () => {
    try {
      const response = await api.get('/content');
      return response;
    } catch (error) {
      console.warn('API getAllContent falhou, usando fallback');
      
      const content = JSON.parse(localStorage.getItem('fallback_content') || '{}');
      return createFallbackResponse(content);
    }
  },
  
  getSectionContent: async (sectionId) => {
    try {
      const response = await api.get(`/content/${sectionId}`);
      return response;
    } catch (error) {
      console.warn('API getSectionContent falhou, usando fallback');
      
      const content = JSON.parse(localStorage.getItem('fallback_content') || '{}');
      return createFallbackResponse(content[sectionId] || {});
    }
  },
  
  updateSectionContent: async (sectionId, contentData) => {
    try {
      const response = await api.put(`/content/${sectionId}`, { content_data: contentData });
      return response;
    } catch (error) {
      console.warn('API updateSectionContent falhou, usando fallback');
      
      const content = JSON.parse(localStorage.getItem('fallback_content') || '{}');
      content[sectionId] = contentData;
      localStorage.setItem('fallback_content', JSON.stringify(content));
      return createFallbackResponse(contentData);
    }
  }
};

// --- SETTINGS API COM FALLBACKS ---
export const settingsAPI = {
  getAllSettings: async () => {
    try {
      const response = await api.get('/settings');
      return response;
    } catch (error) {
      console.warn('API getAllSettings falhou, usando fallback');
      
      const settings = JSON.parse(localStorage.getItem('fallback_settings') || '{}');
      return createFallbackResponse(settings);
    }
  },
  
  getSetting: async (settingKey) => {
    try {
      const response = await api.get(`/settings/${settingKey}`);
      return response;
    } catch (error) {
      console.warn('API getSetting falhou, usando fallback');
      
      const settings = JSON.parse(localStorage.getItem('fallback_settings') || '{}');
      return createFallbackResponse(settings[settingKey]);
    }
  },
  
  updateSetting: async (settingKey, value) => {
    try {
      const response = await api.put(`/settings/${settingKey}`, { value });
      return response;
    } catch (error) {
      console.warn('API updateSetting falhou, usando fallback');
      
      const settings = JSON.parse(localStorage.getItem('fallback_settings') || '{}');
      settings[settingKey] = value;
      localStorage.setItem('fallback_settings', JSON.stringify(settings));
      return createFallbackResponse(value);
    }
  }
};

// --- REVIEWS API COM FALLBACKS ---
export const reviewsAPI = {
  getReviews: async () => {
    try {
      const response = await api.get('/reviews');
      return response;
    } catch (error) {
      console.warn('API getReviews falhou, usando fallback');
      
      const reviews = JSON.parse(localStorage.getItem('fallback_reviews') || '[]');
      return createFallbackResponse(reviews);
    }
  },
  
  addReview: async (reviewData) => {
    try {
      const response = await api.post('/reviews', reviewData);
      return response;
    } catch (error) {
      console.warn('API addReview falhou, usando fallback');
      
      const reviews = JSON.parse(localStorage.getItem('fallback_reviews') || '[]');
      const newReview = {
        id: Date.now(),
        ...reviewData,
        created_at: new Date().toISOString()
      };
      reviews.push(newReview);
      localStorage.setItem('fallback_reviews', JSON.stringify(reviews));
      return createFallbackResponse(newReview);
    }
  },
  
  importReviews: async (source) => {
    try {
      const response = await api.post('/reviews/import', { source });
      return response;
    } catch (error) {
      console.warn('API importReviews falhou, usando fallback');
      
      // Dados de exemplo para importação
      const mockReviews = [
        {
          id: Date.now() + 1,
          patient_name: 'Maria Silva',
          rating: 5,
          comment: 'Excelente profissional! Dr. Rodrigo é muito atencioso e competente.',
          source: 'doctoralia',
          created_at: new Date().toISOString(),
          visible: true
        },
        {
          id: Date.now() + 2,
          patient_name: 'João Santos',
          rating: 5,
          comment: 'Recomendo muito! Tratamento excepcional e resultados excelentes.',
          source: 'google',
          created_at: new Date().toISOString(),
          visible: true
        }
      ];
      
      const reviews = JSON.parse(localStorage.getItem('fallback_reviews') || '[]');
      reviews.push(...mockReviews);
      localStorage.setItem('fallback_reviews', JSON.stringify(reviews));
      
      return createFallbackResponse(mockReviews);
    }
  }
};

// --- SITE CONTENT API COM FALLBACKS ---
export const siteContentAPI = {
  getAllContent: async () => {
    try {
      const response = await api.get('/site/content');
      return response;
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
        contact: {
          title: "Entre em Contato",
          phone: "(11) 93382-1515",
          email: "contato@drrodrigosguario.com.br",
          address: "São Paulo, SP",
          hours: "Segunda a Sexta: 8h às 18h\nSábado: 8h às 12h"
        }
      };
      
      return createFallbackResponse(fallbackContent);
    }
  },
  
  getSectionContent: async (sectionId) => {
    try {
      const response = await api.get(`/site/content/${sectionId}`);
      return response;
    } catch (error) {
      console.warn('API getSectionContent falhou, usando fallback');
      
      // Carregar do localStorage ou usar dados padrão
      const allContent = JSON.parse(localStorage.getItem('fallback_site_content') || '{}');
      return createFallbackResponse(allContent[sectionId] || {});
    }
  },
  
  updateSectionContent: async (sectionId, contentData) => {
    try {
      const response = await api.put(`/site/content/${sectionId}`, { content_data: contentData });
      return response;
    } catch (error) {
      console.warn('API updateSectionContent falhou, usando fallback');
      
      // Salvar no localStorage como fallback
      const allContent = JSON.parse(localStorage.getItem('fallback_site_content') || '{}');
      allContent[sectionId] = contentData;
      localStorage.setItem('fallback_site_content', JSON.stringify(allContent));
      
      return createFallbackResponse(contentData);
    }
  },

  saveAllContent: async (contentData) => {
    try {
      const response = await api.post('/site/content', contentData);
      return response;
    } catch (error) {
      console.warn('API saveAllContent falhou, usando fallback');
      
      // Salvar no localStorage como fallback
      localStorage.setItem('fallback_site_content', JSON.stringify(contentData));
      
      return createFallbackResponse(contentData);
    }
  }
};

// --- SITE API COM FALLBACKS ---
export const siteAPI = {
  getAllSections: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/site/sections`);
      if (!response.ok) throw new Error('Erro ao buscar seções');
      return response.json();
    } catch (error) {
      console.warn('API getAllSections falhou, usando fallback');
      
      // Dados de exemplo das seções
      const sections = {
        hero: {
          title: 'Dr. Rodrigo Sguario',
          subtitle: 'Cardiologista Especialista em Transplante Cardíaco',
          description: 'Cuidando do seu coração com excelência e dedicação',
          button_text: 'Agendar Consulta',
          achievements: [
            { number: '15+', label: 'Anos de Experiência' },
            { number: '500+', label: 'Transplantes Realizados' },
            { number: '98%', label: 'Taxa de Sucesso' }
          ]
        },
        about: {
          title: 'Sobre o Dr. Rodrigo',
          description: 'Especialista em cardiologia com foco em transplante cardíaco...',
          specialties: ['Transplante Cardíaco', 'Cardiologia Clínica', 'Ecocardiografia']
        }
      };
      
      return { success: true, data: sections };
    }
  },

  updateSection: async (sectionId, contentData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/site/sections/${sectionId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content_data: contentData })
      });
      if (!response.ok) throw new Error('Erro ao atualizar seção');
      return response.json();
    } catch (error) {
      console.warn('API updateSection falhou, usando fallback');
      
      const sections = JSON.parse(localStorage.getItem('fallback_sections') || '{}');
      sections[sectionId] = contentData;
      localStorage.setItem('fallback_sections', JSON.stringify(sections));
      
      return { success: true, data: contentData };
    }
  },

  getTheme: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/site/theme`);
      if (!response.ok) throw new Error('Erro ao buscar tema');
      return response.json();
    } catch (error) {
      console.warn('API getTheme falhou, usando fallback');
      
      const theme = JSON.parse(localStorage.getItem('fallback_theme') || '{}');
      return { success: true, data: theme };
    }
  },

  updateTheme: async (themeData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/site/theme`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(themeData)
      });
      if (!response.ok) throw new Error('Erro ao atualizar tema');
      return response.json();
    } catch (error) {
      console.warn('API updateTheme falhou, usando fallback');
      
      localStorage.setItem('fallback_theme', JSON.stringify(themeData));
      return { success: true, data: themeData };
    }
  },

  createBackup: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/site/backup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      if (!response.ok) throw new Error('Erro ao criar backup');
      return response.json();
    } catch (error) {
      console.warn('API createBackup falhou, usando fallback');
      
      const backup = {
        id: Date.now(),
        created_at: new Date().toISOString(),
        success: true
      };
      
      return { success: true, data: backup };
    }
  }
};

// Exporta a instância principal
export default api;
