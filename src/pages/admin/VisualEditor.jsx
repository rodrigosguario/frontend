import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { 
  Save, 
  Eye, 
  Undo, 
  Settings, 
  Palette, 
  Type, 
  Layout,
  Image,
  Plus,
  Trash2,
  Move,
  Edit3,
  Monitor,
  Smartphone,
  Tablet
} from 'lucide-react';

const VisualEditor = () => {
  const [sections, setSections] = useState([]);
  const [selectedSection, setSelectedSection] = useState(null);
  const [editingField, setEditingField] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);
  const [deviceView, setDeviceView] = useState('desktop');

  // Carregar todas as seções do site
  useEffect(() => {
    loadSections();
  }, []);

  const loadSections = async () => {
    setLoading(true);
    try {
      const response = await fetch('https://dr-rodrigo-backend.onrender.com/api/site/sections');
      const data = await response.json();
      setSections(data || []);
      if (data && data.length > 0) {
        setSelectedSection(data[0]);
      }
    } catch (error) {
      console.error('Erro ao carregar seções:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveSection = async (sectionId, contentData) => {
    setSaving(true);
    try {
      const response = await fetch(`https://dr-rodrigo-backend.onrender.com/api/site/sections/${sectionId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content_data: contentData }),
      });

      if (response.ok) {
        alert('Seção salva com sucesso!');
        await loadSections();
      } else {
        alert('Erro ao salvar seção');
      }
    } catch (error) {
      console.error('Erro ao salvar:', error);
      alert('Erro ao salvar seção');
    } finally {
      setSaving(false);
    }
  };

  const updateFieldValue = (path, value) => {
    if (!selectedSection) return;

    const updatedContent = { ...selectedSection.content_data };
    const pathArray = path.split('.');
    
    let current = updatedContent;
    for (let i = 0; i < pathArray.length - 1; i++) {
      if (!current[pathArray[i]]) {
        current[pathArray[i]] = {};
      }
      current = current[pathArray[i]];
    }
    
    current[pathArray[pathArray.length - 1]] = value;
    
    setSelectedSection({
      ...selectedSection,
      content_data: updatedContent
    });
  };

  const renderFieldEditor = (label, path, value, type = 'text') => {
    const isEditing = editingField === path;
    
    return (
      <div className="mb-4 p-3 border rounded-lg hover:bg-gray-50 transition-colors">
        <div className="flex items-center justify-between mb-2">
          <label className="text-sm font-medium text-gray-700">{label}</label>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setEditingField(isEditing ? null : path)}
          >
            <Edit3 className="w-4 h-4" />
          </Button>
        </div>
        
        {isEditing ? (
          <div className="space-y-2">
            {type === 'textarea' ? (
              <Textarea
                value={value || ''}
                onChange={(e) => updateFieldValue(path, e.target.value)}
                className="w-full"
                rows={3}
              />
            ) : (
              <Input
                type={type}
                value={value || ''}
                onChange={(e) => updateFieldValue(path, e.target.value)}
                className="w-full"
              />
            )}
            <div className="flex gap-2">
              <Button
                size="sm"
                onClick={() => {
                  saveSection(selectedSection.section_id, selectedSection.content_data);
                  setEditingField(null);
                }}
              >
                <Save className="w-4 h-4 mr-1" />
                Salvar
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setEditingField(null)}
              >
                Cancelar
              </Button>
            </div>
          </div>
        ) : (
          <div className="text-sm text-gray-600 bg-gray-100 p-2 rounded">
            {value || 'Clique para editar...'}
          </div>
        )}
      </div>
    );
  };

  const renderArrayEditor = (label, path, array) => {
    return (
      <div className="mb-6 p-4 border rounded-lg">
        <div className="flex items-center justify-between mb-3">
          <h4 className="font-medium text-gray-800">{label}</h4>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              const newArray = [...(array || []), {}];
              updateFieldValue(path, newArray);
            }}
          >
            <Plus className="w-4 h-4 mr-1" />
            Adicionar
          </Button>
        </div>
        
        {array && array.map((item, index) => (
          <div key={index} className="mb-3 p-3 bg-gray-50 rounded border">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Item {index + 1}</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  const newArray = array.filter((_, i) => i !== index);
                  updateFieldValue(path, newArray);
                }}
              >
                <Trash2 className="w-4 h-4 text-red-500" />
              </Button>
            </div>
            
            {Object.keys(item).map((key) => (
              <div key={key} className="mb-2">
                {renderFieldEditor(
                  key.charAt(0).toUpperCase() + key.slice(1),
                  `${path}.${index}.${key}`,
                  item[key],
                  key === 'description' ? 'textarea' : 'text'
                )}
              </div>
            ))}
          </div>
        ))}
      </div>
    );
  };

  const renderSectionContent = () => {
    if (!selectedSection) return null;

    const { content_data } = selectedSection;

    switch (selectedSection.section_id) {
      case 'hero':
        return (
          <div className="space-y-4">
            {renderFieldEditor('Título Principal', 'title', content_data.title)}
            {renderFieldEditor('Subtítulo', 'subtitle', content_data.subtitle)}
            {renderFieldEditor('Descrição', 'description', content_data.description, 'textarea')}
            {renderFieldEditor('Texto do Botão', 'cta_text', content_data.cta_text)}
            {renderFieldEditor('Link do Botão', 'cta_link', content_data.cta_link)}
            {renderArrayEditor('Conquistas', 'achievements', content_data.achievements)}
            {renderArrayEditor('Estatísticas', 'stats', content_data.stats)}
          </div>
        );

      case 'about':
        return (
          <div className="space-y-4">
            {renderFieldEditor('Título da Seção', 'title', content_data.title)}
            {renderFieldEditor('Descrição', 'description', content_data.description, 'textarea')}
            {renderArrayEditor('Formação Acadêmica', 'education', content_data.education)}
            {renderArrayEditor('Especialidades', 'specialties', content_data.specialties)}
            {renderArrayEditor('Valores', 'values', content_data.values)}
          </div>
        );

      case 'services':
        return (
          <div className="space-y-4">
            {renderFieldEditor('Título da Seção', 'title', content_data.title)}
            {renderFieldEditor('Descrição', 'description', content_data.description, 'textarea')}
            {renderArrayEditor('Serviços', 'services', content_data.services)}
          </div>
        );

      case 'contact':
        return (
          <div className="space-y-4">
            {renderFieldEditor('Título da Seção', 'title', content_data.title)}
            {renderFieldEditor('Descrição', 'description', content_data.description, 'textarea')}
            {renderFieldEditor('Telefone', 'phone', content_data.phone)}
            {renderFieldEditor('E-mail', 'email', content_data.email)}
            {renderFieldEditor('Endereço', 'address', content_data.address)}
            {renderFieldEditor('Horários', 'hours', content_data.hours, 'textarea')}
            {renderFieldEditor('Emergência', 'emergency', content_data.emergency)}
            {renderArrayEditor('Campos do Formulário', 'form_fields', content_data.form_fields)}
          </div>
        );

      case 'header':
        return (
          <div className="space-y-4">
            {renderFieldEditor('Texto do Logo', 'logo_text', content_data.logo_text)}
            {renderFieldEditor('Subtítulo do Logo', 'logo_subtitle', content_data.logo_subtitle)}
            {renderArrayEditor('Itens do Menu', 'menu_items', content_data.menu_items)}
            {content_data.cta_button && (
              <div className="p-4 border rounded-lg">
                <h4 className="font-medium mb-3">Botão de Ação</h4>
                {renderFieldEditor('Texto', 'cta_button.text', content_data.cta_button.text)}
                {renderFieldEditor('Link', 'cta_button.href', content_data.cta_button.href)}
                {renderFieldEditor('WhatsApp', 'cta_button.whatsapp', content_data.cta_button.whatsapp)}
              </div>
            )}
          </div>
        );

      case 'footer':
        return (
          <div className="space-y-4">
            {renderFieldEditor('Nome da Clínica', 'clinic_name', content_data.clinic_name)}
            {renderFieldEditor('Descrição', 'description', content_data.description, 'textarea')}
            {renderArrayEditor('Links Rápidos', 'quick_links', content_data.quick_links)}
            {content_data.contact_info && (
              <div className="p-4 border rounded-lg">
                <h4 className="font-medium mb-3">Informações de Contato</h4>
                {renderFieldEditor('Endereço', 'contact_info.address', content_data.contact_info.address)}
                {renderFieldEditor('Telefone', 'contact_info.phone', content_data.contact_info.phone)}
                {renderFieldEditor('E-mail', 'contact_info.email', content_data.contact_info.email)}
                {renderFieldEditor('Horários', 'contact_info.hours', content_data.contact_info.hours)}
              </div>
            )}
            {renderArrayEditor('Redes Sociais', 'social_links', content_data.social_links)}
            {renderFieldEditor('Copyright', 'copyright', content_data.copyright)}
            {renderArrayEditor('Links Legais', 'legal_links', content_data.legal_links)}
          </div>
        );

      default:
        return (
          <div className="space-y-4">
            {Object.keys(content_data).map((key) => {
              const value = content_data[key];
              if (Array.isArray(value)) {
                return renderArrayEditor(
                  key.charAt(0).toUpperCase() + key.slice(1),
                  key,
                  value
                );
              } else if (typeof value === 'object') {
                return (
                  <div key={key} className="p-4 border rounded-lg">
                    <h4 className="font-medium mb-3">{key.charAt(0).toUpperCase() + key.slice(1)}</h4>
                    {Object.keys(value).map((subKey) => (
                      renderFieldEditor(
                        subKey.charAt(0).toUpperCase() + subKey.slice(1),
                        `${key}.${subKey}`,
                        value[subKey],
                        subKey.includes('description') ? 'textarea' : 'text'
                      )
                    ))}
                  </div>
                );
              } else {
                return renderFieldEditor(
                  key.charAt(0).toUpperCase() + key.slice(1),
                  key,
                  value,
                  key.includes('description') ? 'textarea' : 'text'
                );
              }
            })}
          </div>
        );
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="h-screen flex bg-gray-50">
      {/* Sidebar - Lista de Seções */}
      <div className="w-80 bg-white border-r overflow-y-auto">
        <div className="p-4 border-b">
          <h2 className="text-lg font-semibold text-gray-800">Editor Visual</h2>
          <p className="text-sm text-gray-600">Edite qualquer parte do seu site</p>
        </div>
        
        <div className="p-4">
          <div className="space-y-2">
            {sections.map((section) => (
              <button
                key={section.section_id}
                onClick={() => setSelectedSection(section)}
                className={`w-full text-left p-3 rounded-lg transition-colors ${
                  selectedSection?.section_id === section.section_id
                    ? 'bg-primary text-white'
                    : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                }`}
              >
                <div className="font-medium">{section.section_name}</div>
                <div className="text-xs opacity-75">{section.section_id}</div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Editor Principal */}
      <div className="flex-1 flex flex-col">
        {/* Toolbar */}
        <div className="bg-white border-b p-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h3 className="text-lg font-medium">
              {selectedSection?.section_name || 'Selecione uma seção'}
            </h3>
            <Badge variant="outline">{selectedSection?.section_id}</Badge>
          </div>
          
          <div className="flex items-center gap-2">
            {/* Device Preview */}
            <div className="flex items-center gap-1 mr-4">
              <Button
                variant={deviceView === 'desktop' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setDeviceView('desktop')}
              >
                <Monitor className="w-4 h-4" />
              </Button>
              <Button
                variant={deviceView === 'tablet' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setDeviceView('tablet')}
              >
                <Tablet className="w-4 h-4" />
              </Button>
              <Button
                variant={deviceView === 'mobile' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setDeviceView('mobile')}
              >
                <Smartphone className="w-4 h-4" />
              </Button>
            </div>

            <Button
              variant="outline"
              onClick={() => setPreviewMode(!previewMode)}
            >
              <Eye className="w-4 h-4 mr-2" />
              {previewMode ? 'Editar' : 'Visualizar'}
            </Button>
            
            <Button
              onClick={() => selectedSection && saveSection(selectedSection.section_id, selectedSection.content_data)}
              disabled={saving || !selectedSection}
            >
              <Save className="w-4 h-4 mr-2" />
              {saving ? 'Salvando...' : 'Salvar Tudo'}
            </Button>
          </div>
        </div>

        {/* Área de Edição */}
        <div className="flex-1 overflow-y-auto p-6">
          {selectedSection ? (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Edit3 className="w-5 h-5" />
                  Editando: {selectedSection.section_name}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {renderSectionContent()}
              </CardContent>
            </Card>
          ) : (
            <div className="text-center text-gray-500 mt-20">
              <Layout className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <h3 className="text-lg font-medium mb-2">Selecione uma seção para editar</h3>
              <p>Escolha uma seção na barra lateral para começar a editar</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VisualEditor;

