import React from 'react';
import { Sun, Moon, Monitor } from 'lucide-react';
import { useDarkMode } from '../hooks/useDarkMode';

type Theme = 'light' | 'dark' | 'system';

interface ThemeToggleProps {
  className?: string;
  showLabel?: boolean;
}

const ThemeToggle: React.FC<ThemeToggleProps> = ({ className = '', showLabel = false }) => {
  const { theme, setTheme, toggleTheme } = useDarkMode();

  const getThemeIcon = (currentTheme: Theme) => {
    switch (currentTheme) {
      case 'light':
        return <Sun size={20} className="text-yellow-500" />;
      case 'dark':
        return <Moon size={20} className="text-blue-400" />;
      case 'system':
        return <Monitor size={20} className="text-gray-500 dark:text-gray-400" />;
      default:
        return <Sun size={20} />;
    }
  };

  const getThemeLabel = (currentTheme: Theme) => {
    switch (currentTheme) {
      case 'light':
        return 'Mode clair';
      case 'dark':
        return 'Mode sombre';
      case 'system':
        return 'Système';
      default:
        return 'Mode clair';
    }
  };

  return (
    <div className={`relative group ${className}`}>
      {/* Simple toggle button */}
      <button
        onClick={toggleTheme}
        className="p-3 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200 shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
        aria-label={`Changer le thème (actuellement ${getThemeLabel(theme)})`}
        title={`Changer le thème (actuellement ${getThemeLabel(theme)})`}
      >
        <div className="flex items-center gap-2">
          {getThemeIcon(theme)}
          {showLabel && (
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {getThemeLabel(theme)}
            </span>
          )}
        </div>
      </button>

      {/* Dropdown for specific theme selection */}
      <div className="absolute top-full right-0 mt-2 w-48 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
        <div className="p-2">
          {(['light', 'dark', 'system'] as Theme[]).map((themeOption) => (
            <button
              key={themeOption}
              onClick={() => setTheme(themeOption)}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${
                theme === themeOption
                  ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                  : 'text-gray-700 dark:text-gray-300'
              }`}
            >
              {getThemeIcon(themeOption)}
              <span className="text-sm font-medium">{getThemeLabel(themeOption)}</span>
              {theme === themeOption && (
                <div className="ml-auto w-2 h-2 bg-blue-500 rounded-full"></div>
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ThemeToggle;