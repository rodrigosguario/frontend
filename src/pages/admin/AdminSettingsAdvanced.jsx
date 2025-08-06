import React, { useState, useEffect } from 'react';
import { 
  Save, 
  RefreshCw, 
  User, 
  Building, 
  Share2, 
  Palette,
  Settings,
  Phone,
  Mail,
  MapPin,
  Clock,
  Instagram,
  Facebook,
  Linkedin
} from 'lucide-react';
import { settingsAPI } from '@/config/api';

const AdminSettingsAdvanced = () => {
  const [settings, setSettings] = useState({
    doctor_info: {
      name: '',
      specialty: '',
      crm: '',
      phone: '',
      email: ''
    },
    clinic_info: {
      name: '',
      address: '',
      phone: '',
      hours: ''
    },
    social_media: {
      instagram: '',
      facebook: '',
      linkedin: '',
      whatsapp: ''
    },
    site_config: {
      theme_color: '#1e293b',
      accent_color: '#d4af37',
      show_reviews: true,
      auto_import_reviews: false
    }
  });

  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('doctor');

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    setLoading(true);
    try {
      const response = await settingsAPI.getAllSettings();
      const settingsData = response.data || {};
      
      // Organizar dados recebidos
      const organizedSettings = {
        doctor_info: settingsData.doctor_info?.value || settings.doctor_info,
        clinic_info: settingsData.clinic_info?.value || settings.clinic_info,
        social_media: settingsData.social_media?.value || settings.social_media,
        site_config: settingsData.site_config?.value || settings.site_config
      };
      
      setSettings(organizedSettings);
    } catch (error) {
      console.error('Erro ao carregar configurações:', error);
      // Manter configurações padrão se API falhar
    } finally {
      setLoading(false);
    }
  };

  const saveSetting = async (settingKey) => {
    setLoading(true);
    try {
      await settingsAPI.updateSetting(settingKey, settings[settingKey]);
      alert(`Configurações de ${settingKey.replace('_', ' ')} salvas com sucesso!`);
    } catch (error) {
      console.error('Erro ao salvar configuração:', error);
      alert('Erro ao salvar configuração. Verifique sua conexão e tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const updateSetting = (category, field, value) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [field]: value
      }
    }));
  };

  const tabs = [
    { id: 'doctor', name: 'Informações do Médico', icon: User },
    { id: 'clinic', name: 'Informações da Clínica', icon: Building },
    { id: 'social', name: 'Redes Sociais', icon: Share2 },
    { id: 'site', name: 'Configurações do Site', icon: Palette }
  ];

  const renderDoctorInfo = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-800">Informações do Médico</h3>
        <button
          onClick={() => saveSetting('doctor_info')}
          disabled={loading}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2"
        >
          {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          Salvar
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Nome Completo
          </label>
          <input
            type="text"
            value={settings.doctor_info.name}
            onChange={(e) => updateSetting('doctor_info', 'name', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Dr. Nome Sobrenome"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Especialidade
          </label>
          <input
            type="text"
            value={settings.doctor_info.specialty}
            onChange={(e) => updateSetting('doctor_info', 'specialty', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Cardiologista"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            CRM
          </label>
          <input
            type="text"
            value={settings.doctor_info.crm}
            onChange={(e) => updateSetting('doctor_info', 'crm', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="CRM/SP 123456"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Telefone
          </label>
          <input
            type="text"
            value={settings.doctor_info.phone}
            onChange={(e) => updateSetting('doctor_info', 'phone', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="(11) 99999-9999"
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Email
          </label>
          <input
            type="email"
            value={settings.doctor_info.email}
            onChange={(e) => updateSetting('doctor_info', 'email', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="contato@medico.com.br"
          />
        </div>
      </div>
    </div>
  );

  const renderClinicInfo = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-800">Informações da Clínica</h3>
        <button
          onClick={() => saveSetting('clinic_info')}
          disabled={loading}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2"
        >
          {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          Salvar
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Nome da Clínica
          </label>
          <input
            type="text"
            value={settings.clinic_info.name}
            onChange={(e) => updateSetting('clinic_info', 'name', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Clínica Cardiológica"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Telefone da Clínica
          </label>
          <input
            type="text"
            value={settings.clinic_info.phone}
            onChange={(e) => updateSetting('clinic_info', 'phone', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="(11) 3333-4444"
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Endereço Completo
          </label>
          <textarea
            value={settings.clinic_info.address}
            onChange={(e) => updateSetting('clinic_info', 'address', e.target.value)}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Rua, número, bairro, cidade, estado, CEP"
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Horário de Funcionamento
          </label>
          <input
            type="text"
            value={settings.clinic_info.hours}
            onChange={(e) => updateSetting('clinic_info', 'hours', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Segunda a Sexta: 8h às 18h"
          />
        </div>
      </div>
    </div>
  );

  const renderSocialMedia = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-800">Redes Sociais</h3>
        <button
          onClick={() => saveSetting('social_media')}
          disabled={loading}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2"
        >
          {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          Salvar
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
            <Instagram className="w-4 h-4" />
            Instagram
          </label>
          <input
            type="text"
            value={settings.social_media.instagram}
            onChange={(e) => updateSetting('social_media', 'instagram', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="https://instagram.com/usuario"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
            <Facebook className="w-4 h-4" />
            Facebook
          </label>
          <input
            type="text"
            value={settings.social_media.facebook}
            onChange={(e) => updateSetting('social_media', 'facebook', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="https://facebook.com/usuario"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
            <Linkedin className="w-4 h-4" />
            LinkedIn
          </label>
          <input
            type="text"
            value={settings.social_media.linkedin}
            onChange={(e) => updateSetting('social_media', 'linkedin', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="https://linkedin.com/in/usuario"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
            <Phone className="w-4 h-4" />
            WhatsApp
          </label>
          <input
            type="text"
            value={settings.social_media.whatsapp}
            onChange={(e) => updateSetting('social_media', 'whatsapp', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="(11) 99999-9999"
          />
        </div>
      </div>
    </div>
  );

  const renderSiteConfig = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-800">Configurações do Site</h3>
        <button
          onClick={() => saveSetting('site_config')}
          disabled={loading}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2"
        >
          {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          Salvar
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Cor Principal do Tema
          </label>
          <div className="flex gap-2">
            <input
              type="color"
              value={settings.site_config.theme_color}
              onChange={(e) => updateSetting('site_config', 'theme_color', e.target.value)}
              className="w-16 h-10 border border-gray-300 rounded-md"
            />
            <input
              type="text"
              value={settings.site_config.theme_color}
              onChange={(e) => updateSetting('site_config', 'theme_color', e.target.value)}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="#1e293b"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Cor de Destaque
          </label>
          <div className="flex gap-2">
            <input
              type="color"
              value={settings.site_config.accent_color}
              onChange={(e) => updateSetting('site_config', 'accent_color', e.target.value)}
              className="w-16 h-10 border border-gray-300 rounded-md"
            />
            <input
              type="text"
              value={settings.site_config.accent_color}
              onChange={(e) => updateSetting('site_config', 'accent_color', e.target.value)}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="#d4af37"
            />
          </div>
        </div>

        <div className="md:col-span-2">
          <div className="space-y-4">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="show_reviews"
                checked={settings.site_config.show_reviews}
                onChange={(e) => updateSetting('site_config', 'show_reviews', e.target.checked)}
                className="mr-2"
              />
              <label htmlFor="show_reviews" className="text-sm font-medium text-gray-700">
                Exibir avaliações no site
              </label>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="auto_import_reviews"
                checked={settings.site_config.auto_import_reviews}
                onChange={(e) => updateSetting('site_config', 'auto_import_reviews', e.target.checked)}
                className="mr-2"
              />
              <label htmlFor="auto_import_reviews" className="text-sm font-medium text-gray-700">
                Importar avaliações automaticamente
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="p-6">
      <div className="flex items-center gap-3 mb-6">
        <Settings className="w-8 h-8 text-blue-600" />
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Configurações do Site</h2>
          <p className="text-gray-600">Gerencie as configurações e informações do seu site</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-8">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center gap-2 ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.name}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Content */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        {activeTab === 'doctor' && renderDoctorInfo()}
        {activeTab === 'clinic' && renderClinicInfo()}
        {activeTab === 'social' && renderSocialMedia()}
        {activeTab === 'site' && renderSiteConfig()}
      </div>
    </div>
  );
};

export default AdminSettingsAdvanced;

