// components/ThemeToggle.jsx
import { useState, useEffect } from 'react';

const ThemeToggle = () => {
  const [isDark, setIsDark] = useState(() => {
    const savedTheme = localStorage.getItem('dashboardTheme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    return savedTheme === 'dark' || (!savedTheme && prefersDark);
  });

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('dashboardTheme', isDark ? 'dark' : 'light');
  }, [isDark]);

  const toggleTheme = () => {
    setIsDark((prev) => !prev);
  };

  return (
    <button 
      onClick={toggleTheme}
      className="fixed left-4 bottom-4 z-40 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-3xl px-3 py-2 shadow-sm hover:shadow-md transition items-center text-sm font-medium"
    >
      <i className={`${isDark ? 'fas fa-sun' : 'fas fa-moon'} text-indigo-500 dark:text-amber-400`}></i>
    </button>
  );
};

export default ThemeToggle;