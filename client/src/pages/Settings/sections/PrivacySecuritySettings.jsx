import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { LogOut, Monitor, Check } from 'lucide-react';
import {
  getMySettings,
  updatePrivacySettings,
  logoutAllDevices,
} from '../../../services/userService';
import { logout } from '../../../store/slices/authSlice';
import { showToast } from '../../../utils/toastBus';
import ToggleSwitch from '../../../components/common/ToggleSwitch';

export default function PrivacySecuritySettings() {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [privacy, setPrivacy] = useState(null);
  const [loading, setLoading] = useState(true);
  const [savingKey, setSavingKey] = useState(null);
  const [loggingOutAll, setLoggingOutAll] = useState(false);

  useEffect(() => {
    getMySettings()
      .then((res) => setPrivacy(res.data.settings.privacy))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const saveField = async (patch, key) => {
    const previous = privacy;
    setPrivacy({ ...privacy, ...patch });
    setSavingKey(key);
    try {
      const { data } = await updatePrivacySettings(patch);
      setPrivacy(data.settings.privacy);
    } catch (err) {
      setPrivacy(previous);
      console.error(err);
    } finally {
      setSavingKey(null);
    }
  };

  const handleLogoutDevice = () => {
    dispatch(logout());
    navigate('/login');
  };

  const handleLogoutAll = async () => {
    if (!window.confirm(t('privacy.logoutAllConfirm'))) return;
    setLoggingOutAll(true);
    try {
      await logoutAllDevices();
      showToast(t('privacy.logoutAllSuccess'), 'success');
      dispatch(logout());
      navigate('/login');
    } catch (err) {
      console.error(err);
      setLoggingOutAll(false);
    }
  };

  if (loading || !privacy) {
    return (
      <div className="bg-panel border border-panelLight rounded-lg p-6">
        <p className="text-sm text-inkMuted">Loading...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="bg-panel border border-panelLight rounded-lg p-6">
        <h2 className="font-display text-lg font-semibold text-ink50 mb-4">
          {t('privacy.loginSecurityTitle')}
        </h2>
        <p className="text-sm text-inkMuted mb-6">{t('privacy.passwordHint')}</p>

        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={handleLogoutDevice}
            className="flex items-center justify-center gap-2 text-sm text-inkMuted border border-panelLight rounded-md px-4 py-2.5 hover:text-ink50 hover:border-inkMuted/40"
          >
            <Monitor size={15} /> {t('privacy.logoutDevice')}
          </button>
          <button
            onClick={handleLogoutAll}
            disabled={loggingOutAll}
            className="flex items-center justify-center gap-2 text-sm text-red-400 border border-red-500/30 rounded-md px-4 py-2.5 hover:bg-red-500/5 disabled:opacity-50"
          >
            <LogOut size={15} /> {loggingOutAll ? '...' : t('privacy.logoutAllDevices')}
          </button>
        </div>
      </div>

      <div className="bg-panel border border-panelLight rounded-lg p-6">
        <h2 className="font-display text-lg font-semibold text-ink50 mb-6">
          {t('privacy.privacyTitle')}
        </h2>

        <div className="mb-6">
          <p className="text-sm text-ink50 mb-1">{t('privacy.profileVisibility')}</p>
          <p className="text-xs text-inkMuted mb-3">{t('privacy.profileVisibilityDesc')}</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {[
              { value: 'public', labelKey: 'privacy.public' },
              { value: 'anonymous', labelKey: 'privacy.anonymous' },
            ].map((option) => {
              const active = privacy.profileVisibility === option.value;
              return (
                <button
                  key={option.value}
                  onClick={() => saveField({ profileVisibility: option.value }, 'profileVisibility')}
                  disabled={savingKey === 'profileVisibility'}
                  className={`text-left p-3 rounded-lg border flex items-center justify-between transition-colors ${
                    active ? 'border-signal bg-signal/5' : 'border-panelLight hover:border-inkMuted/40'
                  }`}
                >
                  <span className="text-sm text-ink50">{t(option.labelKey)}</span>
                  {active && <Check size={15} className="text-signal" />}
                </button>
              );
            })}
          </div>
        </div>

        <div className="flex items-center justify-between gap-4 pt-6 border-t border-panelLight">
          <div className="min-w-0">
            <p className="text-sm text-ink50">{t('privacy.showContactInfo')}</p>
            <p className="text-xs text-inkMuted mt-1">{t('privacy.showContactInfoDesc')}</p>
          </div>
          <ToggleSwitch
            checked={privacy.showContactInfo}
            onChange={(value) => saveField({ showContactInfo: value }, 'showContactInfo')}
            disabled={savingKey === 'showContactInfo'}
          />
        </div>
      </div>
    </div>
  );
}