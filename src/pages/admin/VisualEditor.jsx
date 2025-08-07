import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Textarea } from '../../components/ui/textarea';
import { Label } from '../../components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { Badge } from '../../components/ui/badge';
import { Separator } from '../../components/ui/separator';
import { 
  Save, 
  Eye, 
  Edit3, 
  Plus, 
  Trash2, 
  Copy, 
  CheckCircle, 
  AlertCircle,
  Heart,
  Award,
  Users,
  BookOpen,
  Phone,
  Mail,
  MapPin,
  Clock,
  Star,
  ChevronDown,
  ChevronUp,
  Palette,
  Sun,
  Moon
} from 'lucide-react';
import { siteContentAPI } from '../../config/api';
import { useTheme } from '../../components/ThemeProvider';

const VisualEditor = () => {
  const { currentPalette, changePalette, getCurrentPalette, getAllPalettes, isDark, toggleTheme } = useTheme();
  const [content, setContent] = useState({
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
  });

  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState(null);
  const [showPreview, setShowPreview] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');
  const [expandedSections, setExpandedSections] = useState({
    hero: true,
    about: true,
    services: true,
    contact: true
  });

  // Auto-save com debounce
  const autoSave = useCallback(
    debounce(async (newContent) => {
      try {
        setIsSaving(true);
        await siteContentAPI.saveAllContent(newContent);
        setLastSaved(new Date());
      } catch (error) {
        console.warn('Auto-save falhou:', error);
      } finally {
        setIsSaving(false);
      }
    }, 2000),
    []
  );

  // Carregar conteúdo inicial
  useEffect(() => {
    const loadContent = async () => {
      try {
        console.log('Carregando conteúdo do site...');
        const response = await siteContentAPI.getAllContent();
        console.log('Resposta da API:', response);
        
        if (response && response.data) {
          console.log('Dados carregados:', response.data);
          setContent(response.data);
        } else if (response && response.content) {
          // Fallback para estrutura alternativa
          console.log('Usando estrutura alternativa:', response.content);
          setContent(response.content);
        } else {
          console.warn('Estrutura de resposta inesperada:', response);
          // Manter o conteúdo padrão que já está definido
        }
      } catch (error) {
        console.error('Erro ao carregar conteúdo:', error);
        console.warn('Usando dados padrão devido ao erro');
        // O conteúdo padrão já está definido no estado inicial
      }
    };
    loadContent();
  }, []);

  // Auto-save quando conteúdo muda
  useEffect(() => {
    autoSave(content);
  }, [content, autoSave]);

  // Função debounce
  function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }

  // Funções auxiliares
  const updateContent = (section, field, value) => {
    setContent(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  const updateArrayItem = (section, arrayName, index, field, value) => {
    setContent(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [arrayName]: prev[section][arrayName].map((item, i) => 
          i === index ? { ...item, [field]: value } : item
        )
      }
    }));
  };

  const addArrayItem = (section, arrayName, newItem) => {
    setContent(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [arrayName]: [...prev[section][arrayName], newItem]
      }
    }));
  };

  const removeArrayItem = (section, arrayName, index) => {
    setContent(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [arrayName]: prev[section][arrayName].filter((_, i) => i !== index)
      }
    }));
  };

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold text-gray-900">Editor Visual</h1>
              <Badge variant="outline" className="text-sm">
                {showPreview ? 'Preview' : 'Edição'}
              </Badge>
            </div>
            
            <div className="flex items-center space-x-3">
              <Button
                variant="outline"
                onClick={() => setShowPreview(!showPreview)}
                className="flex items-center space-x-2"
              >
                {showPreview ? <Edit3 size={16} /> : <Eye size={16} />}
                <span>{showPreview ? 'Editar' : 'Preview'}</span>
              </Button>
              
              <div className="flex items-center space-x-2 text-sm text-gray-500">
                {isSaving ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                    <span>Salvando...</span>
                  </>
                ) : lastSaved ? (
                  <>
                    <CheckCircle size={16} className="text-green-500" />
                    <span>Salvo às {lastSaved.toLocaleTimeString()}</span>
                  </>
                ) : (
                  <>
                    <AlertCircle size={16} className="text-yellow-500" />
                    <span>Não salvo</span>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {showPreview ? (
          <PreviewMode content={content} />
        ) : (
                     <EditMode 
             content={content}
             updateContent={updateContent}
             updateArrayItem={updateArrayItem}
             addArrayItem={addArrayItem}
             removeArrayItem={removeArrayItem}
             expandedSections={expandedSections}
             toggleSection={toggleSection}
             activeSection={activeSection}
             setActiveSection={setActiveSection}
           />
        )}
      </div>
    </div>
  );
};

// Componente de Preview
const PreviewMode = ({ content }) => {
  const getIconComponent = (iconName) => {
    const icons = {
      Heart, Award, Users, BookOpen, Phone, Mail, MapPin, Clock, Star
    };
    return icons[iconName] || Heart;
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-8">
      <div className="max-w-4xl mx-auto">
        {/* Hero Section Preview */}
        <section className="mb-12">
          <div className="text-center py-16 bg-gradient-to-r from-blue-600 to-blue-800 text-white rounded-lg">
            <h1 className="text-4xl font-bold mb-4">{content.hero.title}</h1>
            <h2 className="text-2xl mb-6">{content.hero.subtitle}</h2>
            <p className="text-lg mb-8 max-w-2xl mx-auto">{content.hero.description}</p>
            <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
              {content.hero.cta_text}
            </Button>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-12">
              {content.hero.stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-3xl font-bold">{stat.number}</div>
                  <div className="text-sm opacity-90">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* About Section Preview */}
        <section className="mb-12">
          <div className="bg-gray-50 p-8 rounded-lg">
            <h2 className="text-3xl font-bold mb-6 text-center">{content.about.title}</h2>
            <p className="text-lg text-gray-600 mb-8 text-center">{content.about.description}</p>
            
            <div className="grid md:grid-cols-3 gap-6 mb-8">
              {content.about.values.map((value, index) => {
                const IconComponent = getIconComponent(value.icon);
                return (
                  <div key={index} className="text-center">
                    <IconComponent size={48} className="mx-auto mb-4 text-blue-600" />
                    <h3 className="text-xl font-semibold mb-2">{value.title}</h3>
                    <p className="text-gray-600">{value.description}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Services Section Preview */}
        <section className="mb-12">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-4">{content.services.title}</h2>
            <p className="text-lg text-gray-600">{content.services.subtitle}</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6">
            {content.services.services.map((service, index) => (
              <Card key={index} className="text-center">
                <CardContent className="p-6">
                  <Heart size={48} className="mx-auto mb-4 text-blue-600" />
                  <h3 className="text-xl font-semibold mb-3">{service.title}</h3>
                  <p className="text-gray-600 mb-4">{service.description}</p>
                  <ul className="text-sm text-gray-500 space-y-1">
                    {service.features.map((feature, fIndex) => (
                      <li key={fIndex}>• {feature}</li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Contact Section Preview */}
        <section>
          <div className="bg-blue-600 text-white p-8 rounded-lg text-center">
            <h2 className="text-3xl font-bold mb-6">{content.contact.title}</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-center justify-center space-x-3">
                  <Phone size={24} />
                  <span className="text-lg">{content.contact.phone}</span>
                </div>
                <div className="flex items-center justify-center space-x-3">
                  <Mail size={24} />
                  <span className="text-lg">{content.contact.email}</span>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-center justify-center space-x-3">
                  <MapPin size={24} />
                  <span className="text-lg">{content.contact.address}</span>
                </div>
                <div className="flex items-center justify-center space-x-3">
                  <Clock size={24} />
                  <span className="text-lg">{content.contact.hours}</span>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

// Componente de Edição
const EditMode = ({ 
  content, 
  updateContent, 
  updateArrayItem, 
  addArrayItem, 
  removeArrayItem,
  expandedSections,
  toggleSection,
  activeSection,
  setActiveSection
}) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Sidebar de Navegação */}
      <div className="lg:col-span-1">
        <Card className="sticky top-24">
          <CardHeader>
            <CardTitle>Seções do Site</CardTitle>
          </CardHeader>
          <CardContent>
            <nav className="space-y-2">
              {Object.keys(content).map((section) => (
                <button
                  key={section}
                  onClick={() => setActiveSection(section)}
                  className={`w-full text-left px-3 py-2 rounded-md transition-colors ${
                    activeSection === section
                      ? 'bg-blue-100 text-blue-700 font-medium'
                      : 'hover:bg-gray-100'
                  }`}
                >
                  {section.charAt(0).toUpperCase() + section.slice(1)}
                </button>
              ))}
            </nav>
          </CardContent>
        </Card>
      </div>

      {/* Área de Edição */}
      <div className="lg:col-span-2">
        <Tabs value={activeSection} onValueChange={setActiveSection}>
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="hero">Hero</TabsTrigger>
            <TabsTrigger value="about">Sobre</TabsTrigger>
            <TabsTrigger value="services">Serviços</TabsTrigger>
            <TabsTrigger value="contact">Contato</TabsTrigger>
            <TabsTrigger value="colors">Cores</TabsTrigger>
          </TabsList>

          {/* Hero Section */}
          <TabsContent value="hero" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Seção Principal (Hero)</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => toggleSection('hero')}
                  >
                    {expandedSections.hero ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                  </Button>
                </CardTitle>
              </CardHeader>
              {expandedSections.hero && (
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="hero-title">Título Principal</Label>
                    <Input
                      id="hero-title"
                      value={content.hero.title}
                      onChange={(e) => updateContent('hero', 'title', e.target.value)}
                      placeholder="Digite o título principal"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="hero-subtitle">Subtítulo</Label>
                    <Input
                      id="hero-subtitle"
                      value={content.hero.subtitle}
                      onChange={(e) => updateContent('hero', 'subtitle', e.target.value)}
                      placeholder="Digite o subtítulo"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="hero-description">Descrição</Label>
                    <Textarea
                      id="hero-description"
                      value={content.hero.description}
                      onChange={(e) => updateContent('hero', 'description', e.target.value)}
                      placeholder="Digite a descrição"
                      rows={3}
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="hero-cta-text">Texto do Botão</Label>
                      <Input
                        id="hero-cta-text"
                        value={content.hero.cta_text}
                        onChange={(e) => updateContent('hero', 'cta_text', e.target.value)}
                        placeholder="Ex: Agendar Consulta"
                      />
                    </div>
                    <div>
                      <Label htmlFor="hero-cta-link">Link do Botão</Label>
                      <Input
                        id="hero-cta-link"
                        value={content.hero.cta_link}
                        onChange={(e) => updateContent('hero', 'cta_link', e.target.value)}
                        placeholder="Ex: #contact"
                      />
                    </div>
                  </div>
                </CardContent>
              )}
            </Card>

            {/* Stats Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Estatísticas</span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => addArrayItem('hero', 'stats', { number: "0", label: "Nova Estatística" })}
                  >
                    <Plus size={16} />
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {content.hero.stats.map((stat, index) => (
                    <div key={index} className="flex items-center space-x-4 p-3 border rounded-lg">
                      <div className="flex-1 grid grid-cols-2 gap-4">
                        <div>
                          <Label>Número</Label>
                          <Input
                            value={stat.number}
                            onChange={(e) => updateArrayItem('hero', 'stats', index, 'number', e.target.value)}
                            placeholder="Ex: 500+"
                          />
                        </div>
                        <div>
                          <Label>Rótulo</Label>
                          <Input
                            value={stat.label}
                            onChange={(e) => updateArrayItem('hero', 'stats', index, 'label', e.target.value)}
                            placeholder="Ex: Pacientes Atendidos"
                          />
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeArrayItem('hero', 'stats', index)}
                      >
                        <Trash2 size={16} />
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Achievements Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Conquistas</span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => addArrayItem('hero', 'achievements', { 
                      icon: "Heart", 
                      title: "Nova Conquista", 
                      description: "Descrição da conquista" 
                    })}
                  >
                    <Plus size={16} />
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {content.hero.achievements.map((achievement, index) => (
                    <div key={index} className="p-4 border rounded-lg space-y-4">
                      <div className="grid grid-cols-3 gap-4">
                        <div>
                          <Label>Ícone</Label>
                          <Input
                            value={achievement.icon}
                            onChange={(e) => updateArrayItem('hero', 'achievements', index, 'icon', e.target.value)}
                            placeholder="Ex: Heart"
                          />
                        </div>
                        <div className="col-span-2">
                          <Label>Título</Label>
                          <Input
                            value={achievement.title}
                            onChange={(e) => updateArrayItem('hero', 'achievements', index, 'title', e.target.value)}
                            placeholder="Título da conquista"
                          />
                        </div>
                      </div>
                      <div>
                        <Label>Descrição</Label>
                        <Textarea
                          value={achievement.description}
                          onChange={(e) => updateArrayItem('hero', 'achievements', index, 'description', e.target.value)}
                          placeholder="Descrição da conquista"
                          rows={2}
                        />
                      </div>
                      <div className="flex justify-end">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeArrayItem('hero', 'achievements', index)}
                        >
                          <Trash2 size={16} />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* About Section */}
          <TabsContent value="about" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Sobre o Médico</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => toggleSection('about')}
                  >
                    {expandedSections.about ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                  </Button>
                </CardTitle>
              </CardHeader>
              {expandedSections.about && (
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="about-title">Título da Seção</Label>
                    <Input
                      id="about-title"
                      value={content.about.title}
                      onChange={(e) => updateContent('about', 'title', e.target.value)}
                      placeholder="Ex: Sobre o Dr. Rodrigo"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="about-description">Descrição Principal</Label>
                    <Textarea
                      id="about-description"
                      value={content.about.description}
                      onChange={(e) => updateContent('about', 'description', e.target.value)}
                      placeholder="Descrição sobre o médico"
                      rows={3}
                    />
                  </div>
                </CardContent>
              )}
            </Card>

            {/* Education Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Formação Acadêmica</span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => addArrayItem('about', 'education', {
                      institution: "Nova Instituição",
                      degree: "Novo Curso",
                      period: "Período",
                      description: "Descrição da formação"
                    })}
                  >
                    <Plus size={16} />
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {content.about.education.map((edu, index) => (
                    <div key={index} className="p-4 border rounded-lg space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label>Instituição</Label>
                          <Input
                            value={edu.institution}
                            onChange={(e) => updateArrayItem('about', 'education', index, 'institution', e.target.value)}
                            placeholder="Nome da instituição"
                          />
                        </div>
                        <div>
                          <Label>Período</Label>
                          <Input
                            value={edu.period}
                            onChange={(e) => updateArrayItem('about', 'education', index, 'period', e.target.value)}
                            placeholder="Ex: 2020-2024"
                          />
                        </div>
                      </div>
                      <div>
                        <Label>Curso/Grau</Label>
                        <Input
                          value={edu.degree}
                          onChange={(e) => updateArrayItem('about', 'education', index, 'degree', e.target.value)}
                          placeholder="Nome do curso ou grau"
                        />
                      </div>
                      <div>
                        <Label>Descrição</Label>
                        <Textarea
                          value={edu.description}
                          onChange={(e) => updateArrayItem('about', 'education', index, 'description', e.target.value)}
                          placeholder="Descrição da formação"
                          rows={2}
                        />
                      </div>
                      <div className="flex justify-end">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeArrayItem('about', 'education', index)}
                        >
                          <Trash2 size={16} />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Specialties Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Especialidades</span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => addArrayItem('about', 'specialties', "Nova Especialidade")}
                  >
                    <Plus size={16} />
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {content.about.specialties.map((specialty, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <Input
                        value={specialty}
                        onChange={(e) => updateArrayItem('about', 'specialties', index, '', e.target.value)}
                        placeholder="Nome da especialidade"
                      />
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeArrayItem('about', 'specialties', index)}
                      >
                        <Trash2 size={16} />
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Values Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Valores</span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => addArrayItem('about', 'values', {
                      icon: "Heart",
                      title: "Novo Valor",
                      description: "Descrição do valor"
                    })}
                  >
                    <Plus size={16} />
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {content.about.values.map((value, index) => (
                    <div key={index} className="p-4 border rounded-lg space-y-4">
                      <div className="grid grid-cols-3 gap-4">
                        <div>
                          <Label>Ícone</Label>
                          <Input
                            value={value.icon}
                            onChange={(e) => updateArrayItem('about', 'values', index, 'icon', e.target.value)}
                            placeholder="Ex: Heart"
                          />
                        </div>
                        <div className="col-span-2">
                          <Label>Título</Label>
                          <Input
                            value={value.title}
                            onChange={(e) => updateArrayItem('about', 'values', index, 'title', e.target.value)}
                            placeholder="Título do valor"
                          />
                        </div>
                      </div>
                      <div>
                        <Label>Descrição</Label>
                        <Textarea
                          value={value.description}
                          onChange={(e) => updateArrayItem('about', 'values', index, 'description', e.target.value)}
                          placeholder="Descrição do valor"
                          rows={2}
                        />
                      </div>
                      <div className="flex justify-end">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeArrayItem('about', 'values', index)}
                        >
                          <Trash2 size={16} />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Services Section */}
          <TabsContent value="services" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Serviços</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => toggleSection('services')}
                  >
                    {expandedSections.services ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                  </Button>
                </CardTitle>
              </CardHeader>
              {expandedSections.services && (
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="services-title">Título da Seção</Label>
                    <Input
                      id="services-title"
                      value={content.services.title}
                      onChange={(e) => updateContent('services', 'title', e.target.value)}
                      placeholder="Ex: Nossos Serviços"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="services-subtitle">Subtítulo</Label>
                    <Input
                      id="services-subtitle"
                      value={content.services.subtitle}
                      onChange={(e) => updateContent('services', 'subtitle', e.target.value)}
                      placeholder="Ex: Cuidado cardiológico completo"
                    />
                  </div>
                </CardContent>
              )}
            </Card>

            {/* Services List */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Lista de Serviços</span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => addArrayItem('services', 'services', {
                      icon: "Heart",
                      title: "Novo Serviço",
                      description: "Descrição do serviço",
                      features: ["Característica 1", "Característica 2"]
                    })}
                  >
                    <Plus size={16} />
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {content.services.services.map((service, index) => (
                    <div key={index} className="p-6 border rounded-lg space-y-4">
                      <div className="grid grid-cols-3 gap-4">
                        <div>
                          <Label>Ícone</Label>
                          <Input
                            value={service.icon}
                            onChange={(e) => updateArrayItem('services', 'services', index, 'icon', e.target.value)}
                            placeholder="Ex: Heart"
                          />
                        </div>
                        <div className="col-span-2">
                          <Label>Título do Serviço</Label>
                          <Input
                            value={service.title}
                            onChange={(e) => updateArrayItem('services', 'services', index, 'title', e.target.value)}
                            placeholder="Nome do serviço"
                          />
                        </div>
                      </div>
                      
                      <div>
                        <Label>Descrição</Label>
                        <Textarea
                          value={service.description}
                          onChange={(e) => updateArrayItem('services', 'services', index, 'description', e.target.value)}
                          placeholder="Descrição detalhada do serviço"
                          rows={3}
                        />
                      </div>
                      
                      <div>
                        <Label>Características</Label>
                        <div className="space-y-2">
                          {service.features.map((feature, fIndex) => (
                            <div key={fIndex} className="flex items-center space-x-2">
                              <Input
                                value={feature}
                                onChange={(e) => {
                                  const newFeatures = [...service.features];
                                  newFeatures[fIndex] = e.target.value;
                                  updateArrayItem('services', 'services', index, 'features', newFeatures);
                                }}
                                placeholder="Característica do serviço"
                              />
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                  const newFeatures = service.features.filter((_, i) => i !== fIndex);
                                  updateArrayItem('services', 'services', index, 'features', newFeatures);
                                }}
                              >
                                <Trash2 size={16} />
                              </Button>
                            </div>
                          ))}
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              const newFeatures = [...service.features, "Nova característica"];
                              updateArrayItem('services', 'services', index, 'features', newFeatures);
                            }}
                          >
                            <Plus size={16} /> Adicionar Característica
                          </Button>
                        </div>
                      </div>
                      
                      <div className="flex justify-end">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeArrayItem('services', 'services', index)}
                        >
                          <Trash2 size={16} />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Contact Section */}
          <TabsContent value="contact" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Informações de Contato</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => toggleSection('contact')}
                  >
                    {expandedSections.contact ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                  </Button>
                </CardTitle>
              </CardHeader>
              {expandedSections.contact && (
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="contact-title">Título da Seção</Label>
                    <Input
                      id="contact-title"
                      value={content.contact.title}
                      onChange={(e) => updateContent('contact', 'title', e.target.value)}
                      placeholder="Ex: Entre em Contato"
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="contact-phone">Telefone</Label>
                      <Input
                        id="contact-phone"
                        value={content.contact.phone}
                        onChange={(e) => updateContent('contact', 'phone', e.target.value)}
                        placeholder="Ex: (11) 93382-1515"
                      />
                    </div>
                    <div>
                      <Label htmlFor="contact-email">E-mail</Label>
                      <Input
                        id="contact-email"
                        value={content.contact.email}
                        onChange={(e) => updateContent('contact', 'email', e.target.value)}
                        placeholder="Ex: contato@drrodrigosguario.com.br"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="contact-address">Endereço</Label>
                    <Input
                      id="contact-address"
                      value={content.contact.address}
                      onChange={(e) => updateContent('contact', 'address', e.target.value)}
                      placeholder="Endereço completo"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="contact-hours">Horário de Funcionamento</Label>
                    <Input
                      id="contact-hours"
                      value={content.contact.hours}
                      onChange={(e) => updateContent('contact', 'hours', e.target.value)}
                      placeholder="Ex: Segunda a Sexta: 8h às 18h"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="contact-emergency">Emergências</Label>
                    <Input
                      id="contact-emergency"
                      value={content.contact.emergency}
                      onChange={(e) => updateContent('contact', 'emergency', e.target.value)}
                      placeholder="Ex: Emergências: 24h por dia"
                    />
                  </div>
                </CardContent>
              )}
            </Card>
          </TabsContent>

          {/* Colors Section */}
          <TabsContent value="colors" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Palette className="w-5 h-5" />
                  Configuração de Cores do Site
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Tema Claro/Escuro */}
                <div>
                  <Label className="text-base font-medium">Modo de Tema</Label>
                  <div className="flex gap-4 mt-2">
                    <Button
                      variant={!isDark ? "default" : "outline"}
                      onClick={() => !isDark || toggleTheme()}
                      className="flex items-center gap-2"
                    >
                      <Sun className="w-4 h-4" />
                      Claro
                    </Button>
                    <Button
                      variant={isDark ? "default" : "outline"}
                      onClick={() => isDark || toggleTheme()}
                      className="flex items-center gap-2"
                    >
                      <Moon className="w-4 h-4" />
                      Escuro
                    </Button>
                  </div>
                </div>

                <Separator />

                {/* Paletas de Cores */}
                <div>
                  <Label className="text-base font-medium">Paleta de Cores</Label>
                  <p className="text-sm text-muted-foreground mb-4">
                    Escolha uma paleta de cores para personalizar a aparência do site
                  </p>
                  
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {Object.entries(getAllPalettes()).map(([key, palette]) => (
                      <div
                        key={key}
                        onClick={() => changePalette(key)}
                        className={`relative cursor-pointer rounded-lg border-2 p-4 transition-all hover:scale-105 ${
                          currentPalette === key 
                            ? 'border-primary ring-2 ring-primary/20' 
                            : 'border-border hover:border-primary/50'
                        }`}
                      >
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="font-medium text-sm">{palette.name}</span>
                            {currentPalette === key && (
                              <CheckCircle className="w-4 h-4 text-primary" />
                            )}
                          </div>
                          
                          <div className="flex gap-2">
                            <div 
                              className="w-6 h-6 rounded-full border border-border"
                              style={{ backgroundColor: palette.primary }}
                            />
                            <div 
                              className="w-6 h-6 rounded-full border border-border"
                              style={{ backgroundColor: palette.secondary }}
                            />
                            <div 
                              className="w-6 h-6 rounded-full border border-border"
                              style={{ backgroundColor: palette.accent }}
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Preview da Paleta Atual */}
                <div>
                  <Label className="text-base font-medium">Paleta Atual</Label>
                  <div className="mt-2 p-4 bg-muted rounded-lg">
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {Object.entries(getCurrentPalette()).map(([key, color]) => {
                        if (key === 'name') return null;
                        return (
                          <div key={key} className="flex items-center gap-3">
                            <div 
                              className="w-8 h-8 rounded-lg border border-border"
                              style={{ backgroundColor: color }}
                            />
                            <div>
                              <div className="font-medium text-sm capitalize">
                                {key.replace(/([A-Z])/g, ' $1').trim()}
                              </div>
                              <div className="text-xs text-muted-foreground font-mono">
                                {color}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default VisualEditor;

