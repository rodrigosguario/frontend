import React, { useState, useEffect } from 'react';
import { 
  Settings, 
  MessageCircle, 
  Palette, 
  FileText, 
  Save, 
  RefreshCw,
  Phone,
  MapPin,
  Clock,
  Eye,
  EyeOff
} from 'lucide-react';

const AdminSettings = () => {
  const [activeTab, setActiveTab] = useState('whatsapp');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  // Estados para diferentes configurações
  const [whatsappConfig, setWhatsappConfig] = useState({
    phone_number: '',
    welcome_message: '',
    transplant_message: '',
    heart_failure_message: '',
    preventive_message: '',
    echo_message: '',
    widget_enabled: true,
    widget_position: 'bottom-right',
    widget_color: '#25D366'
  });

  const [generalSettings, setGeneralSettings] = useState({
    site_title: 'Dr. Rodrigo Sguario - Cardiologista',
    site_description: 'Especialista em Transplante Cardíaco e Insuficiência Cardíaca Avançada',
    doctor_name: 'Dr. Rodrigo Sguario',
    specialty: 'Cardiologista',
    phone: '(11) 3382-1515',
    email: 'rodrigomrsguario.cardiologia@gmail.com',
    address: 'Av. Paulista, 1048, 18º andar - Bela Vista, São Paulo - SP',
    working_hours: {
      monday: '08:00-18:00',
      tuesday: '08:00-18:00',
      wednesday: '08:00-18:00',
      thursday: '08:00-18:00',
      friday: '08:00-18:00',
      saturday: '08:00-12:00',
      sunday: 'Fechado'
    }
  });

  const [colorThemes, setColorThemes] = useState([]);
  const [activeTheme, setActiveTheme] = useState(null);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    setLoading(true);
    try {
      // Carregar configurações do WhatsApp
      const whatsappRes = await fetch('/api/settings/whatsapp');
      if (whatsappRes.ok) {
        const whatsappData = await whatsappRes.json();
        setWhatsappConfig(whatsappData);
      }

      // Carregar configurações gerais
      const generalRes = await fetch('/api/settings/general');
      if (generalRes.ok) {
        const generalData = await generalRes.json();
        setGeneralSettings(prev => ({ ...prev, ...generalData }));
      }

      // Carregar temas de cores
      const colorsRes = await fetch('/api/settings/colors');
      if (colorsRes.ok) {
        const colorsData = await colorsRes.json();
        setColorThemes(colorsData.themes || []);
        setActiveTheme(colorsData.active_theme);
      }
    } catch (error) {
      console.error('Erro ao carregar configurações:', error);
      setMessage('Erro ao carregar configurações');
    } finally {
      setLoading(false);
    }
  };

  const saveWhatsAppSettings = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/settings/whatsapp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(whatsappConfig),
        credentials: 'include'
      });

      if (response.ok) {
        setMessage('Configurações do WhatsApp salvas com sucesso!');
        setTimeout(() => setMessage(''), 3000);
      } else {
        throw new Error('Erro ao salvar configurações');
      }
    } catch (error) {
      console.error('Erro:', error);
      setMessage('Erro ao salvar configurações do WhatsApp');
    } finally {
      setLoading(false);
    }
  };

  const saveGeneralSettings = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/settings/general', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(generalSettings),
        credentials: 'include'
      });

      if (response.ok) {
        setMessage('Configurações gerais salvas com sucesso!');
        setTimeout(() => setMessage(''), 3000);
      } else {
        throw new Error('Erro ao salvar configurações');
      }
    } catch (error) {
      console.error('Erro:', error);
      setMessage('Erro ao salvar configurações gerais');
    } finally {
      setLoading(false);
    }
  };

  const createColorTheme = async (themeData) => {
    setLoading(true);
    try {
      const response = await fetch('/api/settings/colors', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(themeData),
        credentials: 'include'
      });

      if (response.ok) {
        const result = await response.json();
        setColorThemes(prev => [...prev, result.theme]);
        setMessage('Tema criado com sucesso!');
        setTimeout(() => setMessage(''), 3000);
      } else {
        throw new Error('Erro ao criar tema');
      }
    } catch (error) {
      console.error('Erro:', error);
      setMessage('Erro ao criar tema');
    } finally {
      setLoading(false);
    }
  };

  const activateTheme = async (themeId) => {
    setLoading(true);
    try {
      const response = await fetch('/api/settings/colors', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ activate_theme_id: themeId }),
        credentials: 'include'
      });

      if (response.ok) {
        const result = await response.json();
        setActiveTheme(result.active_theme);
        setMessage('Tema ativado com sucesso!');
        setTimeout(() => setMessage(''), 3000);
      } else {
        throw new Error('Erro ao ativar tema');
      }
    } catch (error) {
      console.error('Erro:', error);
      setMessage('Erro ao ativar tema');
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: 'whatsapp', label: 'WhatsApp', icon: MessageCircle },
    { id: 'general', label: 'Geral', icon: Settings },
    { id: 'colors', label: 'Cores', icon: Palette },
    { id: 'content', label: 'Conteúdo', icon: FileText }
  ];

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">
          Configurações do Site
        </h1>
        <p className="text-muted-foreground">
          Gerencie todas as configurações do seu site em um só lugar
        </p>
      </div>

      {message && (
        <div className="mb-6 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg">
          {message}
        </div>
      )}

      {/* Tabs */}
      <div className="flex space-x-1 mb-8 bg-muted p-1 rounded-lg">
        {tabs.map((tab) => {
          const IconComponent = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-md transition-colors ${
                activeTab === tab.id
                  ? 'bg-background text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <IconComponent className="w-4 h-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* WhatsApp Settings */}
      {activeTab === 'whatsapp' && (
        <div className="space-y-6">
          <div className="bg-card rounded-lg p-6 border border-border">
            <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <MessageCircle className="w-5 h-5" />
              Configurações do WhatsApp
            </h3>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Número do WhatsApp
                </label>
                <input
                  type="text"
                  value={whatsappConfig.phone_number}
                  onChange={(e) => setWhatsappConfig(prev => ({
                    ...prev,
                    phone_number: e.target.value
                  }))}
                  placeholder="5511999999999"
                  className="w-full p-3 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Formato: código do país + DDD + número (sem espaços)
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Posição do Widget
                </label>
                <select
                  value={whatsappConfig.widget_position}
                  onChange={(e) => setWhatsappConfig(prev => ({
                    ...prev,
                    widget_position: e.target.value
                  }))}
                  className="w-full p-3 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                >
                  <option value="bottom-right">Inferior Direita</option>
                  <option value="bottom-left">Inferior Esquerda</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Cor do Widget
                </label>
                <div className="flex gap-2">
                  <input
                    type="color"
                    value={whatsappConfig.widget_color}
                    onChange={(e) => setWhatsappConfig(prev => ({
                      ...prev,
                      widget_color: e.target.value
                    }))}
                    className="w-12 h-12 border border-border rounded-lg cursor-pointer"
                  />
                  <input
                    type="text"
                    value={whatsappConfig.widget_color}
                    onChange={(e) => setWhatsappConfig(prev => ({
                      ...prev,
                      widget_color: e.target.value
                    }))}
                    className="flex-1 p-3 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={whatsappConfig.widget_enabled}
                    onChange={(e) => setWhatsappConfig(prev => ({
                      ...prev,
                      widget_enabled: e.target.checked
                    }))}
                    className="w-4 h-4 text-primary"
                  />
                  <span className="text-sm font-medium">Widget Ativo</span>
                </label>
              </div>
            </div>

            <div className="mt-6">
              <h4 className="text-lg font-semibold mb-4">Mensagens Personalizadas</h4>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Mensagem de Boas-vindas
                  </label>
                  <textarea
                    value={whatsappConfig.welcome_message}
                    onChange={(e) => setWhatsappConfig(prev => ({
                      ...prev,
                      welcome_message: e.target.value
                    }))}
                    rows={3}
                    className="w-full p-3 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Mensagem - Transplante Cardíaco
                  </label>
                  <textarea
                    value={whatsappConfig.transplant_message}
                    onChange={(e) => setWhatsappConfig(prev => ({
                      ...prev,
                      transplant_message: e.target.value
                    }))}
                    rows={3}
                    className="w-full p-3 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Mensagem - Insuficiência Cardíaca
                  </label>
                  <textarea
                    value={whatsappConfig.heart_failure_message}
                    onChange={(e) => setWhatsappConfig(prev => ({
                      ...prev,
                      heart_failure_message: e.target.value
                    }))}
                    rows={3}
                    className="w-full p-3 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Mensagem - Cardiologia Preventiva
                  </label>
                  <textarea
                    value={whatsappConfig.preventive_message}
                    onChange={(e) => setWhatsappConfig(prev => ({
                      ...prev,
                      preventive_message: e.target.value
                    }))}
                    rows={3}
                    className="w-full p-3 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Mensagem - Ecocardiografia
                  </label>
                  <textarea
                    value={whatsappConfig.echo_message}
                    onChange={(e) => setWhatsappConfig(prev => ({
                      ...prev,
                      echo_message: e.target.value
                    }))}
                    rows={3}
                    className="w-full p-3 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={saveWhatsAppSettings}
                disabled={loading}
                className="flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 disabled:opacity-50"
              >
                {loading ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <Save className="w-4 h-4" />
                )}
                Salvar Configurações
              </button>
            </div>
          </div>
        </div>
      )}

      {/* General Settings */}
      {activeTab === 'general' && (
        <div className="space-y-6">
          <div className="bg-card rounded-lg p-6 border border-border">
            <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Settings className="w-5 h-5" />
              Configurações Gerais
            </h3>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Título do Site
                </label>
                <input
                  type="text"
                  value={generalSettings.site_title}
                  onChange={(e) => setGeneralSettings(prev => ({
                    ...prev,
                    site_title: e.target.value
                  }))}
                  className="w-full p-3 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Nome do Médico
                </label>
                <input
                  type="text"
                  value={generalSettings.doctor_name}
                  onChange={(e) => setGeneralSettings(prev => ({
                    ...prev,
                    doctor_name: e.target.value
                  }))}
                  className="w-full p-3 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Especialidade
                </label>
                <input
                  type="text"
                  value={generalSettings.specialty}
                  onChange={(e) => setGeneralSettings(prev => ({
                    ...prev,
                    specialty: e.target.value
                  }))}
                  className="w-full p-3 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  <Phone className="w-4 h-4 inline mr-1" />
                  Telefone
                </label>
                <input
                  type="text"
                  value={generalSettings.phone}
                  onChange={(e) => setGeneralSettings(prev => ({
                    ...prev,
                    phone: e.target.value
                  }))}
                  className="w-full p-3 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-2">
                  Email
                </label>
                <input
                  type="email"
                  value={generalSettings.email}
                  onChange={(e) => setGeneralSettings(prev => ({
                    ...prev,
                    email: e.target.value
                  }))}
                  className="w-full p-3 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-2">
                  <MapPin className="w-4 h-4 inline mr-1" />
                  Endereço
                </label>
                <input
                  type="text"
                  value={generalSettings.address}
                  onChange={(e) => setGeneralSettings(prev => ({
                    ...prev,
                    address: e.target.value
                  }))}
                  className="w-full p-3 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-2">
                  Descrição do Site
                </label>
                <textarea
                  value={generalSettings.site_description}
                  onChange={(e) => setGeneralSettings(prev => ({
                    ...prev,
                    site_description: e.target.value
                  }))}
                  rows={3}
                  className="w-full p-3 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
            </div>

            <div className="mt-6">
              <h4 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Clock className="w-5 h-5" />
                Horários de Funcionamento
              </h4>
              <div className="grid md:grid-cols-2 gap-4">
                {Object.entries(generalSettings.working_hours).map(([day, hours]) => (
                  <div key={day}>
                    <label className="block text-sm font-medium mb-2 capitalize">
                      {day === 'monday' && 'Segunda-feira'}
                      {day === 'tuesday' && 'Terça-feira'}
                      {day === 'wednesday' && 'Quarta-feira'}
                      {day === 'thursday' && 'Quinta-feira'}
                      {day === 'friday' && 'Sexta-feira'}
                      {day === 'saturday' && 'Sábado'}
                      {day === 'sunday' && 'Domingo'}
                    </label>
                    <input
                      type="text"
                      value={hours}
                      onChange={(e) => setGeneralSettings(prev => ({
                        ...prev,
                        working_hours: {
                          ...prev.working_hours,
                          [day]: e.target.value
                        }
                      }))}
                      placeholder="08:00-18:00 ou Fechado"
                      className="w-full p-3 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={saveGeneralSettings}
                disabled={loading}
                className="flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 disabled:opacity-50"
              >
                {loading ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <Save className="w-4 h-4" />
                )}
                Salvar Configurações
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Color Themes */}
      {activeTab === 'colors' && (
        <div className="space-y-6">
          <div className="bg-card rounded-lg p-6 border border-border">
            <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Palette className="w-5 h-5" />
              Temas de Cores
            </h3>

            {/* Tema Ativo */}
            {activeTheme && (
              <div className="mb-6 p-4 bg-muted rounded-lg">
                <h4 className="font-semibold mb-2">Tema Ativo: {activeTheme.theme_name}</h4>
                <div className="flex gap-2">
                  <div 
                    className="w-8 h-8 rounded border"
                    style={{ backgroundColor: activeTheme.primary_color }}
                    title="Cor Primária"
                  ></div>
                  <div 
                    className="w-8 h-8 rounded border"
                    style={{ backgroundColor: activeTheme.secondary_color }}
                    title="Cor Secundária"
                  ></div>
                  <div 
                    className="w-8 h-8 rounded border"
                    style={{ backgroundColor: activeTheme.accent_color }}
                    title="Cor de Destaque"
                  ></div>
                </div>
              </div>
            )}

            {/* Lista de Temas */}
            <div className="grid md:grid-cols-2 gap-4">
              {colorThemes.map((theme) => (
                <div 
                  key={theme.id}
                  className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                    theme.is_active ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'
                  }`}
                  onClick={() => activateTheme(theme.id)}
                >
                  <div className="flex items-center justify-between mb-2">
                    <h5 className="font-semibold">{theme.theme_name}</h5>
                    {theme.is_active && (
                      <span className="text-xs bg-primary text-primary-foreground px-2 py-1 rounded">
                        Ativo
                      </span>
                    )}
                  </div>
                  <div className="flex gap-1">
                    <div 
                      className="w-6 h-6 rounded border"
                      style={{ backgroundColor: theme.primary_color }}
                    ></div>
                    <div 
                      className="w-6 h-6 rounded border"
                      style={{ backgroundColor: theme.secondary_color }}
                    ></div>
                    <div 
                      className="w-6 h-6 rounded border"
                      style={{ backgroundColor: theme.accent_color }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>

            {/* Criar Novo Tema */}
            <div className="mt-6 p-4 border border-dashed border-border rounded-lg">
              <h4 className="font-semibold mb-4">Criar Novo Tema</h4>
              <NewThemeForm onSubmit={createColorTheme} loading={loading} />
            </div>
          </div>
        </div>
      )}

      {/* Content Management */}
      {activeTab === 'content' && (
        <div className="space-y-6">
          <div className="bg-card rounded-lg p-6 border border-border">
            <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Gerenciamento de Conteúdo
            </h3>
            <p className="text-muted-foreground">
              Em breve: Editor de conteúdo das páginas
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

// Componente para criar novo tema
const NewThemeForm = ({ onSubmit, loading }) => {
  const [newTheme, setNewTheme] = useState({
    theme_name: '',
    primary_color: '#1e293b',
    secondary_color: '#64748b',
    accent_color: '#d4af37',
    background_color: '#ffffff',
    text_color: '#1e293b',
    is_active: false
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (newTheme.theme_name.trim()) {
      onSubmit(newTheme);
      setNewTheme({
        theme_name: '',
        primary_color: '#1e293b',
        secondary_color: '#64748b',
        accent_color: '#d4af37',
        background_color: '#ffffff',
        text_color: '#1e293b',
        is_active: false
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-2">
          Nome do Tema
        </label>
        <input
          type="text"
          value={newTheme.theme_name}
          onChange={(e) => setNewTheme(prev => ({
            ...prev,
            theme_name: e.target.value
          }))}
          placeholder="Ex: Tema Escuro Profissional"
          className="w-full p-3 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
          required
        />
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2">
            Cor Primária
          </label>
          <input
            type="color"
            value={newTheme.primary_color}
            onChange={(e) => setNewTheme(prev => ({
              ...prev,
              primary_color: e.target.value
            }))}
            className="w-full h-12 border border-border rounded-lg cursor-pointer"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            Cor Secundária
          </label>
          <input
            type="color"
            value={newTheme.secondary_color}
            onChange={(e) => setNewTheme(prev => ({
              ...prev,
              secondary_color: e.target.value
            }))}
            className="w-full h-12 border border-border rounded-lg cursor-pointer"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            Cor de Destaque
          </label>
          <input
            type="color"
            value={newTheme.accent_color}
            onChange={(e) => setNewTheme(prev => ({
              ...prev,
              accent_color: e.target.value
            }))}
            className="w-full h-12 border border-border rounded-lg cursor-pointer"
          />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={newTheme.is_active}
            onChange={(e) => setNewTheme(prev => ({
              ...prev,
              is_active: e.target.checked
            }))}
            className="w-4 h-4 text-primary"
          />
          <span className="text-sm">Ativar este tema</span>
        </label>

        <button
          type="submit"
          disabled={loading || !newTheme.theme_name.trim()}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 disabled:opacity-50"
        >
          {loading ? (
            <RefreshCw className="w-4 h-4 animate-spin" />
          ) : (
            <Save className="w-4 h-4" />
          )}
          Criar Tema
        </button>
      </div>
    </form>
  );
};

export default AdminSettings;

