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
  Moon,
  Activity,
  Stethoscope,
  Monitor
} from 'lucide-react';
import { siteContentAPI } from '../../config/api';

const VisualEditor = () => {
  const [content, setContent] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState(null);
  const [activeSection, setActiveSection] = useState('hero');
  const [expandedSections, setExpandedSections] = useState(new Set(['hero']));
  const [mode, setMode] = useState('edit'); // 'edit' or 'preview'

  // Carregar conteúdo
  useEffect(() => {
    const loadSiteContent = async () => {
      try {
        console.log('Carregando conteúdo do site...');
        const response = await siteContentAPI.getAllContent();
        console.log('Resposta da API:', response);
        
        if (response.success && response.data) {
          console.log('Dados carregados:', response.data);
          setContent(response.data);
        } else {
          console.warn('Erro ao carregar conteúdo, usando dados padrão');
          setContent(response.data || {});
        }
      } catch (error) {
        console.error('Erro ao carregar conteúdo:', error);
        setContent({});
      } finally {
        setLoading(false);
      }
    };

    loadSiteContent();
  }, []);

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
        [arrayName]: (prev[section]?.[arrayName] || []).map((item, i) => 
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
        [arrayName]: [...(prev[section]?.[arrayName] || []), newItem]
      }
    }));
  };

  const removeArrayItem = (section, arrayName, index) => {
    setContent(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [arrayName]: (prev[section]?.[arrayName] || []).filter((_, i) => i !== index)
      }
    }));
  };

  const toggleSection = (section) => {
    setExpandedSections(prev => {
      const newSet = new Set(prev);
      if (newSet.has(section)) {
        newSet.delete(section);
      } else {
        newSet.add(section);
      }
      return newSet;
    });
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setSaveStatus('Salvando...');
      const response = await siteContentAPI.updateContent(content);
      if (response.success) {
        setSaveStatus('Salvo com sucesso!');
        console.log('Conteúdo salvo com sucesso:', response.data);
      } else {
        setSaveStatus('Erro ao salvar conteúdo.');
        console.error('Erro ao salvar conteúdo:', response.message);
      }
    } catch (error) {
      setSaveStatus('Erro ao salvar conteúdo.');
      console.error('Erro ao salvar conteúdo:', error);
    } finally {
      setSaving(false);
      // Limpar status após 3 segundos
      setTimeout(() => setSaveStatus(null), 3000);
    }
  };

  // Auto-save com debounce
  const autoSave = useCallback(
    debounce(async (newContent) => {
      try {
        setSaving(true);
        setSaveStatus('Salvando automaticamente...');
        const response = await siteContentAPI.updateContent(newContent);
        if (response.success) {
          setSaveStatus('Salvo automaticamente');
        } else {
          setSaveStatus('Erro no auto-save');
        }
      } catch (error) {
        console.warn('Auto-save falhou:', error);
        setSaveStatus('Erro no auto-save');
      } finally {
        setSaving(false);
        // Limpar status após 2 segundos
        setTimeout(() => setSaveStatus(null), 2000);
      }
    }, 2000),
    []
  );

  // Auto-save quando conteúdo muda
  useEffect(() => {
    if (Object.keys(content).length > 0) {
      autoSave(content);
    }
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando conteúdo...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold text-gray-900">Editor Visual</h1>
              <Badge variant="outline" className="text-sm">
                {mode === 'preview' ? 'Preview' : 'Edição'}
              </Badge>
            </div>
            
            <div className="flex items-center space-x-3">
              <Button
                variant="outline"
                onClick={() => setMode(prev => prev === 'edit' ? 'preview' : 'edit')}
                className="flex items-center space-x-2"
              >
                {mode === 'preview' ? <Edit3 size={16} /> : <Eye size={16} />}
                <span>{mode === 'preview' ? 'Editar' : 'Preview'}</span>
              </Button>
              
              <Button
                onClick={handleSave}
                disabled={saving}
                className="flex items-center space-x-2"
              >
                <Save size={16} />
                <span>Salvar</span>
              </Button>
              
              <div className="flex items-center space-x-2 text-sm text-gray-500">
                {saving ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                    <span>{saveStatus}</span>
                  </>
                ) : saveStatus ? (
                  <>
                    <CheckCircle size={16} className="text-green-500" />
                    <span>{saveStatus}</span>
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
        {mode === 'preview' ? (
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
      Heart, Award, Users, BookOpen, Phone, Mail, MapPin, Clock, Star, Activity, Stethoscope, Monitor
    };
    return icons[iconName] || Heart;
  };
    
  return (
    <div className="bg-white rounded-lg shadow-lg p-8">
      <div className="max-w-4xl mx-auto">
        {/* Hero Section Preview */}
        {content.hero && (
          <section className="mb-12">
            <div className="text-center py-16 bg-gradient-to-r from-blue-600 to-blue-800 text-white rounded-lg">
              <h1 className="text-4xl font-bold mb-4">{content.hero.title}</h1>
              <h2 className="text-2xl mb-6">{content.hero.subtitle}</h2>
              <p className="text-lg mb-8 max-w-2xl mx-auto">{content.hero.description}</p>
              <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
                {content.hero.cta_text}
              </Button>
              
              {content.hero.stats && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-12">
                  {content.hero.stats.map((stat, index) => (
                    <div key={index} className="text-center">
                      <div className="text-3xl font-bold">{stat.number}</div>
                      <div className="text-sm opacity-90">{stat.label}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </section>
        )}

        {/* About Section Preview */}
        {content.about && (
          <section className="mb-12">
            <div className="bg-gray-50 p-8 rounded-lg">
              <h2 className="text-3xl font-bold mb-6 text-center">{content.about.title}</h2>
              <p className="text-lg text-gray-600 mb-8 text-center">{content.about.description}</p>
              
              {content.about.values && (
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
              )}
            </div>
          </section>
        )}

        {/* Services Section Preview */}
        {content.services && (
          <section className="mb-12">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold mb-4">{content.services.title}</h2>
              <p className="text-lg text-gray-600">{content.services.subtitle}</p>
            </div>
            
            {content.services.services && (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {content.services.services.map((service, index) => {
                  const IconComponent = getIconComponent(service.icon);
                  return (
                    <Card key={index} className="text-center">
                      <CardContent className="p-6">
                        <IconComponent size={48} className="mx-auto mb-4 text-blue-600" />
                        <h3 className="text-xl font-semibold mb-3">{service.title}</h3>
                        <p className="text-gray-600 mb-4">{service.description}</p>
                        {service.features && (
                          <ul className="text-sm text-gray-500 space-y-1">
                            {service.features.map((feature, fIndex) => (
                              <li key={fIndex}>• {feature}</li>
                            ))}
                          </ul>
                        )}
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
          </section>
        )}

        {/* Contact Section Preview */}
        {content.contact && (
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
                    <span className="text-lg">{content.contact.working_hours}</span>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}
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
            <TabsTrigger value="blog">Blog</TabsTrigger>
          </TabsList>

          {/* Hero Section */}
          <TabsContent value="hero" className="space-y-6">
            {content.hero && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>Seção Principal (Hero)</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleSection('hero')}
                    >
                      {expandedSections.has('hero') ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    </Button>
                  </CardTitle>
                </CardHeader>
                {expandedSections.has('hero') && (
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="hero-title">Título Principal</Label>
                      <Input
                        id="hero-title"
                        value={content.hero.title || ''}
                        onChange={(e) => updateContent('hero', 'title', e.target.value)}
                        placeholder="Digite o título principal"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="hero-subtitle">Subtítulo</Label>
                      <Input
                        id="hero-subtitle"
                        value={content.hero.subtitle || ''}
                        onChange={(e) => updateContent('hero', 'subtitle', e.target.value)}
                        placeholder="Digite o subtítulo"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="hero-description">Descrição</Label>
                      <Textarea
                        id="hero-description"
                        value={content.hero.description || ''}
                        onChange={(e) => updateContent('hero', 'description', e.target.value)}
                        placeholder="Digite a descrição"
                        rows={3}
                      />
                    </div>

                    <div>
                      <Label htmlFor="hero-cta">Texto do Botão</Label>
                      <Input
                        id="hero-cta"
                        value={content.hero.cta_text || ''}
                        onChange={(e) => updateContent('hero', 'cta_text', e.target.value)}
                        placeholder="Digite o texto do botão"
                      />
                    </div>
                  </CardContent>
                )}
              </Card>
            )}
          </TabsContent>

          {/* About Section */}
          <TabsContent value="about" className="space-y-6">
            {content.about && (
              <Card>
                <CardHeader>
                  <CardTitle>Seção Sobre</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="about-title">Título</Label>
                    <Input
                      id="about-title"
                      value={content.about.title || ''}
                      onChange={(e) => updateContent('about', 'title', e.target.value)}
                      placeholder="Digite o título"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="about-description">Descrição</Label>
                    <Textarea
                      id="about-description"
                      value={content.about.description || ''}
                      onChange={(e) => updateContent('about', 'description', e.target.value)}
                      placeholder="Digite a descrição"
                      rows={4}
                    />
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Services Section */}
          <TabsContent value="services" className="space-y-6">
            {content.services && (
              <Card>
                <CardHeader>
                  <CardTitle>Seção Serviços</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="services-title">Título</Label>
                    <Input
                      id="services-title"
                      value={content.services.title || ''}
                      onChange={(e) => updateContent('services', 'title', e.target.value)}
                      placeholder="Digite o título"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="services-subtitle">Subtítulo</Label>
                    <Input
                      id="services-subtitle"
                      value={content.services.subtitle || ''}
                      onChange={(e) => updateContent('services', 'subtitle', e.target.value)}
                      placeholder="Digite o subtítulo"
                    />
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Contact Section */}
          <TabsContent value="contact" className="space-y-6">
            {content.contact && (
              <Card>
                <CardHeader>
                  <CardTitle>Seção Contato</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="contact-title">Título</Label>
                    <Input
                      id="contact-title"
                      value={content.contact.title || ''}
                      onChange={(e) => updateContent('contact', 'title', e.target.value)}
                      placeholder="Digite o título"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="contact-phone">Telefone</Label>
                    <Input
                      id="contact-phone"
                      value={content.contact.phone || ''}
                      onChange={(e) => updateContent('contact', 'phone', e.target.value)}
                      placeholder="Digite o telefone"
                    />
                  </div>

                  <div>
                    <Label htmlFor="contact-email">Email</Label>
                    <Input
                      id="contact-email"
                      value={content.contact.email || ''}
                      onChange={(e) => updateContent('contact', 'email', e.target.value)}
                      placeholder="Digite o email"
                    />
                  </div>

                  <div>
                    <Label htmlFor="contact-address">Endereço</Label>
                    <Input
                      id="contact-address"
                      value={content.contact.address || ''}
                      onChange={(e) => updateContent('contact', 'address', e.target.value)}
                      placeholder="Digite o endereço"
                    />
                  </div>

                  <div>
                    <Label htmlFor="contact-hours">Horário de Funcionamento</Label>
                    <Input
                      id="contact-hours"
                      value={content.contact.working_hours || ''}
                      onChange={(e) => updateContent('contact', 'working_hours', e.target.value)}
                      placeholder="Digite o horário"
                    />
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Blog Section */}
          <TabsContent value="blog" className="space-y-6">
            {content.blog && (
              <Card>
                <CardHeader>
                  <CardTitle>Seção Blog</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="blog-title">Título</Label>
                    <Input
                      id="blog-title"
                      value={content.blog.title || ''}
                      onChange={(e) => updateContent('blog', 'title', e.target.value)}
                      placeholder="Digite o título"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="blog-subtitle">Subtítulo</Label>
                    <Input
                      id="blog-subtitle"
                      value={content.blog.subtitle || ''}
                      onChange={(e) => updateContent('blog', 'subtitle', e.target.value)}
                      placeholder="Digite o subtítulo"
                    />
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default VisualEditor;

