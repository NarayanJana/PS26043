import { useState } from 'react';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import {
  User,
  Palette,
  Globe,
  Bell,
  Shield,
  Accessibility,
  HelpCircle,
  AlertTriangle,
} from 'lucide-react';
import DashboardLayout from '../../layouts/DashboardLayout';
import { getNavItemsForRole } from '../../utils/roleNavItems';
import AccountSettings from './sections/AccountSettings';
import AppearanceSettings from './sections/AppearanceSettings';
import LanguageSettings from './sections/LanguageSettings';
import NotificationSettings from './sections/NotificationSettings';
import PrivacySecuritySettings from './sections/PrivacySecuritySettings';
import AccessibilitySettings from './sections/AccessibilitySettings';
import HelpAboutSettings from './sections/HelpAboutSettings';
import DangerZoneSettings from './sections/DangerZoneSettings';

const SECTIONS = [
  { key: 'account', labelKey: 'settings.sections.account', icon: User, component: AccountSettings },
  { key: 'appearance', labelKey: 'settings.sections.appearance', icon: Palette, component: AppearanceSettings },
  { key: 'language', labelKey: 'settings.sections.language', icon: Globe, component: LanguageSettings },
  { key: 'notifications', labelKey: 'settings.sections.notifications', icon: Bell, component: NotificationSettings },
  { key: 'privacy', labelKey: 'settings.sections.privacy', icon: Shield, component: PrivacySecuritySettings },
  { key: 'accessibility', labelKey: 'settings.sections.accessibility', icon: Accessibility, component: AccessibilitySettings },
  { key: 'help', labelKey: 'settings.sections.help', icon: HelpCircle, component: HelpAboutSettings },
  { key: 'danger', labelKey: 'settings.sections.danger', icon: AlertTriangle, component: DangerZoneSettings },
];

export default function Settings() {
  const { user } = useSelector((state) => state.auth);
  const { t } = useTranslation();
  const [activeSection, setActiveSection] = useState('account');
  const navItems = getNavItemsForRole(user?.role);

  const ActiveComponent =
    SECTIONS.find((s) => s.key === activeSection)?.component || AccountSettings;

  return (
    <DashboardLayout navItems={navItems}>
      <div className="p-8 max-w-5xl">
        <h1 className="font-display text-2xl font-semibold text-ink50 mb-1">
          {t('settings.title')}
        </h1>
        <p className="text-sm text-inkMuted mb-8">{t('settings.subtitle')}</p>

        <div className="flex flex-col md:grid md:grid-cols-[220px_1fr] gap-6">
          <nav className="flex md:flex-col gap-1 overflow-x-auto md:overflow-visible pb-2 md:pb-0 border-b md:border-b-0 md:border-r border-panelLight md:pr-4">
            {SECTIONS.map((section) => {
              const active = activeSection === section.key;
              const isDanger = section.key === 'danger';
              return (
                <button
                  key={section.key}
                  onClick={() => setActiveSection(section.key)}
                  className={`flex items-center gap-2.5 px-3 py-2.5 rounded-md text-sm whitespace-nowrap shrink-0 md:shrink transition-colors text-left ${
                    active
                      ? isDanger
                        ? 'bg-red-500/10 text-red-400'
                        : 'bg-signal/10 text-signal'
                      : isDanger
                      ? 'text-red-400/70 hover:text-red-400 hover:bg-panelLight'
                      : 'text-inkMuted hover:text-ink50 hover:bg-panelLight'
                  }`}
                >
                  <section.icon size={16} />
                  {t(section.labelKey)}
                </button>
              );
            })}
          </nav>

          <div className="min-w-0">
            <ActiveComponent />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}