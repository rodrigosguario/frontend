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
  Loader,
  FileText,
  Settings,
  Image,
  Type
} from 'lucide-react';

const ContentEditorAdvanced = () => {
  const [sections, setSections] = useState([]);
  const [activeSection, setActiveSection] = useState(null);
  const [sectionContent, setSectionContent] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState(null);
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    loadAllSections();
  }, []);

  // Auto-save a cada 5 segundos quando há mudanças
  useEffect(() => {
    if (activeSection && sectionContent[activeSection]) {
      const autoSaveInterval = setInterval(() => {
        handleAutoSave();
      }, 5000);

      return () => clearInterval(autoSaveInterval);
    }
  }, [activeSection, sectionContent]);

  const loadAllSections = async () => {
    try {
      setLoading(true);
      
      // Tentar carregar todas as seções
      const response = await fetch('/api/content');
      
      if (response.ok) {
        const data = await response.json();
        setSections(data);
        
        // Preparar conteúdo das seções
        const contentMap = {};
        data.forEach(section => {
          contentMap[section.section_id] = section.content_data;
        });
        setSectionContent(contentMap);
        
        // Selecionar primeira seção
        if (data.length > 0) {
          setActiveSection(data[0].section_id);
        }
      } else {
        // Fallback para seções padrão
        const defaultSections = [
          { section_id: 'hero', section_name: 'Seção Principal' },
          { section_id: 'about', section_name: 'Sobre o Médico' },
          { section_id: 'services', section_name: 'Serviços' },
          { section_id: 'contact', section_name: 'Contato' }
        ];
        setSections(defaultSections);
        setActiveSection('hero');
      }
    } catch (error) {
      console.error('Erro ao carregar seções:', error);
      showNotification('Erro ao carregar conteúdo', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleAutoSave = async () => {
    if (!activeSection || !sectionContent[activeSection]) return;

    try {
      setSaving(true);
      const response = await fetch(`/api/content/${activeSection}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content_data: sectionContent[activeSection]
        })
      });

      if (response.ok) {
        setLastSaved(new Date());
        showNotification('Salvo automaticamente', 'success');
      } else {
        // Fallback para localStorage
        localStorage.setItem(`section_${activeSection}`, JSON.stringify(sectionContent[activeSection]));
        showNotification('Salvo localmente', 'warning');
      }
    } catch (error) {
      console.error('Erro no auto-save:', error);
      // Salvar localmente como fallback
      localStorage.setItem(`section_${activeSection}`, JSON.stringify(sectionContent[activeSection]));
      showNotification('Salvo localmente', 'warning');
    } finally {
      setSaving(false);
    }
  };

  const handleManualSave = async () => {
    if (!activeSection || !sectionContent[activeSection]) return;

    try {
      setSaving(true);
      const response = await fetch(`/api/content/${activeSection}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content_data: sectionContent[activeSection]
        })
      });

      if (response.ok) {
        setLastSaved(new Date());
        showNotification('Conteúdo salvo com sucesso!', 'success');
      } else {
        throw new Error('Falha ao salvar');
      }
    } catch (error) {
      console.error('Erro ao salvar:', error);
      showNotification('Erro ao salvar. Conteúdo salvo localmente.', 'warning');
      localStorage.setItem(`section_${activeSection}`, JSON.stringify(sectionContent[activeSection]));
    } finally {
      setSaving(false);
    }
  };

  const showNotification = (message, type) => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const updateField = (field, value) => {
    setSectionContent(prev => ({
      ...prev,
      [activeSection]: {
        ...prev[activeSection],
        [field]: value
      }
    }));
  };

  const addArrayItem = (field, newItem) => {
    setSectionContent(prev => ({
      ...prev,
      [activeSection]: {
        ...prev[activeSection],
        [field]: [...(prev[activeSection]?.[field] || []), newItem]
      }
    }));
  };

  const removeArrayItem = (field, index) => {
    setSectionContent(prev => ({
      ...prev,
      [activeSection]: {
        ...prev[activeSection],
        [field]: prev[activeSection]?.[field]?.filter((_, i) => i !== index) || []
      }
    }));
  };

  const updateArrayItem = (field, index, newValue) => {
    setSectionContent(prev => {
      const newArray = [...(prev[activeSection]?.[field] || [])];
      newArray[index] = newValue;
      return {
        ...prev,
        [activeSection]: {
          ...prev[activeSection],
          [field]: newArray
        }
      };
    });
  };

  const renderFieldEditor = (field, value, type = 'text') => {
    switch (type) {
      case 'textarea':
        return (
          <textarea
            value={value || ''}
            onChange={(e) => updateField(field, e.target.value)}
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder={`Digite ${field}`}
          />
        );
      
      case 'array':
        return (
          <div className="space-y-3">
            {(value || []).map((item, index) => (
              <div key={index} className="flex items-center space-x-2">
                <input
                  type="text"
                  value={item || ''}
                  onChange={(e) => updateArrayItem(field, index, e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder={`Item ${index + 1}`}
                />
                <button
                  onClick={() => removeArrayItem(field, index)}
                  className="p-2 text-red-500 hover:bg-red-50 rounded-md"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
            <button
              onClick={() => addArrayItem(field, '')}
              className="flex items-center px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600 text-sm"
            >
              <Plus className="h-4 w-4 mr-1" />
              Adicionar Item
            </button>
          </div>
        );
      
      default:
        return (
          <input
            type={type}
            value={value || ''}
            onChange={(e) => updateField(field, e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder={`Digite ${field}`}
          />
        );
    }
  };

  const renderSectionEditor = () => {
    if (!activeSection || !sectionContent[activeSection]) {
      return (
        <div className="text-center py-8">
          <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">Selecione uma seção para editar</p>
        </div>
      );
    }

    const content = sectionContent[activeSection];
    const sectionName = sections.find(s => s.section_id === activeSection)?.section_name || activeSection;

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-semibold text-gray-900 flex items-center">
            <Edit3 className="h-5 w-5 mr-2 text-blue-600" />
            Editando: {sectionName}
          </h3>
          
          <div className="flex items-center space-x-2">
            {saving && (
              <div className="flex items-center text-sm text-gray-500">
                <Loader className="h-4 w-4 animate-spin mr-1" />
                Salvando...
              </div>
            )}
            {lastSaved && (
              <span className="text-sm text-gray-500">
                Salvo às {lastSaved.toLocaleTimeString()}
              </span>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {Object.entries(content).map(([field, value]) => (
            <div key={field} className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 capitalize">
                <Type className="h-4 w-4 inline mr-1" />
                {field.replace(/_/g, ' ')}
              </label>
              
              {Array.isArray(value) ? (
                renderFieldEditor(field, value, 'array')
              ) : typeof value === 'string' && value.length > 100 ? (
                renderFieldEditor(field, value, 'textarea')
              ) : (
                renderFieldEditor(field, value, 'text')
              )}
            </div>
          ))}
        </div>

        {/* Preview */}
        <div className="mt-8 p-4 bg-gray-50 rounded-lg">
          <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Eye className="h-5 w-5 mr-2" />
            Preview dos Dados
          </h4>
          <pre className="text-sm text-gray-600 overflow-auto max-h-40">
            {JSON.stringify(content, null, 2)}
          </pre>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader className="h-8 w-8 animate-spin text-blue-500" />
        <span className="ml-2 text-gray-600">Carregando editor...</span>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Editor de Conteúdo</h1>
          <p className="text-gray-600">Edite o conteúdo das seções do seu site</p>
        </div>
        
        <div className="flex items-center space-x-4">
          <button
            onClick={loadAllSections}
            className="flex items-center px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Recarregar
          </button>
          
          <button
            onClick={handleManualSave}
            disabled={saving || !activeSection}
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
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Settings className="h-5 w-5 mr-2" />
              Seções Disponíveis
            </h2>
            <nav className="space-y-2">
              {sections.map((section) => (
                <button
                  key={section.section_id}
                  onClick={() => setActiveSection(section.section_id)}
                  className={`w-full flex items-center px-3 py-2 text-left rounded-md transition-colors ${
                    activeSection === section.section_id
                      ? 'bg-blue-50 text-blue-700 border border-blue-200'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <FileText className="h-4 w-4 mr-3" />
                  <div>
                    <div className="font-medium">{section.section_name}</div>
                    <div className="text-xs text-gray-500">{section.section_id}</div>
                  </div>
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

export default ContentEditorAdvanced;
