import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { getMySettings, updateNotificationSettings } from '../../../services/userService';
import { showToast } from '../../../utils/toastBus';
import ToggleSwitch from '../../../components/common/ToggleSwitch';

const TOGGLES = [
  { key: 'challengeUpdates', labelKey: 'notifications.challengeUpdates', descKey: 'notifications.challengeUpdatesDesc' },
  { key: 'projectUpdates', labelKey: 'notifications.projectUpdates', descKey: 'notifications.projectUpdatesDesc' },
  { key: 'collaborationRequests', labelKey: 'notifications.collaborationRequests', descKey: 'notifications.collaborationRequestsDesc' },
  { key: 'systemNotifications', labelKey: 'notifications.systemNotifications', descKey: 'notifications.systemNotificationsDesc' },
  { key: 'emailNotifications', labelKey: 'notifications.emailNotifications', descKey: 'notifications.emailNotificationsDesc' },
];

export default function NotificationSettings() {
  const { t } = useTranslation();
  const [prefs, setPrefs] = useState(null);
  const [loading, setLoading] = useState(true);
  const [savingKey, setSavingKey] = useState(null);

  useEffect(() => {
    getMySettings()
      .then((res) => setPrefs(res.data.settings.notifications))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const handleToggle = async (key, value) => {
    const previous = prefs;
    // Optimistic update — flips instantly, reverts only if the save fails.
    setPrefs({ ...prefs, [key]: value });
    setSavingKey(key);
    try {
      const { data } = await updateNotificationSettings({ [key]: value });
      setPrefs(data.settings.notifications);
      showToast(t('notifications.saved'), 'success');
    } catch (err) {
      setPrefs(previous);
      console.error(err);
    } finally {
      setSavingKey(null);
    }
  };

  if (loading || !prefs) {
    return (
      <div className="bg-panel border border-panelLight rounded-lg p-6">
        <p className="text-sm text-inkMuted">Loading...</p>
      </div>
    );
  }

  return (
    <div className="bg-panel border border-panelLight rounded-lg p-6">
      <h2 className="font-display text-lg font-semibold text-ink50 mb-1">
        {t('notifications.title')}
      </h2>
      <p className="text-sm text-inkMuted mb-6">{t('notifications.description')}</p>

      <div className="flex flex-col divide-y divide-panelLight">
        {TOGGLES.map((toggle) => (
          <div key={toggle.key} className="flex items-center justify-between gap-4 py-4 first:pt-0 last:pb-0">
            <div className="min-w-0">
              <p className="text-sm text-ink50">{t(toggle.labelKey)}</p>
              <p className="text-xs text-inkMuted mt-1">{t(toggle.descKey)}</p>
            </div>
            <ToggleSwitch
              checked={prefs[toggle.key]}
              onChange={(value) => handleToggle(toggle.key, value)}
              disabled={savingKey === toggle.key}
            />
          </div>
        ))}
      </div>
    </div>
  );
}