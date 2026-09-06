import { useEffect } from 'react';
import { useSelector } from 'react-redux';

export default function ThemeManager() {
  const mode = useSelector((state) => state.theme.mode);

  useEffect(() => {
    const applyTheme = () => {
      let resolved = mode;
      if (mode === 'system') {
        resolved = window.matchMedia('(prefers-color-scheme: dark)').matches
          ? 'dark'
          : 'light';
      }

      if (resolved === 'light') {
        document.documentElement.setAttribute('data-theme', 'light');
      } else {
        document.documentElement.removeAttribute('data-theme');
      }
    };

    applyTheme();

    if (mode === 'system') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      mediaQuery.addEventListener('change', applyTheme);
      return () => mediaQuery.removeEventListener('change', applyTheme);
    }
  }, [mode]);

  return null;
}