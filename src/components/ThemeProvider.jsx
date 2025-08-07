import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

// Paletas de cores predefinidas
const colorPalettes = {
  default: {
    name: 'Azul Médico',
    primary: '#3B82F6',
    secondary: '#1E40AF',
    accent: '#60A5FA',
    success: '#10B981',
    warning: '#F59E0B',
    error: '#EF4444'
  },
  green: {
    name: 'Verde Saúde',
    primary: '#10B981',
    secondary: '#059669',
    accent: '#34D399',
    success: '#059669',
    warning: '#F59E0B',
    error: '#EF4444'
  },
  purple: {
    name: 'Roxo Elegante',
    primary: '#8B5CF6',
    secondary: '#7C3AED',
    accent: '#A78BFA',
    success: '#10B981',
    warning: '#F59E0B',
    error: '#EF4444'
  },
  red: {
    name: 'Vermelho Cardíaco',
    primary: '#EF4444',
    secondary: '#DC2626',
    accent: '#F87171',
    success: '#10B981',
    warning: '#F59E0B',
    error: '#DC2626'
  },
  orange: {
    name: 'Laranja Energia',
    primary: '#F97316',
    secondary: '#EA580C',
    accent: '#FB923C',
    success: '#10B981',
    warning: '#F59E0B',
    error: '#EF4444'
  },
  teal: {
    name: 'Verde-azulado Calmante',
    primary: '#14B8A6',
    secondary: '#0D9488',
    accent: '#5EEAD4',
    success: '#10B981',
    warning: '#F59E0B',
    error: '#EF4444'
  }
};

export const ThemeProvider = ({ children }) => {
  const [currentPalette, setCurrentPalette] = useState('default');
  const [isDark, setIsDark] = useState(false);

  // Carregar preferências salvas
  useEffect(() => {
    const savedPalette = localStorage.getItem('site-color-palette');
    const savedTheme = localStorage.getItem('site-theme');
    
    if (savedPalette && colorPalettes[savedPalette]) {
      setCurrentPalette(savedPalette);
    }
    
    if (savedTheme) {
      setIsDark(savedTheme === 'dark');
    }
  }, []);

  // Aplicar cores ao CSS
  useEffect(() => {
    const palette = colorPalettes[currentPalette];
    const root = document.documentElement;
    
    // Aplicar variáveis CSS
    root.style.setProperty('--color-primary', palette.primary);
    root.style.setProperty('--color-secondary', palette.secondary);
    root.style.setProperty('--color-accent', palette.accent);
    root.style.setProperty('--color-success', palette.success);
    root.style.setProperty('--color-warning', palette.warning);
    root.style.setProperty('--color-error', palette.error);
    
    // Salvar preferência
    localStorage.setItem('site-color-palette', currentPalette);
  }, [currentPalette]);

  // Aplicar tema escuro/claro
  useEffect(() => {
    const root = document.documentElement;
    
    if (isDark) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    
    localStorage.setItem('site-theme', isDark ? 'dark' : 'light');
  }, [isDark]);

  const changePalette = (paletteName) => {
    if (colorPalettes[paletteName]) {
      setCurrentPalette(paletteName);
    }
  };

  const toggleTheme = () => {
    setIsDark(!isDark);
  };

  const getCurrentPalette = () => colorPalettes[currentPalette];

  const getAllPalettes = () => colorPalettes;

  const value = {
    currentPalette,
    changePalette,
    getCurrentPalette,
    getAllPalettes,
    isDark,
    toggleTheme
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

export default ThemeProvider;

