import { createContext, useContext, useState, useEffect } from 'react';

// 1. Create the context
const ThemeContext = createContext();

// 2. Create the provider component
export const ThemeProvider = ({ children }) => {
  // Default to 'light' or get from user's local storage
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'light');

  // Effect to update the <html> tag and local storage when theme changes
  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  // 3. Pass down the state and the toggle function
  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

// 4. Create a custom hook for easy access
export const useTheme = () => useContext(ThemeContext);