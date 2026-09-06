import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import i18n from '../../i18n';

export default function LanguageManager() {
  const language = useSelector((state) => state.language.language);

  useEffect(() => {
    i18n.changeLanguage(language);
  }, [language]);

  return null;
}