import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { Check } from 'lucide-react';
import { setFontSize, setReduceMotion, setHighContrast } from '../../../store/slices/accessibilitySlice';
import ToggleSwitch from '../../../components/common/ToggleSwitch';

const SIZES = [
  { value: 'small', labelKey: 'accessibility.small' },
  { value: 'medium', labelKey: 'accessibility.medium' },
  { value: 'large', labelKey: 'accessibility.large' },
  { value: 'xlarge', labelKey: 'accessibility.xlarge' },
];

export default function AccessibilitySettings() {
  const { fontSize, reduceMotion, highContrast } = useSelector((state) => state.accessibility);
  const dispatch = useDispatch();
  const { t } = useTranslation();

  return (
    <div className="bg-panel border border-panelLight rounded-lg p-6">
      <h2 className="font-display text-lg font-semibold text-ink50 mb-1">
        {t('accessibility.title')}
      </h2>
      <p className="text-sm text-inkMuted mb-6">{t('accessibility.description')}</p>

      <div className="mb-6">
        <p className="text-sm text-ink50 mb-3">{t('accessibility.textSize')}</p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {SIZES.map((size) => {
            const active = fontSize === size.value;
            return (
              <button
                key={size.value}
                onClick={() => dispatch(setFontSize(size.value))}
                className={`p-3 rounded-lg border flex items-center justify-between transition-colors ${
                  active ? 'border-signal bg-signal/5' : 'border-panelLight hover:border-inkMuted/40'
                }`}
              >
                <span className="text-sm text-ink50">{t(size.labelKey)}</span>
                {active && <Check size={14} className="text-signal" />}
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex items-center justify-between gap-4 py-4 border-t border-panelLight">
        <div>
          <p className="text-sm text-ink50">{t('accessibility.reduceMotion')}</p>
          <p className="text-xs text-inkMuted mt-1">{t('accessibility.reduceMotionDesc')}</p>
        </div>
        <ToggleSwitch checked={reduceMotion} onChange={(v) => dispatch(setReduceMotion(v))} />
      </div>

      <div className="flex items-center justify-between gap-4 py-4 border-t border-panelLight">
        <div>
          <p className="text-sm text-ink50">{t('accessibility.highContrast')}</p>
          <p className="text-xs text-inkMuted mt-1">{t('accessibility.highContrastDesc')}</p>
        </div>
        <ToggleSwitch checked={highContrast} onChange={(v) => dispatch(setHighContrast(v))} />
      </div>
    </div>
  );
}