import { useDispatch, useSelector } from 'react-redux';
import { Sun, Moon, Monitor, Check } from 'lucide-react';
import { setThemeMode } from '../../../store/slices/themeSlice';

const OPTIONS = [
  { value: 'light', label: 'Light', icon: Sun, description: 'Bright background, dark text.' },
  { value: 'dark', label: 'Dark', icon: Moon, description: 'The default look of the platform.' },
  {
    value: 'system',
    label: 'System Default',
    icon: Monitor,
    description: "Follows your device's setting automatically.",
  },
];

export default function AppearanceSettings() {
  const mode = useSelector((state) => state.theme.mode);
  const dispatch = useDispatch();

  return (
    <div className="bg-panel border border-panelLight rounded-lg p-6">
      <h2 className="font-display text-lg font-semibold text-ink50 mb-1">Appearance</h2>
      <p className="text-sm text-inkMuted mb-6">
        Changes apply immediately across the whole app and are remembered on this device.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {OPTIONS.map((option) => {
          const active = mode === option.value;
          return (
            <button
              key={option.value}
              onClick={() => dispatch(setThemeMode(option.value))}
              className={`text-left p-4 rounded-lg border transition-colors ${
                active
                  ? 'border-signal bg-signal/5'
                  : 'border-panelLight hover:border-inkMuted/40'
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <option.icon
                  size={18}
                  className={active ? 'text-signal' : 'text-inkMuted'}
                />
                {active && <Check size={15} className="text-signal" />}
              </div>
              <p className="text-sm text-ink50 font-medium mb-1">{option.label}</p>
              <p className="text-xs text-inkMuted">{option.description}</p>
            </button>
          );
        })}
      </div>
    </div>
  );
}