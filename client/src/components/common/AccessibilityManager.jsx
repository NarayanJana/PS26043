import { useEffect } from 'react';
import { useSelector } from 'react-redux';

export default function AccessibilityManager() {
  const { fontSize, reduceMotion, highContrast } = useSelector((state) => state.accessibility);

  useEffect(() => {
    document.documentElement.setAttribute('data-font-size', fontSize);
  }, [fontSize]);

  useEffect(() => {
    if (reduceMotion) {
      document.documentElement.setAttribute('data-reduce-motion', 'true');
    } else {
      document.documentElement.removeAttribute('data-reduce-motion');
    }
  }, [reduceMotion]);

  useEffect(() => {
    if (highContrast) {
      document.documentElement.setAttribute('data-contrast', 'high');
    } else {
      document.documentElement.removeAttribute('data-contrast');
    }
  }, [highContrast]);

  return null;
}