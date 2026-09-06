import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { Check } from 'lucide-react';
import { setLanguage } from '../../../store/slices/languageSlice';

const OPTIONS = [
  { value: 'en', labelKey: 'language.english' },
  { value: 'hi', labelKey: 'language.hindi' },
];

export default function LanguageSettings() {
  const language = useSelector((state) => state.language.language);
  const dispatch = useDispatch();
  const { t } = useTranslation();

  return (
    <div className="bg-panel border border-panelLight rounded-lg p-6">
      <h2 className="font-display text-lg font-semibold text-ink50 mb-1">
        {t('language.title')}
      </h2>
      <p className="text-sm text-inkMuted mb-6">{t('language.description')}</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-w-md">
        {OPTIONS.map((option) => {
          const active = language === option.value;
          return (
            <button
              key={option.value}
              onClick={() => dispatch(setLanguage(option.value))}
              className={`text-left p-4 rounded-lg border transition-colors flex items-center justify-between ${
                active
                  ? 'border-signal bg-signal/5'
                  : 'border-panelLight hover:border-inkMuted/40'
              }`}
            >
              <span className="text-sm text-ink50">{t(option.labelKey)}</span>
              {active && <Check size={15} className="text-signal" />}
            </button>
          );
        })}
      </div>
    </div>
  );
}