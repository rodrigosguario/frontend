// Sistema de API completamente independente - Funciona offline
// Todas as funcionalidades são gerenciadas localmente

// Função auxiliar para criar respostas de fallback
const createFallbackResponse = (data) => ({
  success: true,
  data: data,
  message: 'Dados carregados localmente'
});

// Função auxiliar para simular delay de API
const simulateApiDelay = () => new Promise(resolve => setTimeout(resolve, 100));

// --- ADMIN API COMPLETAMENTE LOCAL ---
export const adminAPI = {
  checkAuth: async () => {
    await simulateApiDelay();
    try {
      const authData = localStorage.getItem('dr_rodrigo_admin_auth');
      if (authData) {
        const parsed = JSON.parse(authData);
        if (parsed && parsed.authenticated === true && parsed.expiresAt > Date.now()) {
        return {
            success: true,
          data: {
              authenticated: true,
              admin: parsed.user,
              user: parsed.user
            }
          };
        }
      }
      return {
        success: true,
        data: {
          authenticated: false,
          admin: null,
          user: null
        }
      };
    } catch (error) {
      console.warn('Erro ao verificar autenticação:', error);
      return {
        success: true,
        data: {
          authenticated: false,
          admin: null,
          user: null
        }
      };
    }
  },

  login: async (credentials) => {
    await simulateApiDelay();
    try {
      // Credenciais padrão
      const defaultCredentials = {
        username: 'admin',
        password: 'admin123'
      };

      if (credentials.username === defaultCredentials.username && 
          credentials.password === defaultCredentials.password) {
        
        const authData = {
          authenticated: true,
          user: {
            name: 'Dr. Rodrigo Sguario',
            role: 'admin',
            email: 'admin@sitecardiologia.com'
          },
          expiresAt: Date.now() + (24 * 60 * 60 * 1000), // 24 horas
          token: 'local_token_' + Date.now()
        };
        
        localStorage.setItem('dr_rodrigo_admin_auth', JSON.stringify(authData));
        
        return {
          success: true,
          data: authData,
          message: 'Login realizado com sucesso'
        };
      } else {
        return {
          success: false,
          message: 'Credenciais inválidas'
        };
      }
    } catch (error) {
      console.error('Erro no login:', error);
      return {
        success: false,
        message: 'Erro interno'
      };
    }
  },

  logout: async () => {
    await simulateApiDelay();
    try {
      localStorage.removeItem('dr_rodrigo_admin_auth');
      return {
        success: true,
        message: 'Logout realizado com sucesso'
      };
    } catch (error) {
      console.error('Erro no logout:', error);
      return {
        success: false,
        message: 'Erro interno'
      };
    }
  }
};

// --- SITE CONTENT API COMPLETAMENTE LOCAL ---
export const siteContentAPI = {
  getAllContent: async () => {
    await simulateApiDelay();
    try {
      const savedContent = localStorage.getItem('dr_rodrigo_site_content');
      if (savedContent) {
        const parsed = JSON.parse(savedContent);
        return createFallbackResponse(parsed);
      } else {
        // Conteúdo padrão se não houver dados salvos
        const defaultContent = {
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
                description: "Diagnóstico e tratamento especializado para pacientes com insuficiência cardíaca avançada.",
                features: ["Avaliação clínica", "Tratamento medicamentoso", "Monitoramento contínuo"]
              },
              {
                icon: "Stethoscope",
                title: "Cardiologia Preventiva",
                description: "Prevenção e diagnóstico precoce de doenças cardíacas através de exames e orientações.",
                features: ["Check-up cardiológico", "Prevenção de riscos", "Orientações de saúde"]
              },
              {
                icon: "Monitor",
                title: "Exames Especializados",
                description: "Realização de exames cardiológicos avançados para diagnóstico preciso.",
                features: ["Ecocardiografia", "Teste ergométrico", "Holter 24h", "Cateterismo"]
              }
            ]
          },
        contact: {
          title: "Entre em Contato",
            subtitle: "Agende sua consulta ou tire suas dúvidas",
            phone: "(11) 99999-9999",
            email: "contato@drrodrigo.com.br",
            address: "Rua das Flores, 123 - São Paulo, SP",
            working_hours: "Segunda a Sexta: 8h às 18h",
            emergency_contact: "Emergências: (11) 99999-8888"
          },
          blog: {
            title: "Blog e Artigos",
            subtitle: "Informações e novidades sobre cardiologia",
            posts: [
              {
                id: 1,
                title: "Como Prevenir Doenças Cardíacas",
                excerpt: "Dicas essenciais para manter a saúde do coração e prevenir problemas cardiovasculares.",
                content: "As doenças cardíacas são uma das principais causas de morte no mundo. Neste artigo, vamos abordar as principais formas de prevenção através de hábitos saudáveis, alimentação adequada e exercícios físicos regulares. A prevenção é sempre a melhor estratégia para manter a saúde do coração.",
                author: "Dr. Rodrigo Sguario",
                date: "2024-01-15",
                image: "/images/blog-1.jpg",
                tags: ["Prevenção", "Saúde", "Cardiologia"]
              },
              {
                id: 2,
                title: "Transplante Cardíaco: O que Você Precisa Saber",
                excerpt: "Informações importantes sobre o processo de transplante cardíaco e cuidados necessários.",
                content: "O transplante cardíaco é um procedimento complexo que pode salvar vidas em casos de insuficiência cardíaca terminal. Neste artigo, explicamos todo o processo, desde a avaliação inicial até o acompanhamento pós-transplante, incluindo os cuidados necessários e as expectativas do tratamento.",
                author: "Dr. Rodrigo Sguario",
                date: "2024-01-10",
                image: "/images/blog-2.jpg",
                tags: ["Transplante", "Tratamento", "Especializado"]
              },
              {
                id: 3,
                title: "Insuficiência Cardíaca: Sintomas e Tratamento",
                excerpt: "Conheça os principais sintomas da insuficiência cardíaca e as opções de tratamento disponíveis.",
                content: "A insuficiência cardíaca é uma condição séria que afeta milhões de pessoas. Neste artigo, detalhamos os principais sintomas, como falta de ar, fadiga e inchaço nas pernas, além das opções de tratamento modernas disponíveis, incluindo medicamentos e procedimentos intervencionistas.",
                author: "Dr. Rodrigo Sguario",
                date: "2024-01-05",
                image: "/images/blog-3.jpg",
                tags: ["Insuficiência Cardíaca", "Sintomas", "Tratamento"]
              }
            ]
          },
          reviews: {
            title: "Avaliações dos Pacientes",
            subtitle: "O que nossos pacientes dizem sobre o atendimento",
            reviews: [
              {
                id: 1,
                name: "Maria Silva",
                rating: 5,
                comment: "Excelente atendimento! O Dr. Rodrigo é muito atencioso e profissional. Recomendo fortemente.",
                date: "2024-01-20"
              },
              {
                id: 2,
                name: "João Santos",
                rating: 5,
                comment: "Muito satisfeito com o tratamento. O doutor explicou tudo com clareza e me fez sentir seguro.",
                date: "2024-01-18"
              },
              {
                id: 3,
                name: "Ana Costa",
                rating: 5,
                comment: "Profissionalismo e humanização. O Dr. Rodrigo cuida não só da saúde física, mas também emocional.",
                date: "2024-01-15"
              },
              {
                id: 4,
                name: "Pedro Oliveira",
                rating: 5,
                comment: "Atendimento excepcional. Equipamentos modernos e equipe muito competente.",
                date: "2024-01-12"
              },
              {
                id: 5,
                name: "Lucia Ferreira",
                rating: 5,
                comment: "Recomendo para todos que precisam de um cardiologista. Muito dedicado e experiente.",
                date: "2024-01-10"
              },
              {
                id: 6,
                name: "Carlos Mendes",
                rating: 5,
                comment: "O melhor cardiologista que já consultei. Atencioso, competente e humano.",
                date: "2024-01-08"
              }
            ]
          }
        };
        
        // Salvar conteúdo padrão
        localStorage.setItem('dr_rodrigo_site_content', JSON.stringify(defaultContent));
        return createFallbackResponse(defaultContent);
      }
    } catch (error) {
      console.error('Erro ao carregar conteúdo:', error);
      return {
        success: false,
        message: 'Erro ao carregar conteúdo'
      };
    }
  },

  updateContent: async (content) => {
    await simulateApiDelay();
    try {
      localStorage.setItem('dr_rodrigo_site_content', JSON.stringify(content));
      return {
        success: true,
        data: content,
        message: 'Conteúdo atualizado com sucesso'
      };
    } catch (error) {
      console.error('Erro ao salvar conteúdo:', error);
      return {
        success: false,
        message: 'Erro ao salvar conteúdo'
      };
    }
  }
};

// --- SETTINGS API COMPLETAMENTE LOCAL ---
export const settingsAPI = {
  getSettings: async () => {
    await simulateApiDelay();
    try {
      const savedSettings = localStorage.getItem('dr_rodrigo_site_settings');
      if (savedSettings) {
        const parsed = JSON.parse(savedSettings);
        return createFallbackResponse(parsed);
      } else {
        // Configurações padrão
        const defaultSettings = {
          doctor: {
            name: "Dr. Rodrigo Sguario",
            specialty: "Cardiologista",
            crm: "12345-SP",
            experience: "15+ anos",
            education: "InCor-USP, UNICAMP, UFPel"
          },
          clinic: {
            name: "Clínica Cardiológica Dr. Rodrigo",
            address: "Rua das Flores, 123 - São Paulo, SP",
            phone: "(11) 99999-9999",
            email: "contato@drrodrigo.com.br",
            working_hours: "Segunda a Sexta: 8h às 18h",
            emergency_phone: "(11) 99999-8888"
          },
          social: {
            instagram: "@drrodrigocardio",
            facebook: "DrRodrigoCardio",
            linkedin: "dr-rodrigo-sguario",
            whatsapp: "11999999999"
          },
          site: {
            title: "Dr. Rodrigo Sguario - Cardiologista",
            description: "Especialista em cardiologia e transplante cardíaco",
            keywords: "cardiologista, transplante cardíaco, insuficiência cardíaca, São Paulo",
            theme: "default",
            language: "pt-BR"
          }
        };
        
        localStorage.setItem('dr_rodrigo_site_settings', JSON.stringify(defaultSettings));
        return createFallbackResponse(defaultSettings);
      }
    } catch (error) {
      console.error('Erro ao carregar configurações:', error);
      return {
        success: false,
        message: 'Erro ao carregar configurações'
      };
    }
  },

  updateSettings: async (settings) => {
    await simulateApiDelay();
    try {
      localStorage.setItem('dr_rodrigo_site_settings', JSON.stringify(settings));
      return {
        success: true,
        data: settings,
        message: 'Configurações atualizadas com sucesso'
      };
    } catch (error) {
      console.error('Erro ao salvar configurações:', error);
      return {
        success: false,
        message: 'Erro ao salvar configurações'
      };
    }
  }
};

// --- BLOG API COMPLETAMENTE LOCAL ---
export const blogAPI = {
  getPosts: async () => {
    await simulateApiDelay();
    try {
      const content = await siteContentAPI.getAllContent();
      if (content.success && content.data.blog && content.data.blog.posts) {
        return createFallbackResponse(content.data.blog.posts);
      }
      return createFallbackResponse([]);
    } catch (error) {
      console.error('Erro ao carregar posts:', error);
      return {
        success: false,
        message: 'Erro ao carregar posts'
      };
    }
  },

  getPostBySlug: async (slug) => {
    await simulateApiDelay();
    try {
      const content = await siteContentAPI.getAllContent();
      if (content.success && content.data.blog && content.data.blog.posts) {
        const post = content.data.blog.posts.find(p => {
          const postSlug = p.title.toLowerCase()
            .replace(/[àáâãäå]/g, 'a')
            .replace(/[èéêë]/g, 'e')
            .replace(/[ìíîï]/g, 'i')
            .replace(/[òóôõö]/g, 'o')
            .replace(/[ùúûü]/g, 'u')
            .replace(/[ç]/g, 'c')
            .replace(/[^a-z0-9\s-]/g, '')
            .replace(/\s+/g, '-')
            .replace(/-+/g, '-')
            .trim();
          return postSlug === slug;
        });
        
        if (post) {
          return createFallbackResponse(post);
        }
      }
      return {
        success: false,
        message: 'Post não encontrado'
      };
    } catch (error) {
      console.error('Erro ao carregar post:', error);
      return {
        success: false,
        message: 'Erro ao carregar post'
      };
    }
  }
};

// --- REVIEWS API COMPLETAMENTE LOCAL ---
export const reviewsAPI = {
  getReviews: async () => {
    await simulateApiDelay();
    try {
      const content = await siteContentAPI.getAllContent();
      if (content.success && content.data.reviews && content.data.reviews.reviews) {
        return createFallbackResponse(content.data.reviews.reviews);
      }
      return createFallbackResponse([]);
    } catch (error) {
      console.error('Erro ao carregar avaliações:', error);
      return {
        success: false,
        message: 'Erro ao carregar avaliações'
      };
    }
  },

  addReview: async (review) => {
    await simulateApiDelay();
    try {
      const content = await siteContentAPI.getAllContent();
      if (content.success && content.data.reviews) {
        const newReview = {
        id: Date.now(),
          ...review,
          date: new Date().toISOString().split('T')[0]
        };
        
        content.data.reviews.reviews.push(newReview);
        await siteContentAPI.updateContent(content.data);
        
        return {
          success: true,
          data: newReview,
          message: 'Avaliação adicionada com sucesso'
        };
      }
      return {
        success: false,
        message: 'Erro ao adicionar avaliação'
      };
    } catch (error) {
      console.error('Erro ao adicionar avaliação:', error);
      return {
        success: false,
        message: 'Erro ao adicionar avaliação'
      };
    }
  }
};

// Exportar todas as APIs
export default {
  admin: adminAPI,
  siteContent: siteContentAPI,
  settings: settingsAPI,
  blog: blogAPI,
  reviews: reviewsAPI
};
