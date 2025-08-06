import React, { useState, useEffect } from 'react';
import { 
  Save, 
  Eye, 
  Edit3, 
  Plus, 
  Trash2, 
  Image, 
  Type, 
  Layout, 
  Palette,
  Settings,
  FileText,
  Star,
  Users,
  BarChart3,
  Undo,
  Redo,
  Check,
  X,
  Upload,
  Link,
  Bold,
  Italic,
  AlignLeft,
  AlignCenter,
  AlignRight
} from 'lucide-react';

const WordPressCMS = () => {
  // Estados principais
  const [activeSection, setActiveSection] = useState('hero');
  const [isEditing, setIsEditing] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [autoSave, setAutoSave] = useState(true);
  const [previewMode, setPreviewMode] = useState(false);
  
  // Estados de conteúdo
  const [siteContent, setSiteContent] = useState({
    hero: {
      title: 'Dr. Rodrigo Sguario',
      subtitle: 'Cardiologista Especialista em Transplante Cardíaco',
      description: 'Cuidando do seu coração com excelência e dedicação há mais de 15 anos',
      buttonText: 'Agendar Consulta',
      buttonLink: '#contato',
      backgroundImage: '/images/hero-bg.jpg',
      achievements: [
        { number: '15+', label: 'Anos de Experiência' },
        { number: '500+', label: 'Transplantes Realizados' },
        { number: '98%', label: 'Taxa de Sucesso' }
      ]
    },
    about: {
      title: 'Sobre o Dr. Rodrigo',
      subtitle: 'Especialista em Cardiologia',
      description: 'Dr. Rodrigo Sguario é um cardiologista renomado, especializado em transplante cardíaco com mais de 15 anos de experiência. Formado pela USP, possui especialização em Harvard e é membro da Sociedade Brasileira de Cardiologia.',
      image: '/images/dr-rodrigo.jpg',
      specialties: [
        'Transplante Cardíaco',
        'Cardiologia Clínica',
        'Ecocardiografia',
        'Cateterismo Cardíaco',
        'Cirurgia Cardíaca'
      ],
      education: [
        'Medicina - USP (2005)',
        'Residência em Cardiologia - InCor (2008)',
        'Fellowship em Harvard (2010)',
        'Doutorado em Cardiologia - USP (2012)'
      ]
    },
    services: {
      title: 'Serviços Oferecidos',
      subtitle: 'Cuidado completo para seu coração',
      services: [
        {
          name: 'Transplante Cardíaco',
          description: 'Procedimento cirúrgico para substituição do coração',
          icon: 'heart',
          price: 'Consulte'
        },
        {
          name: 'Consulta Cardiológica',
          description: 'Avaliação completa da saúde cardiovascular',
          icon: 'stethoscope',
          price: 'R$ 350'
        },
        {
          name: 'Ecocardiograma',
          description: 'Exame de imagem do coração',
          icon: 'activity',
          price: 'R$ 200'
        },
        {
          name: 'Cateterismo',
          description: 'Procedimento diagnóstico e terapêutico',
          icon: 'zap',
          price: 'R$ 1.500'
        }
      ]
    },
    contact: {
      title: 'Entre em Contato',
      subtitle: 'Agende sua consulta',
      phone: '(11) 99999-9999',
      email: 'contato@drrodrigosguario.com.br',
      address: 'Av. Paulista, 1000 - São Paulo, SP',
      hours: 'Segunda a Sexta: 8h às 18h',
      whatsapp: '5511999999999',
      socialMedia: {
        instagram: '@drrodrigosguario',
        facebook: 'Dr. Rodrigo Sguario',
        linkedin: 'rodrigo-sguario'
      }
    }
  });

  // Estados de tema
  const [theme, setTheme] = useState({
    primaryColor: '#dc2626',
    secondaryColor: '#1f2937',
    accentColor: '#f59e0b',
    backgroundColor: '#ffffff',
    textColor: '#1f2937',
    fontFamily: 'Inter, sans-serif',
    borderRadius: '8px'
  });

  // Auto-save
  useEffect(() => {
    if (hasChanges && autoSave) {
      const timer = setTimeout(() => {
        handleSave();
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [siteContent, hasChanges, autoSave]);

  // Carregar dados salvos
  useEffect(() => {
    const savedContent = localStorage.getItem('wordpress_cms_content');
    const savedTheme = localStorage.getItem('wordpress_cms_theme');
    
    if (savedContent) {
      setSiteContent(JSON.parse(savedContent));
    }
    if (savedTheme) {
      setTheme(JSON.parse(savedTheme));
    }
  }, []);

  // Funções de salvamento
  const handleSave = async () => {
    try {
      // Salva no localStorage (fallback)
      localStorage.setItem('wordpress_cms_content', JSON.stringify(siteContent));
      localStorage.setItem('wordpress_cms_theme', JSON.stringify(theme));
      
      // Tenta salvar na API
      try {
        const response = await fetch('/api/site/save', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ content: siteContent, theme })
        });
        
        if (response.ok) {
          console.log('✅ Salvo na API com sucesso');
        }
      } catch (apiError) {
        console.log('⚠️ API indisponível, usando localStorage');
      }
      
      setHasChanges(false);
      showNotification('✅ Alterações salvas com sucesso!', 'success');
    } catch (error) {
      console.error('Erro ao salvar:', error);
      showNotification('❌ Erro ao salvar alterações', 'error');
    }
  };

  // Função para mostrar notificações
  const showNotification = (message, type) => {
    // Implementação simples de notificação
    const notification = document.createElement('div');
    notification.className = `fixed top-4 right-4 p-4 rounded-lg text-white z-50 ${
      type === 'success' ? 'bg-green-500' : 'bg-red-500'
    }`;
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
      document.body.removeChild(notification);
    }, 3000);
  };

  // Função para atualizar conteúdo
  const updateContent = (section, field, value) => {
    setSiteContent(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
    setHasChanges(true);
  };

  // Função para atualizar array (achievements, specialties, etc.)
  const updateArray = (section, field, index, value) => {
    setSiteContent(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: prev[section][field].map((item, i) => 
          i === index ? value : item
        )
      }
    }));
    setHasChanges(true);
  };

  // Função para adicionar item ao array
  const addArrayItem = (section, field, newItem) => {
    setSiteContent(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: [...prev[section][field], newItem]
      }
    }));
    setHasChanges(true);
  };

  // Função para remover item do array
  const removeArrayItem = (section, field, index) => {
    setSiteContent(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: prev[section][field].filter((_, i) => i !== index)
      }
    }));
    setHasChanges(true);
  };

  // Componente de campo editável
  const EditableField = ({ value, onChange, type = 'text', placeholder, className = '' }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [tempValue, setTempValue] = useState(value);

    const handleSave = () => {
      onChange(tempValue);
      setIsEditing(false);
    };

    const handleCancel = () => {
      setTempValue(value);
      setIsEditing(false);
    };

    if (isEditing) {
      return (
        <div className="relative group">
          {type === 'textarea' ? (
            <textarea
              value={tempValue}
              onChange={(e) => setTempValue(e.target.value)}
              className={`w-full p-2 border border-blue-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 ${className}`}
              placeholder={placeholder}
              rows={4}
              autoFocus
            />
          ) : (
            <input
              type={type}
              value={tempValue}
              onChange={(e) => setTempValue(e.target.value)}
              className={`w-full p-2 border border-blue-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 ${className}`}
              placeholder={placeholder}
              autoFocus
            />
          )}
          <div className="flex gap-2 mt-2">
            <button
              onClick={handleSave}
              className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 flex items-center gap-1"
            >
              <Check size={14} /> Salvar
            </button>
            <button
              onClick={handleCancel}
              className="px-3 py-1 bg-gray-500 text-white rounded hover:bg-gray-600 flex items-center gap-1"
            >
              <X size={14} /> Cancelar
            </button>
          </div>
        </div>
      );
    }

    return (
      <div
        onClick={() => setIsEditing(true)}
        className={`cursor-pointer hover:bg-blue-50 hover:border-blue-300 border border-transparent rounded p-2 transition-all ${className}`}
        title="Clique para editar"
      >
        {value || <span className="text-gray-400">{placeholder}</span>}
        <Edit3 size={14} className="inline ml-2 opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>
    );
  };

  // Seções disponíveis
  const sections = [
    { id: 'hero', name: 'Seção Principal', icon: Layout },
    { id: 'about', name: 'Sobre o Médico', icon: Users },
    { id: 'services', name: 'Serviços', icon: FileText },
    { id: 'contact', name: 'Contato', icon: Settings }
  ];

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar WordPress-like */}
      <div className="w-64 bg-white shadow-lg border-r">
        <div className="p-4 border-b">
          <h1 className="text-xl font-bold text-gray-800">WordPress CMS</h1>
          <p className="text-sm text-gray-600">Dr. Rodrigo Sguario</p>
        </div>

        {/* Menu de seções */}
        <div className="p-4">
          <h3 className="text-sm font-semibold text-gray-500 uppercase mb-3">Editar Conteúdo</h3>
          {sections.map(section => (
            <button
              key={section.id}
              onClick={() => setActiveSection(section.id)}
              className={`w-full flex items-center gap-3 p-3 rounded-lg mb-2 transition-all ${
                activeSection === section.id
                  ? 'bg-blue-500 text-white'
                  : 'hover:bg-gray-100 text-gray-700'
              }`}
            >
              <section.icon size={18} />
              {section.name}
            </button>
          ))}
        </div>

        {/* Controles */}
        <div className="p-4 border-t mt-auto">
          <div className="flex gap-2 mb-3">
            <button
              onClick={handleSave}
              disabled={!hasChanges}
              className={`flex-1 flex items-center justify-center gap-2 p-2 rounded ${
                hasChanges
                  ? 'bg-green-500 text-white hover:bg-green-600'
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }`}
            >
              <Save size={16} />
              Salvar
            </button>
            <button
              onClick={() => setPreviewMode(!previewMode)}
              className="flex-1 flex items-center justify-center gap-2 p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              <Eye size={16} />
              Preview
            </button>
          </div>
          
          <label className="flex items-center gap-2 text-sm text-gray-600">
            <input
              type="checkbox"
              checked={autoSave}
              onChange={(e) => setAutoSave(e.target.checked)}
              className="rounded"
            />
            Auto-salvar
          </label>
          
          {hasChanges && (
            <div className="mt-2 text-xs text-orange-600 flex items-center gap-1">
              <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></div>
              Alterações não salvas
            </div>
          )}
        </div>
      </div>

      {/* Área de edição principal */}
      <div className="flex-1 overflow-auto">
        {/* Header */}
        <div className="bg-white border-b p-4 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-gray-800">
              {sections.find(s => s.id === activeSection)?.name}
            </h2>
            <p className="text-sm text-gray-600">
              Clique em qualquer texto para editar
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full ${hasChanges ? 'bg-orange-500' : 'bg-green-500'}`}></div>
              <span className="text-sm text-gray-600">
                {hasChanges ? 'Não salvo' : 'Salvo'}
              </span>
            </div>
          </div>
        </div>

        {/* Conteúdo editável */}
        <div className="p-6">
          {activeSection === 'hero' && (
            <div className="space-y-6">
              <div className="bg-white p-6 rounded-lg shadow-sm border">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Type size={20} />
                  Textos Principais
                </h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Título Principal
                    </label>
                    <EditableField
                      value={siteContent.hero.title}
                      onChange={(value) => updateContent('hero', 'title', value)}
                      placeholder="Digite o título principal"
                      className="text-2xl font-bold"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Subtítulo
                    </label>
                    <EditableField
                      value={siteContent.hero.subtitle}
                      onChange={(value) => updateContent('hero', 'subtitle', value)}
                      placeholder="Digite o subtítulo"
                      className="text-lg"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Descrição
                    </label>
                    <EditableField
                      value={siteContent.hero.description}
                      onChange={(value) => updateContent('hero', 'description', value)}
                      type="textarea"
                      placeholder="Digite a descrição"
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Texto do Botão
                      </label>
                      <EditableField
                        value={siteContent.hero.buttonText}
                        onChange={(value) => updateContent('hero', 'buttonText', value)}
                        placeholder="Texto do botão"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Link do Botão
                      </label>
                      <EditableField
                        value={siteContent.hero.buttonLink}
                        onChange={(value) => updateContent('hero', 'buttonLink', value)}
                        placeholder="Link do botão"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Estatísticas */}
              <div className="bg-white p-6 rounded-lg shadow-sm border">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <BarChart3 size={20} />
                  Estatísticas
                </h3>
                
                <div className="space-y-4">
                  {siteContent.hero.achievements.map((achievement, index) => (
                    <div key={index} className="flex items-center gap-4 p-3 border rounded">
                      <div className="flex-1 grid grid-cols-2 gap-4">
                        <EditableField
                          value={achievement.number}
                          onChange={(value) => updateArray('hero', 'achievements', index, { ...achievement, number: value })}
                          placeholder="Número"
                        />
                        <EditableField
                          value={achievement.label}
                          onChange={(value) => updateArray('hero', 'achievements', index, { ...achievement, label: value })}
                          placeholder="Descrição"
                        />
                      </div>
                      <button
                        onClick={() => removeArrayItem('hero', 'achievements', index)}
                        className="p-2 text-red-500 hover:bg-red-50 rounded"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))}
                  
                  <button
                    onClick={() => addArrayItem('hero', 'achievements', { number: '', label: '' })}
                    className="w-full p-3 border-2 border-dashed border-gray-300 rounded hover:border-blue-500 hover:bg-blue-50 flex items-center justify-center gap-2 text-gray-600"
                  >
                    <Plus size={16} />
                    Adicionar Estatística
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeSection === 'about' && (
            <div className="space-y-6">
              <div className="bg-white p-6 rounded-lg shadow-sm border">
                <h3 className="text-lg font-semibold mb-4">Informações Básicas</h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Título</label>
                    <EditableField
                      value={siteContent.about.title}
                      onChange={(value) => updateContent('about', 'title', value)}
                      placeholder="Título da seção"
                      className="text-xl font-semibold"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Subtítulo</label>
                    <EditableField
                      value={siteContent.about.subtitle}
                      onChange={(value) => updateContent('about', 'subtitle', value)}
                      placeholder="Subtítulo"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Descrição</label>
                    <EditableField
                      value={siteContent.about.description}
                      onChange={(value) => updateContent('about', 'description', value)}
                      type="textarea"
                      placeholder="Descrição completa"
                    />
                  </div>
                </div>
              </div>

              {/* Especialidades */}
              <div className="bg-white p-6 rounded-lg shadow-sm border">
                <h3 className="text-lg font-semibold mb-4">Especialidades</h3>
                
                <div className="space-y-3">
                  {siteContent.about.specialties.map((specialty, index) => (
                    <div key={index} className="flex items-center gap-3 p-2 border rounded">
                      <EditableField
                        value={specialty}
                        onChange={(value) => updateArray('about', 'specialties', index, value)}
                        placeholder="Nome da especialidade"
                        className="flex-1"
                      />
                      <button
                        onClick={() => removeArrayItem('about', 'specialties', index)}
                        className="p-2 text-red-500 hover:bg-red-50 rounded"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))}
                  
                  <button
                    onClick={() => addArrayItem('about', 'specialties', '')}
                    className="w-full p-3 border-2 border-dashed border-gray-300 rounded hover:border-blue-500 hover:bg-blue-50 flex items-center justify-center gap-2 text-gray-600"
                  >
                    <Plus size={16} />
                    Adicionar Especialidade
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeSection === 'services' && (
            <div className="space-y-6">
              <div className="bg-white p-6 rounded-lg shadow-sm border">
                <h3 className="text-lg font-semibold mb-4">Informações da Seção</h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Título</label>
                    <EditableField
                      value={siteContent.services.title}
                      onChange={(value) => updateContent('services', 'title', value)}
                      placeholder="Título da seção"
                      className="text-xl font-semibold"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Subtítulo</label>
                    <EditableField
                      value={siteContent.services.subtitle}
                      onChange={(value) => updateContent('services', 'subtitle', value)}
                      placeholder="Subtítulo"
                    />
                  </div>
                </div>
              </div>

              {/* Lista de serviços */}
              <div className="bg-white p-6 rounded-lg shadow-sm border">
                <h3 className="text-lg font-semibold mb-4">Serviços</h3>
                
                <div className="space-y-4">
                  {siteContent.services.services.map((service, index) => (
                    <div key={index} className="p-4 border rounded-lg">
                      <div className="grid grid-cols-2 gap-4 mb-3">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Nome do Serviço</label>
                          <EditableField
                            value={service.name}
                            onChange={(value) => updateArray('services', 'services', index, { ...service, name: value })}
                            placeholder="Nome do serviço"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Preço</label>
                          <EditableField
                            value={service.price}
                            onChange={(value) => updateArray('services', 'services', index, { ...service, price: value })}
                            placeholder="Preço"
                          />
                        </div>
                      </div>
                      
                      <div className="mb-3">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Descrição</label>
                        <EditableField
                          value={service.description}
                          onChange={(value) => updateArray('services', 'services', index, { ...service, description: value })}
                          type="textarea"
                          placeholder="Descrição do serviço"
                        />
                      </div>
                      
                      <button
                        onClick={() => removeArrayItem('services', 'services', index)}
                        className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 flex items-center gap-1"
                      >
                        <Trash2 size={14} />
                        Remover Serviço
                      </button>
                    </div>
                  ))}
                  
                  <button
                    onClick={() => addArrayItem('services', 'services', {
                      name: '',
                      description: '',
                      icon: 'heart',
                      price: ''
                    })}
                    className="w-full p-4 border-2 border-dashed border-gray-300 rounded hover:border-blue-500 hover:bg-blue-50 flex items-center justify-center gap-2 text-gray-600"
                  >
                    <Plus size={16} />
                    Adicionar Serviço
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeSection === 'contact' && (
            <div className="space-y-6">
              <div className="bg-white p-6 rounded-lg shadow-sm border">
                <h3 className="text-lg font-semibold mb-4">Informações de Contato</h3>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Título</label>
                    <EditableField
                      value={siteContent.contact.title}
                      onChange={(value) => updateContent('contact', 'title', value)}
                      placeholder="Título da seção"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Subtítulo</label>
                    <EditableField
                      value={siteContent.contact.subtitle}
                      onChange={(value) => updateContent('contact', 'subtitle', value)}
                      placeholder="Subtítulo"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Telefone</label>
                    <EditableField
                      value={siteContent.contact.phone}
                      onChange={(value) => updateContent('contact', 'phone', value)}
                      placeholder="Telefone"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                    <EditableField
                      value={siteContent.contact.email}
                      onChange={(value) => updateContent('contact', 'email', value)}
                      placeholder="Email"
                      type="email"
                    />
                  </div>
                  
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Endereço</label>
                    <EditableField
                      value={siteContent.contact.address}
                      onChange={(value) => updateContent('contact', 'address', value)}
                      placeholder="Endereço completo"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Horário de Funcionamento</label>
                    <EditableField
                      value={siteContent.contact.hours}
                      onChange={(value) => updateContent('contact', 'hours', value)}
                      placeholder="Horários"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">WhatsApp</label>
                    <EditableField
                      value={siteContent.contact.whatsapp}
                      onChange={(value) => updateContent('contact', 'whatsapp', value)}
                      placeholder="Número do WhatsApp"
                    />
                  </div>
                </div>
              </div>

              {/* Redes sociais */}
              <div className="bg-white p-6 rounded-lg shadow-sm border">
                <h3 className="text-lg font-semibold mb-4">Redes Sociais</h3>
                
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Instagram</label>
                    <EditableField
                      value={siteContent.contact.socialMedia.instagram}
                      onChange={(value) => updateContent('contact', 'socialMedia', { 
                        ...siteContent.contact.socialMedia, 
                        instagram: value 
                      })}
                      placeholder="@usuario"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Facebook</label>
                    <EditableField
                      value={siteContent.contact.socialMedia.facebook}
                      onChange={(value) => updateContent('contact', 'socialMedia', { 
                        ...siteContent.contact.socialMedia, 
                        facebook: value 
                      })}
                      placeholder="Nome da página"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">LinkedIn</label>
                    <EditableField
                      value={siteContent.contact.socialMedia.linkedin}
                      onChange={(value) => updateContent('contact', 'socialMedia', { 
                        ...siteContent.contact.socialMedia, 
                        linkedin: value 
                      })}
                      placeholder="nome-usuario"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default WordPressCMS;

