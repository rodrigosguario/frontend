// Sistema de gerenciamento de configurações local
class SettingsManager {
  constructor() {
    this.settingsKey = 'dr_rodrigo_site_settings';
    this.defaultSettings = {
      doctor: {
        name: "Dr. Rodrigo Sguario",
        specialty: "Cardiologista",
        crm: "12345-SP",
        phone: "+55 (11) 99999-9999",
        email: "contato@drrodrigo.com.br",
        address: "Rua das Flores, 123 - São Paulo, SP",
        hours: "Segunda a Sexta: 8h às 18h",
        emergency: "Emergências: 24h por dia"
      },
      clinic: {
        name: "Clínica Cardiológica Dr. Rodrigo Sguario",
        description: "Especializada em cardiologia e transplante cardíaco",
        phone: "+55 (11) 99999-9999",
        email: "contato@drrodrigo.com.br",
        address: "Rua das Flores, 123 - São Paulo, SP",
        hours: "Segunda a Sexta: 8h às 18h",
        emergency: "Emergências: 24h por dia"
      },
      social: {
        whatsapp: "+55 (11) 99999-9999",
        instagram: "@drrodrigosguario",
        facebook: "DrRodrigoSguario",
        linkedin: "dr-rodrigo-sguario"
      },
      site: {
        primaryColor: "#3B82F6",
        accentColor: "#60A5FA",
        showReviews: true,
        autoImportReviews: false,
        theme: "light",
        language: "pt-BR"
      }
    };
  }

  // Carregar configurações
  loadSettings() {
    try {
      const savedSettings = localStorage.getItem(this.settingsKey);
      if (savedSettings) {
        const parsed = JSON.parse(savedSettings);
        return { success: true, data: parsed };
      } else {
        // Se não há configurações salvas, usar o padrão
        this.saveSettings(this.defaultSettings);
        return { success: true, data: this.defaultSettings };
      }
    } catch (error) {
      console.error('Erro ao carregar configurações:', error);
      return { success: false, data: this.defaultSettings };
    }
  }

  // Salvar configurações
  saveSettings(settings) {
    try {
      localStorage.setItem(this.settingsKey, JSON.stringify(settings));
      return { success: true, message: 'Configurações salvas com sucesso' };
    } catch (error) {
      console.error('Erro ao salvar configurações:', error);
      return { success: false, message: 'Erro ao salvar configurações' };
    }
  }

  // Atualizar configuração específica
  updateSetting(category, key, value) {
    try {
      const currentSettings = this.loadSettings().data;
      if (!currentSettings[category]) {
        currentSettings[category] = {};
      }
      currentSettings[category][key] = value;
      return this.saveSettings(currentSettings);
    } catch (error) {
      console.error('Erro ao atualizar configuração:', error);
      return { success: false, message: 'Erro ao atualizar configuração' };
    }
  }

  // Obter configuração específica
  getSetting(category, key) {
    try {
      const settings = this.loadSettings().data;
      return { success: true, data: settings[category]?.[key] };
    } catch (error) {
      console.error('Erro ao obter configuração:', error);
      return { success: false, data: null };
    }
  }

  // Obter categoria de configurações
  getCategory(category) {
    try {
      const settings = this.loadSettings().data;
      return { success: true, data: settings[category] || {} };
    } catch (error) {
      console.error('Erro ao obter categoria:', error);
      return { success: false, data: {} };
    }
  }

  // Resetar para configurações padrão
  resetToDefault() {
    try {
      localStorage.removeItem(this.settingsKey);
      return { success: true, message: 'Configurações resetadas para padrão' };
    } catch (error) {
      console.error('Erro ao resetar configurações:', error);
      return { success: false, message: 'Erro ao resetar configurações' };
    }
  }

  // Fazer backup das configurações
  createBackup() {
    try {
      const settings = this.loadSettings().data;
      const backup = {
        settings,
        timestamp: new Date().toISOString(),
        version: '1.0'
      };
      
      localStorage.setItem('dr_rodrigo_settings_backup', JSON.stringify(backup));
      return { success: true, message: 'Backup das configurações criado com sucesso' };
    } catch (error) {
      console.error('Erro ao criar backup das configurações:', error);
      return { success: false, message: 'Erro ao criar backup das configurações' };
    }
  }

  // Restaurar backup
  restoreBackup() {
    try {
      const backupData = localStorage.getItem('dr_rodrigo_settings_backup');
      if (backupData) {
        const backup = JSON.parse(backupData);
        return this.saveSettings(backup.settings);
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
export const settingsManager = new SettingsManager();

// Funções de conveniência
export const loadSettings = () => settingsManager.loadSettings();
export const saveSettings = (settings) => settingsManager.saveSettings(settings);
export const updateSetting = (category, key, value) => settingsManager.updateSetting(category, key, value);
export const getSetting = (category, key) => settingsManager.getSetting(category, key);
export const getCategory = (category) => settingsManager.getCategory(category);
export const resetToDefault = () => settingsManager.resetToDefault();
export const createBackup = () => settingsManager.createBackup();
export const restoreBackup = () => settingsManager.restoreBackup();
