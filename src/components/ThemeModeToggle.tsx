import React, { useEffect } from 'react';
import { Sun, Moon, Sparkles } from 'lucide-react';
import { useCMS } from '../cms';

export const ThemeModeToggle: React.FC = () => {
  const { themeMode, setThemeMode } = useCMS();

  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove('dark', 'ambient-mode');

    if (themeMode === 'dark') {
      root.classList.add('dark');
    } else if (themeMode === 'ambient') {
      root.classList.add('ambient-mode');
    }
  }, [themeMode]);

  return (
    <div className="inline-flex items-center space-x-1 bg-neutral-100 dark:bg-neutral-800 p-0.5 rounded border border-neutral-200 dark:border-neutral-700 font-mono text-[10px]">
      <button
        onClick={() => setThemeMode('light')}
        title="라이트 모드"
        className={`px-2 py-0.5 font-bold uppercase transition-all rounded cursor-pointer flex items-center space-x-1 ${
          themeMode === 'light'
            ? 'bg-white text-black shadow-xs'
            : 'text-neutral-500 hover:text-black dark:text-neutral-400'
        }`}
      >
        <Sun className="w-3 h-3 text-amber-500" />
        <span className="hidden sm:inline">Light</span>
      </button>

      <button
        onClick={() => setThemeMode('dark')}
        title="다크 모드"
        className={`px-2 py-0.5 font-bold uppercase transition-all rounded cursor-pointer flex items-center space-x-1 ${
          themeMode === 'dark'
            ? 'bg-neutral-900 text-white shadow-xs'
            : 'text-neutral-500 hover:text-black dark:text-neutral-400'
        }`}
      >
        <Moon className="w-3 h-3 text-indigo-400" />
        <span className="hidden sm:inline">Dark</span>
      </button>

      <button
        onClick={() => setThemeMode('ambient')}
        title="럭셔리 앰비언트 모드"
        className={`px-2 py-0.5 font-bold uppercase transition-all rounded cursor-pointer flex items-center space-x-1 ${
          themeMode === 'ambient'
            ? 'bg-amber-950 text-amber-200 shadow-xs border border-amber-800'
            : 'text-neutral-500 hover:text-black dark:text-neutral-400'
        }`}
      >
        <Sparkles className="w-3 h-3 text-amber-400 animate-spin" style={{ animationDuration: '6s' }} />
        <span className="hidden sm:inline">Ambient</span>
      </button>
    </div>
  );
};
