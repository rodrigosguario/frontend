// Sistema de gerenciamento de conteúdo local
class ContentManager {
  constructor() {
    this.contentKey = 'dr_rodrigo_site_content';
    this.defaultContent = {
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
            description: "Prevenção de doenças cardiovasculares através de avaliação de risco e orientação personalizada.",
            features: ["Avaliação de risco", "Orientações preventivas", "Acompanhamento regular"]
          },
          {
            icon: "Heart",
            title: "Ecocardiografia",
            description: "Exames de imagem cardíaca para diagnóstico preciso de diversas condições cardíacas.",
            features: ["Ecocardiograma transtorácico", "Ecocardiograma transesofágico", "Estresse cardíaco"]
          }
        ]
      },
      contact: {
        title: "Entre em Contato",
        subtitle: "Agende sua consulta ou tire suas dúvidas",
        description: "Estou aqui para ajudar você a cuidar da saúde do seu coração. Entre em contato para agendar uma consulta ou esclarecer dúvidas.",
        phone: "+55 (11) 99999-9999",
        email: "contato@drrodrigo.com.br",
        address: "Rua das Flores, 123 - São Paulo, SP",
        hours: "Segunda a Sexta: 8h às 18h",
        emergency: "Emergências: 24h por dia"
      },
      reviews: {
        title: "Avaliações dos Pacientes",
        subtitle: "O que nossos pacientes dizem sobre o atendimento",
        description: "A satisfação dos nossos pacientes é nossa maior recompensa. Confira as avaliações de quem já passou por aqui.",
        reviews: [
          {
            id: 1,
            name: "Maria Silva",
            rating: 5,
            comment: "Excelente atendimento! O Dr. Rodrigo é muito atencioso e profissional.",
            date: "2024-01-15"
          },
          {
            id: 2,
            name: "João Santos",
            rating: 5,
            comment: "Muito satisfeito com o tratamento. Recomendo fortemente!",
            date: "2024-01-10"
          },
          {
            id: 3,
            name: "Ana Costa",
            rating: 5,
            comment: "Profissional competente e humano. Cuidou muito bem do meu pai.",
            date: "2024-01-05"
          }
        ]
      }
    };
  }

  // Carregar conteúdo
  loadContent() {
    try {
      const savedContent = localStorage.getItem(this.contentKey);
      if (savedContent) {
        const parsed = JSON.parse(savedContent);
        return { success: true, data: parsed };
      } else {
        // Se não há conteúdo salvo, usar o padrão
        this.saveContent(this.defaultContent);
        return { success: true, data: this.defaultContent };
      }
    } catch (error) {
      console.error('Erro ao carregar conteúdo:', error);
      return { success: false, data: this.defaultContent };
    }
  }

  // Salvar conteúdo
  saveContent(content) {
    try {
      localStorage.setItem(this.contentKey, JSON.stringify(content));
      return { success: true, message: 'Conteúdo salvo com sucesso' };
    } catch (error) {
      console.error('Erro ao salvar conteúdo:', error);
      return { success: false, message: 'Erro ao salvar conteúdo' };
    }
  }

  // Atualizar seção específica
  updateSection(sectionId, sectionData) {
    try {
      const currentContent = this.loadContent().data;
      currentContent[sectionId] = { ...currentContent[sectionId], ...sectionData };
      return this.saveContent(currentContent);
    } catch (error) {
      console.error('Erro ao atualizar seção:', error);
      return { success: false, message: 'Erro ao atualizar seção' };
    }
  }

  // Obter seção específica
  getSection(sectionId) {
    try {
      const content = this.loadContent().data;
      return { success: true, data: content[sectionId] };
    } catch (error) {
      console.error('Erro ao obter seção:', error);
      return { success: false, data: null };
    }
  }

  // Resetar para conteúdo padrão
  resetToDefault() {
    try {
      localStorage.removeItem(this.contentKey);
      return { success: true, message: 'Conteúdo resetado para padrão' };
    } catch (error) {
      console.error('Erro ao resetar conteúdo:', error);
      return { success: false, message: 'Erro ao resetar conteúdo' };
    }
  }

  // Fazer backup do conteúdo
  createBackup() {
    try {
      const content = this.loadContent().data;
      const backup = {
        content,
        timestamp: new Date().toISOString(),
        version: '1.0'
      };
      
      localStorage.setItem('dr_rodrigo_content_backup', JSON.stringify(backup));
      return { success: true, message: 'Backup criado com sucesso' };
    } catch (error) {
      console.error('Erro ao criar backup:', error);
      return { success: false, message: 'Erro ao criar backup' };
    }
  }

  // Restaurar backup
  restoreBackup() {
    try {
      const backupData = localStorage.getItem('dr_rodrigo_content_backup');
      if (backupData) {
        const backup = JSON.parse(backupData);
        return this.saveContent(backup.content);
      } else {
        return { success: false, message: 'Nenhum backup encontrado' };
      }
    } catch (error) {
      console.error('Erro ao restaurar backup:', error);
      return { success: false, message: 'Erro ao restaurar backup' };
    }
  }
}

// Instância global
export const contentManager = new ContentManager();

// Funções de conveniência
export const loadContent = () => contentManager.loadContent();
export const saveContent = (content) => contentManager.saveContent(content);
export const updateSection = (sectionId, sectionData) => contentManager.updateSection(sectionId, sectionData);
export const getSection = (sectionId) => contentManager.getSection(sectionId);
export const resetToDefault = () => contentManager.resetToDefault();
export const createBackup = () => contentManager.createBackup();
export const restoreBackup = () => contentManager.restoreBackup();
