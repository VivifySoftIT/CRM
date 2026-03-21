import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

const DEFAULT_COLORS = {
  primary:   '#6366f1',
  secondary: '#ec4899',
  accent:    '#8b5cf6',
};

export const ThemeProvider = ({ children }) => {
  const [isDark, setIsDark] = useState(() => {
    const saved = localStorage.getItem('omni-theme');
    return saved ? saved === 'dark' : true;
  });

  const [brandColors, setBrandColors] = useState(() => {
    try {
      const saved = localStorage.getItem('omni-brand-colors');
      return saved ? JSON.parse(saved) : DEFAULT_COLORS;
    } catch { return DEFAULT_COLORS; }
  });

  // Single unified effect — runs whenever theme OR colors change
  useEffect(() => {
    const root = document.documentElement;

    // 1. Apply dark/light data attribute
    localStorage.setItem('omni-theme', isDark ? 'dark' : 'light');
    root.setAttribute('data-theme', isDark ? 'dark' : 'light');

    // 2. Immediately override the CSS vars with brand colors
    //    Using a <style> tag injected into <head> so it beats [data-theme] specificity
    const styleId = 'omni-brand-colors';
    let styleEl = document.getElementById(styleId);
    if (!styleEl) {
      styleEl = document.createElement('style');
      styleEl.id = styleId;
      document.head.appendChild(styleEl);
    }
    styleEl.textContent = `
      :root,
      [data-theme="light"],
      [data-theme="dark"] {
        --primary:   ${brandColors.primary} !important;
        --secondary: ${brandColors.secondary} !important;
        --accent:    ${brandColors.accent} !important;
      }
      .btn-primary { background: ${brandColors.primary} !important; }
      .btn-primary:hover { background: ${brandColors.primary}dd !important; }
      .gradient-bg { background: linear-gradient(135deg, ${brandColors.primary}, ${brandColors.secondary}) !important; }
      .gradient-text {
        background: linear-gradient(135deg, ${brandColors.primary}, ${brandColors.secondary}) !important;
        -webkit-background-clip: text !important;
        -webkit-text-fill-color: transparent !important;
      }
    `;

    // 3. Persist brand colors
    localStorage.setItem('omni-brand-colors', JSON.stringify(brandColors));
  }, [isDark, brandColors]);

  const toggle = () => setIsDark(d => !d);

  const updateBrandColors = (colors) => {
    setBrandColors(prev => ({ ...prev, ...colors }));
  };

  return (
    <ThemeContext.Provider value={{ isDark, toggle, brandColors, updateBrandColors }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
