import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useDarkMode } from '../hooks/useDarkMode';

type Theme = 'light' | 'dark';

interface ThemeToggleProps {
  className?: string;
  showLabel?: boolean;
}

const ThemeToggle: React.FC<ThemeToggleProps> = ({ className = '', showLabel = false }) => {
  const { theme, toggleTheme } = useDarkMode();

  const getThemeIcon = (currentTheme: Theme) => {
    if (currentTheme === 'dark') {
      return <Moon size={20} className="text-[rgb(var(--color-accent))]" />;
    }
    return <Sun size={20} className="text-orange-500" />;
  };

  const getThemeLabel = (currentTheme: Theme) => {
    return currentTheme === 'dark' ? 'Mode sombre' : 'Mode clair';
  };

  return (
    <button
      onClick={toggleTheme}
      className={`p-3.5 rounded-xl bg-[rgb(var(--color-surface))] border border-[rgb(var(--color-border))] hover:bg-[rgb(var(--color-hover))] transition-all duration-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-[rgb(var(--color-accent))] ${className}`}
      aria-label={`Changer le thème (actuellement ${getThemeLabel(theme)})`}
      title={`Changer le thème (actuellement ${getThemeLabel(theme)})`}
    >
      <div className="flex items-center gap-2">
        {getThemeIcon(theme)}
        {showLabel && (
          <span className="text-sm font-semibold text-[rgb(var(--color-text-primary))]">
            {getThemeLabel(theme)}
          </span>
        )}
      </div>
    </button>
  );
};

export default ThemeToggle;
