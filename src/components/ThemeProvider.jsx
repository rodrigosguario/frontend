import React, { createContext, useContext, useEffect, useState } from 'react';

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadActiveTheme();
  }, []);

  const loadActiveTheme = async () => {
    try {
      const response = await fetch('/api/settings/colors');
      if (response.ok) {
        const data = await response.json();
        if (data.active_theme) {
          applyTheme(data.active_theme);
          setTheme(data.active_theme);
        }
      }
    } catch (error) {
      console.error('Erro ao carregar tema:', error);
    } finally {
      setLoading(false);
    }
  };

  const applyTheme = (themeData) => {
    if (!themeData) return;

    const root = document.documentElement;
    
    // Aplicar cores CSS customizadas
    root.style.setProperty('--color-primary', themeData.primary_color);
    root.style.setProperty('--color-secondary', themeData.secondary_color);
    root.style.setProperty('--color-accent', themeData.accent_color);
    root.style.setProperty('--color-background', themeData.background_color);
    root.style.setProperty('--color-text', themeData.text_color);
    
    // Converter cores para HSL para variações
    const primaryHsl = hexToHsl(themeData.primary_color);
    const secondaryHsl = hexToHsl(themeData.secondary_color);
    const accentHsl = hexToHsl(themeData.accent_color);
    
    // Aplicar variações de cores
    root.style.setProperty('--color-primary-foreground', getContrastColor(themeData.primary_color));
    root.style.setProperty('--color-secondary-foreground', getContrastColor(themeData.secondary_color));
    root.style.setProperty('--color-accent-foreground', getContrastColor(themeData.accent_color));
    
    // Cores derivadas
    root.style.setProperty('--color-muted', adjustBrightness(themeData.background_color, -10));
    root.style.setProperty('--color-muted-foreground', adjustBrightness(themeData.text_color, 30));
    root.style.setProperty('--color-border', adjustBrightness(themeData.background_color, -20));
    root.style.setProperty('--color-card', themeData.background_color);
    root.style.setProperty('--color-foreground', themeData.text_color);
  };

  const updateTheme = async (themeId) => {
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
        applyTheme(result.active_theme);
        setTheme(result.active_theme);
        return true;
      }
    } catch (error) {
      console.error('Erro ao atualizar tema:', error);
    }
    return false;
  };

  const value = {
    theme,
    updateTheme,
    applyTheme,
    loading
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

// Funções utilitárias para manipulação de cores
function hexToHsl(hex) {
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h, s, l = (max + min) / 2;

  if (max === min) {
    h = s = 0;
  } else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h /= 6;
  }

  return [h * 360, s * 100, l * 100];
}

function hslToHex(h, s, l) {
  l /= 100;
  const a = s * Math.min(l, 1 - l) / 100;
  const f = n => {
    const k = (n + h / 30) % 12;
    const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return Math.round(255 * color).toString(16).padStart(2, '0');
  };
  return `#${f(0)}${f(8)}${f(4)}`;
}

function getContrastColor(hexColor) {
  const r = parseInt(hexColor.slice(1, 3), 16);
  const g = parseInt(hexColor.slice(3, 5), 16);
  const b = parseInt(hexColor.slice(5, 7), 16);
  
  const brightness = (r * 299 + g * 587 + b * 114) / 1000;
  return brightness > 128 ? '#000000' : '#ffffff';
}

function adjustBrightness(hexColor, percent) {
  const [h, s, l] = hexToHsl(hexColor);
  const newL = Math.max(0, Math.min(100, l + percent));
  return hslToHex(h, s, newL);
}

export default ThemeProvider;

