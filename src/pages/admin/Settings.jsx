import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ArrowLeft, Palette, Moon, Sun, Save, CheckCircle, Settings as SettingsIcon } from 'lucide-react';
import { useTheme } from '../../components/ThemeProvider';
import { settingsAPI } from '../../config/api';

const Settings = () => {
  const navigate = useNavigate();
  const { currentPalette, isDark, changePalette, toggleTheme, getAllPalettes } = useTheme();
  
  const [settings, setSettings] = useState({
    siteName: 'Dr. Rodrigo Sguario - Cardiologista',
    contactEmail: 'contato@drrodrigo.com',
    contactPhone: '(11) 99999-9999',
    autoSave: true
  });
  
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const response = await settingsAPI.getSettings();
      if (response.success && response.data) {
        setSettings(prev => ({ ...prev, ...response.data }));
      }
    } catch (error) {
      console.error('Erro ao carregar configurações:', error);
    }
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      const response = await settingsAPI.updateSettings(settings);
      if (response.success) {
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
      }
    } catch (error) {
      console.error('Erro ao salvar configurações:', error);
    } finally {
      setLoading(false);
    }
  };

  const colorPalettes = getAllPalettes();

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Button variant="ghost" size="sm" onClick={() => navigate('/admin/dashboard')} className="mr-4">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Voltar
              </Button>
              <SettingsIcon className="w-8 h-8 text-blue-600 mr-3" />
              <div>
                <h1 className="text-xl font-semibold text-gray-900">Configurações</h1>
                <p className="text-sm text-gray-500">Gerencie as configurações do seu site</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {saved && (
          <Alert className="mb-6 border-green-200 bg-green-50">
            <CheckCircle className="w-4 h-4 text-green-600" />
            <AlertDescription className="text-green-700">Configurações salvas com sucesso!</AlertDescription>
          </Alert>
        )}

        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Palette className="w-5 h-5 mr-2" />
              Aparência e Cores
            </CardTitle>
            <CardDescription>Personalize as cores e o tema do seu site</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <Label className="text-base font-medium">Paleta de Cores</Label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-3">
                {Object.entries(colorPalettes).map(([key, palette]) => (
                  <div
                    key={key}
                    className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                      currentPalette === key ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => changePalette(key)}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-sm">{palette.name}</span>
                      {currentPalette === key && <CheckCircle className="w-4 h-4 text-blue-500" />}
                    </div>
                    <div className="flex space-x-1">
                      <div className="w-6 h-6 rounded" style={{ backgroundColor: palette.primary }} />
                      <div className="w-6 h-6 rounded" style={{ backgroundColor: palette.secondary }} />
                      <div className="w-6 h-6 rounded" style={{ backgroundColor: palette.accent }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label className="text-base font-medium">Modo Escuro</Label>
                <p className="text-sm text-gray-600">Ative o modo escuro para o site</p>
              </div>
              <div className="flex items-center space-x-2">
                <Sun className="w-4 h-4 text-gray-400" />
                <Switch checked={isDark} onCheckedChange={toggleTheme} />
                <Moon className="w-4 h-4 text-gray-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Informações do Site</CardTitle>
            <CardDescription>Configure as informações básicas do seu site</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="siteName">Nome do Site</Label>
              <Input
                id="siteName"
                value={settings.siteName}
                onChange={(e) => setSettings(prev => ({ ...prev, siteName: e.target.value }))}
                placeholder="Nome do seu site"
              />
            </div>
            
            <div>
              <Label htmlFor="contactEmail">Email</Label>
              <Input
                id="contactEmail"
                type="email"
                value={settings.contactEmail}
                onChange={(e) => setSettings(prev => ({ ...prev, contactEmail: e.target.value }))}
                placeholder="seu@email.com"
              />
            </div>
            
            <div>
              <Label htmlFor="contactPhone">Telefone</Label>
              <Input
                id="contactPhone"
                value={settings.contactPhone}
                onChange={(e) => setSettings(prev => ({ ...prev, contactPhone: e.target.value }))}
                placeholder="(11) 99999-9999"
              />
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button onClick={handleSave} disabled={loading} className="flex items-center">
            <Save className="w-4 h-4 mr-2" />
            {loading ? 'Salvando...' : 'Salvar Configurações'}
          </Button>
        </div>
      </main>
    </div>
  );
};

export default Settings;
