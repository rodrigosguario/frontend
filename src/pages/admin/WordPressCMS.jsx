import React, { useState, useEffect } from 'react';
import { 
  Save, 
  RefreshCw, 
  Eye, 
  Plus, 
  Trash2, 
  Edit3,
  CheckCircle,
  AlertCircle,
  Loader
} from 'lucide-react';
import { siteContentAPI } from '../../config/api';

const WordPressCMS = () => {
  const [siteContent, setSiteContent] = useState({});
  const [activeSection, setActiveSection] = useState('hero');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState(null);
  const [notification, setNotification] = useState(null);

  // Auto-save a cada 3 segundos quando há mudanças
  useEffect(() => {
    const autoSaveInterval = setInterval(() => {
      if (Object.keys(siteContent).length > 0) {
        handleAutoSave();
      }
    }, 3000);

    return () => clearInterval(autoSaveInterval);
  }, [siteContent]);

  useEffect(() => {
    loadSiteContent();
  }, []);

  const loadSiteContent = async () => {
    try {
      setLoading(true);
      const response = await siteContentAPI.getAllContent();
      
      if (response.data && response.data.data) {
        setSiteContent(response.data.data);
      } else {
        // Fallback para dados locais se API falhar
        const fallbackData = {
          hero: {
            title: "Dr. Rodrigo Sguario",
            subtitle: "Cardiologista Especialista em Transplante Cardíaco",
            description: "Especialista em cardiologia com foco em transplante cardíaco e insuficiência cardíaca avançada.",
            cta_text: "Agendar Consulta",
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
            specialties: ["Transplante Cardíaco", "Insuficiência Cardíaca Avançada", "Cardiologia Preventiva"]
          },
          contact: {
            title: "Entre em Contato",
            phone: "(11) 99999-9999",
            email: "contato@drrodrigosguario.com.br",
            address: "São Paulo, SP"
          }
        };
        setSiteContent(fallbackData);
      }
    } catch (error) {
      console.error('Erro ao carregar conteúdo:', error);
      showNotification('Erro ao carregar conteúdo', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleAutoSave = async () => {
    try {
      setSaving(true);
      const response = await siteContentAPI.updateContent(siteContent);

      if (response.success) {
        setLastSaved(new Date());
        showNotification('Salvo automaticamente', 'success');
      }
    } catch (error) {
      console.error('Erro no auto-save:', error);
      // Salvar localmente como fallback
      localStorage.setItem('siteContent', JSON.stringify(siteContent));
      showNotification('Salvo localmente', 'warning');
    } finally {
      setSaving(false);
    }
  };

  const handleManualSave = async () => {
    try {
      setSaving(true);
      const response = await siteContentAPI.updateContent(siteContent);

      if (response.success) {
        setLastSaved(new Date());
        showNotification('Conteúdo salvo com sucesso!', 'success');
      } else {
        throw new Error('Falha ao salvar');
      }
    } catch (error) {
      console.error('Erro ao salvar:', error);
      showNotification('Erro ao salvar. Tente novamente.', 'error');
    } finally {
      setSaving(false);
    }
  };

  const showNotification = (message, type) => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const updateSectionContent = (sectionId, field, value) => {
    setSiteContent(prev => ({
      ...prev,
      [sectionId]: {
        ...prev[sectionId],
        [field]: value
      }
    }));
  };

  const addArrayItem = (sectionId, field, newItem) => {
    setSiteContent(prev => ({
      ...prev,
      [sectionId]: {
        ...prev[sectionId],
        [field]: [...(prev[sectionId]?.[field] || []), newItem]
      }
    }));
  };

  const removeArrayItem = (sectionId, field, index) => {
    setSiteContent(prev => ({
      ...prev,
      [sectionId]: {
        ...prev[sectionId],
        [field]: prev[sectionId]?.[field]?.filter((_, i) => i !== index) || []
      }
    }));
  };

  const sections = [
    { id: 'hero', name: 'Seção Principal', icon: '🏠' },
    { id: 'about', name: 'Sobre o Médico', icon: '👨‍⚕️' },
    { id: 'services', name: 'Serviços', icon: '🏥' },
    { id: 'contact', name: 'Contato', icon: '📞' }
  ];

  const renderSectionEditor = () => {
    const section = siteContent[activeSection] || {};

    switch (activeSection) {
      case 'hero':
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900">Seção Principal</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Título Principal
                </label>
                <input
                  type="text"
                  value={section.title || ''}
                  onChange={(e) => updateSectionContent('hero', 'title', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Nome do médico"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Subtítulo
                </label>
                <input
                  type="text"
                  value={section.subtitle || ''}
                  onChange={(e) => updateSectionContent('hero', 'subtitle', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Especialidade médica"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Descrição
              </label>
              <textarea
                value={section.description || ''}
                onChange={(e) => updateSectionContent('hero', 'description', e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Descrição do médico e especialidades"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Texto do Botão
              </label>
              <input
                type="text"
                value={section.cta_text || ''}
                onChange={(e) => updateSectionContent('hero', 'cta_text', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Ex: Agendar Consulta"
              />
            </div>

            {/* Estatísticas */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Estatísticas
                </label>
                <button
                  onClick={() => addArrayItem('hero', 'stats', { number: '', label: '' })}
                  className="flex items-center px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600 text-sm"
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Adicionar
                </button>
              </div>
              
              {(section.stats || []).map((stat, index) => (
                <div key={index} className="flex items-center space-x-2 mb-2">
                  <input
                    type="text"
                    value={stat.number || ''}
                    onChange={(e) => {
                      const newStats = [...(section.stats || [])];
                      newStats[index] = { ...newStats[index], number: e.target.value };
                      updateSectionContent('hero', 'stats', newStats);
                    }}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Número"
                  />
                  <input
                    type="text"
                    value={stat.label || ''}
                    onChange={(e) => {
                      const newStats = [...(section.stats || [])];
                      newStats[index] = { ...newStats[index], label: e.target.value };
                      updateSectionContent('hero', 'stats', newStats);
                    }}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Descrição"
                  />
                  <button
                    onClick={() => removeArrayItem('hero', 'stats', index)}
                    className="p-2 text-red-500 hover:bg-red-50 rounded-md"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        );

      case 'about':
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900">Sobre o Médico</h3>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Título da Seção
              </label>
              <input
                type="text"
                value={section.title || ''}
                onChange={(e) => updateSectionContent('about', 'title', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Ex: Sobre o Dr. Rodrigo"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Descrição
              </label>
              <textarea
                value={section.description || ''}
                onChange={(e) => updateSectionContent('about', 'description', e.target.value)}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Biografia e experiência do médico"
              />
            </div>

            {/* Especialidades */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Especialidades
                </label>
                <button
                  onClick={() => addArrayItem('about', 'specialties', '')}
                  className="flex items-center px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600 text-sm"
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Adicionar
                </button>
              </div>
              
              {(section.specialties || []).map((specialty, index) => (
                <div key={index} className="flex items-center space-x-2 mb-2">
                  <input
                    type="text"
                    value={specialty || ''}
                    onChange={(e) => {
                      const newSpecialties = [...(section.specialties || [])];
                      newSpecialties[index] = e.target.value;
                      updateSectionContent('about', 'specialties', newSpecialties);
                    }}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Nome da especialidade"
                  />
                  <button
                    onClick={() => removeArrayItem('about', 'specialties', index)}
                    className="p-2 text-red-500 hover:bg-red-50 rounded-md"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        );

      case 'contact':
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900">Informações de Contato</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Título da Seção
                </label>
                <input
                  type="text"
                  value={section.title || ''}
                  onChange={(e) => updateSectionContent('contact', 'title', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Ex: Entre em Contato"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Telefone
                </label>
                <input
                  type="text"
                  value={section.phone || ''}
                  onChange={(e) => updateSectionContent('contact', 'phone', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="(11) 99999-9999"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  E-mail
                </label>
                <input
                  type="email"
                  value={section.email || ''}
                  onChange={(e) => updateSectionContent('contact', 'email', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="contato@exemplo.com"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Endereço
                </label>
                <input
                  type="text"
                  value={section.address || ''}
                  onChange={(e) => updateSectionContent('contact', 'address', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Cidade, Estado"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Horários de Funcionamento
              </label>
              <textarea
                value={section.hours || ''}
                onChange={(e) => updateSectionContent('contact', 'hours', e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Segunda a Sexta: 8h às 18h&#10;Sábado: 8h às 12h"
              />
            </div>
          </div>
        );

      default:
        return (
          <div className="text-center py-8">
            <p className="text-gray-500">Selecione uma seção para editar</p>
          </div>
        );
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader className="h-8 w-8 animate-spin text-blue-500" />
        <span className="ml-2 text-gray-600">Carregando conteúdo...</span>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">WordPress CMS</h1>
          <p className="text-gray-600">Edite todo o conteúdo do seu site</p>
        </div>
        
        <div className="flex items-center space-x-4">
          {lastSaved && (
            <span className="text-sm text-gray-500">
              Salvo às {lastSaved.toLocaleTimeString()}
            </span>
          )}
          
          <button
            onClick={handleManualSave}
            disabled={saving}
            className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50"
          >
            {saving ? (
              <Loader className="h-4 w-4 animate-spin mr-2" />
            ) : (
              <Save className="h-4 w-4 mr-2" />
            )}
            {saving ? 'Salvando...' : 'Salvar'}
          </button>
        </div>
      </div>

      {/* Notification */}
      {notification && (
        <div className={`mb-4 p-4 rounded-md flex items-center ${
          notification.type === 'success' ? 'bg-green-50 text-green-800' :
          notification.type === 'error' ? 'bg-red-50 text-red-800' :
          'bg-yellow-50 text-yellow-800'
        }`}>
          {notification.type === 'success' ? (
            <CheckCircle className="h-5 w-5 mr-2" />
          ) : (
            <AlertCircle className="h-5 w-5 mr-2" />
          )}
          {notification.message}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar - Seções */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-md p-4">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Seções do Site</h2>
            <nav className="space-y-2">
              {sections.map((section) => (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={`w-full flex items-center px-3 py-2 text-left rounded-md transition-colors ${
                    activeSection === section.id
                      ? 'bg-blue-50 text-blue-700 border border-blue-200'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <span className="mr-3">{section.icon}</span>
                  {section.name}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Main Content - Editor */}
        <div className="lg:col-span-3">
          <div className="bg-white rounded-lg shadow-md p-6">
            {renderSectionEditor()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default WordPressCMS;

