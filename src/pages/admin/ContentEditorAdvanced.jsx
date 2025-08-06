import React, { useState, useEffect } from 'react';
import { 
  Save, 
  Edit3, 
  Eye, 
  RefreshCw,
  Settings,
  FileText,
  Image,
  Type,
  Layout,
  Palette,
  ArrowLeft
} from 'lucide-react';
import { contentAPI } from '@/config/api';

const ContentEditorAdvanced = () => {
  const [sections, setSections] = useState([]);
  const [selectedSection, setSelectedSection] = useState(null);
  const [editingContent, setEditingContent] = useState({});
  const [loading, setLoading] = useState(false);
  const [activeView, setActiveView] = useState('list'); // 'list' ou 'edit'

  useEffect(() => {
    loadSections();
  }, []);

  const loadSections = async () => {
    setLoading(true);
    try {
      const response = await contentAPI.getAllContent();
      const sectionsData = response.data || [];
      setSections(sectionsData);
    } catch (error) {
      console.error('Erro ao carregar seções:', error);
      // Fallback com dados de exemplo
      setSections([
        {
          section_id: 'hero',
          section_name: 'Seção Principal',
          content_data: {
            title: 'Dr. Rodrigo Sguario',
            subtitle: 'Cardiologista Especialista em Transplante Cardíaco',
            description: 'Especialista em cardiologia com foco em transplante cardíaco e insuficiência cardíaca avançada.',
            cta_text: 'Agendar Consulta'
          }
        },
        {
          section_id: 'about',
          section_name: 'Sobre o Médico',
          content_data: {
            title: 'Sobre o Dr. Rodrigo',
            description: 'Médico cardiologista com ampla experiência em transplante cardíaco.',
            experience: '15+ anos de experiência',
            specialties: ['Transplante Cardíaco', 'Insuficiência Cardíaca', 'Cardiologia Preventiva']
          }
        },
        {
          section_id: 'services',
          section_name: 'Serviços',
          content_data: {
            title: 'Serviços Oferecidos',
            services: [
              {
                name: 'Transplante Cardíaco',
                description: 'Avaliação e acompanhamento para transplante cardíaco'
              },
              {
                name: 'Insuficiência Cardíaca',
                description: 'Tratamento especializado para insuficiência cardíaca'
              }
            ]
          }
        },
        {
          section_id: 'contact',
          section_name: 'Contato',
          content_data: {
            title: 'Entre em Contato',
            phone: '(11) 99999-9999',
            email: 'contato@drrodrigosguario.com.br',
            address: 'São Paulo, SP'
          }
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const editSection = (section) => {
    setSelectedSection(section);
    setEditingContent(section.content_data);
    setActiveView('edit');
  };

  const saveSection = async () => {
    if (!selectedSection) return;

    setLoading(true);
    try {
      await contentAPI.updateSectionContent(selectedSection.section_id, editingContent);
      
      // Atualizar estado local
      setSections(sections.map(section => 
        section.section_id === selectedSection.section_id 
          ? { ...section, content_data: editingContent }
          : section
      ));
      
      alert('Seção atualizada com sucesso!');
      setActiveView('list');
    } catch (error) {
      console.error('Erro ao salvar seção:', error);
      alert('Erro ao salvar seção. Verifique sua conexão e tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const updateField = (field, value) => {
    setEditingContent(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const updateArrayField = (field, index, value) => {
    setEditingContent(prev => ({
      ...prev,
      [field]: prev[field].map((item, i) => i === index ? value : item)
    }));
  };

  const updateObjectField = (field, subField, value) => {
    setEditingContent(prev => ({
      ...prev,
      [field]: {
        ...prev[field],
        [subField]: value
      }
    }));
  };

  const updateServiceField = (index, field, value) => {
    setEditingContent(prev => ({
      ...prev,
      services: prev.services.map((service, i) => 
        i === index ? { ...service, [field]: value } : service
      )
    }));
  };

  const addArrayItem = (field) => {
    setEditingContent(prev => ({
      ...prev,
      [field]: [...(prev[field] || []), '']
    }));
  };

  const addService = () => {
    setEditingContent(prev => ({
      ...prev,
      services: [...(prev.services || []), { name: '', description: '' }]
    }));
  };

  const removeArrayItem = (field, index) => {
    setEditingContent(prev => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index)
    }));
  };

  const renderFieldEditor = (key, value) => {
    // Tratamento especial para services
    if (key === 'services' && Array.isArray(value)) {
      return (
        <div key={key} className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Serviços Oferecidos
          </label>
          {value.map((service, index) => (
            <div key={index} className="mb-4 p-4 border border-gray-200 rounded-lg">
              <div className="flex justify-between items-center mb-2">
                <h4 className="font-medium text-gray-700">Serviço {index + 1}</h4>
                <button
                  onClick={() => removeArrayItem('services', index)}
                  className="px-2 py-1 bg-red-500 text-white rounded text-sm hover:bg-red-600"
                >
                  Remover
                </button>
              </div>
              <div className="space-y-2">
                <input
                  type="text"
                  value={service.name || ''}
                  onChange={(e) => updateServiceField(index, 'name', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Nome do serviço"
                />
                <textarea
                  value={service.description || ''}
                  onChange={(e) => updateServiceField(index, 'description', e.target.value)}
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Descrição do serviço"
                />
              </div>
            </div>
          ))}
          <button
            onClick={addService}
            className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
          >
            Adicionar Serviço
          </button>
        </div>
      );
    }

    // Tratamento para arrays simples (como specialties)
    if (Array.isArray(value)) {
      return (
        <div key={key} className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2 capitalize">
            {key.replace('_', ' ')}
          </label>
          {value.map((item, index) => (
            <div key={index} className="flex gap-2 mb-2">
              <input
                type="text"
                value={item}
                onChange={(e) => updateArrayField(key, index, e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder={`${key} ${index + 1}`}
              />
              <button
                onClick={() => removeArrayItem(key, index)}
                className="px-3 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
              >
                Remover
              </button>
            </div>
          ))}
          <button
            onClick={() => addArrayItem(key)}
            className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
          >
            Adicionar {key}
          </button>
        </div>
      );
    }

    // Tratamento para objetos complexos
    if (typeof value === 'object' && value !== null) {
      return (
        <div key={key} className="mb-6 p-4 border border-gray-200 rounded-lg">
          <h4 className="font-medium text-gray-700 mb-3 capitalize">
            {key.replace('_', ' ')}
          </h4>
          {Object.entries(value).map(([subKey, subValue]) => (
            <div key={subKey} className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2 capitalize">
                {subKey.replace('_', ' ')}
              </label>
              <input
                type="text"
                value={subValue}
                onChange={(e) => updateObjectField(key, subKey, e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder={`Digite o ${subKey}`}
              />
            </div>
          ))}
        </div>
      );
    }

    // Tratamento para strings
    const isLongText = typeof value === 'string' && value.length > 100;

    return (
      <div key={key} className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2 capitalize">
          {key.replace('_', ' ')}
        </label>
        {isLongText ? (
          <textarea
            value={value}
            onChange={(e) => updateField(key, e.target.value)}
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder={`Digite o ${key}`}
          />
        ) : (
          <input
            type="text"
            value={value}
            onChange={(e) => updateField(key, e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder={`Digite o ${key}`}
          />
        )}
      </div>
    );
  };

  if (activeView === 'edit' && selectedSection) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setActiveView('list')}
              className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Voltar
            </button>
            <h2 className="text-2xl font-bold text-gray-800">
              Editando: {selectedSection.section_name}
            </h2>
          </div>
          <button
            onClick={saveSection}
            disabled={loading}
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2"
          >
            {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            {loading ? 'Salvando...' : 'Salvar Alterações'}
          </button>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-4">
              <Edit3 className="w-5 h-5 text-blue-600" />
              <h3 className="text-lg font-semibold text-gray-800">
                Conteúdo da Seção
              </h3>
            </div>
            <p className="text-gray-600 mb-4">
              Edite o conteúdo desta seção. As alterações serão aplicadas automaticamente ao site.
            </p>
          </div>

          <div className="space-y-4">
            {Object.entries(editingContent).map(([key, value]) => 
              renderFieldEditor(key, value)
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Layout className="w-8 h-8 text-blue-600" />
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Editor de Conteúdo Avançado</h2>
            <p className="text-gray-600">Gerencie o conteúdo das seções do seu site como no WordPress</p>
          </div>
        </div>
        <button
          onClick={loadSections}
          disabled={loading}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2"
        >
          {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
          Atualizar
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <RefreshCw className="w-8 h-8 animate-spin text-blue-600" />
          <span className="ml-2 text-gray-600">Carregando seções...</span>
        </div>
      ) : (
        <div className="grid gap-6">
          {sections.map((section) => (
            <div key={section.section_id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    {section.section_id === 'hero' && <Type className="w-5 h-5 text-blue-600" />}
                    {section.section_id === 'about' && <FileText className="w-5 h-5 text-blue-600" />}
                    {section.section_id === 'services' && <Settings className="w-5 h-5 text-blue-600" />}
                    {section.section_id === 'contact' && <Image className="w-5 h-5 text-blue-600" />}
                    {!['hero', 'about', 'services', 'contact'].includes(section.section_id) && <Layout className="w-5 h-5 text-blue-600" />}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800">
                      {section.section_name}
                    </h3>
                    <p className="text-sm text-gray-500">
                      ID: {section.section_id}
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => editSection(section)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center gap-2"
                  >
                    <Edit3 className="w-4 h-4" />
                    Editar
                  </button>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-medium text-gray-700 mb-2">Prévia do Conteúdo:</h4>
                <div className="text-sm text-gray-600 space-y-1">
                  {Object.entries(section.content_data).slice(0, 3).map(([key, value]) => (
                    <div key={key}>
                      <span className="font-medium capitalize">{key.replace('_', ' ')}:</span>{' '}
                      <span className="text-gray-500">
                        {Array.isArray(value) 
                          ? `${value.length} itens`
                          : typeof value === 'object'
                          ? 'Objeto complexo'
                          : String(value).substring(0, 50) + (String(value).length > 50 ? '...' : '')
                        }
                      </span>
                    </div>
                  ))}
                  {Object.keys(section.content_data).length > 3 && (
                    <div className="text-gray-400">
                      +{Object.keys(section.content_data).length - 3} campos adicionais
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {sections.length === 0 && !loading && (
        <div className="text-center py-12">
          <Layout className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-500 mb-2">
            Nenhuma seção encontrada
          </h3>
          <p className="text-gray-400">
            As seções do site serão carregadas automaticamente quando disponíveis.
          </p>
        </div>
      )}
    </div>
  );
};

export default ContentEditorAdvanced;

