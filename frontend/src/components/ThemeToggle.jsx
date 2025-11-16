import { useTheme } from '../context/ThemeContext.jsx';
import { Sun, Moon } from 'lucide-react';
import { useEffect } from 'react';

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  // Debug: Log when theme changes
  useEffect(() => {
    const hasDark = document.documentElement.classList.contains('dark');
    console.log('Theme state:', theme, 'HTML has dark class:', hasDark);
  }, [theme]);

  const handleToggle = () => {
    console.log('Toggle clicked, current theme:', theme);
    toggleTheme();
    // Verify class was added/removed
    setTimeout(() => {
      const hasDark = document.documentElement.classList.contains('dark');
      console.log('After toggle - HTML has dark class:', hasDark);
    }, 100);
  };

  return (
    <button
      onClick={handleToggle}
      className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors bg-gray-100 dark:bg-gray-800"
      aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
      title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
    >
      {theme === 'light' ? <Moon size={20} className="text-gray-700 dark:text-gray-300" /> : <Sun size={20} className="text-yellow-500" />}
    </button>
  );
}