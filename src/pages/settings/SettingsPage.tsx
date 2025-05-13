import { Header } from '../../components/Header';
import { BottomNavigation } from '../../components/BottomNavigation';
import { ToggleSwitch } from './components/ToggleSwitch';
import { LanguageSwitcher } from './components/LanguageSwitcher';
import { useTheme } from '../../context/ThemeContext';
import { useI18n } from '../../i18n';
import { Moon } from 'lucide-react';

export default function SettingsPage() {
  const { theme, setTheme } = useTheme();
  const { t } = useI18n();
  const isDarkMode = theme === 'dark';

  const toggleDarkMode = (checked: boolean) => {
    setTheme(checked ? 'dark' : 'light');
  };

  // Current date for build date
  const currentDate = new Date().toLocaleDateString('en-US', {
    month: 'numeric',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-black">
      <Header />

      <main className="flex-1 px-4 py-6 pb-6">
        <h1 className="text-2xl font-bold mb-6">{t('settings.title')}</h1>

        <div className="space-y-6">
          {/* Appearance Section */}
          <section className="bg-card dark:bg-card rounded-lg p-4">
            <h2 className="text-xl font-semibold mb-1">
              {t('settings.appearance.title')}
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
              {t('settings.appearance.description')}
            </p>

            <div className="flex items-center justify-between py-2">
              <div className="flex items-center">
                <Moon className="w-5 h-5 mr-3 text-gray-700 dark:text-gray-300" />
                <span>{t('settings.appearance.darkMode')}</span>
              </div>
              <ToggleSwitch checked={isDarkMode} onChange={toggleDarkMode} />
            </div>

            <div className="flex items-center justify-between py-2 mt-2">
              <span>Language / Langue</span>
              <LanguageSwitcher />
            </div>
          </section>

          {/* About Section */}
          <section className="bg-card dark:bg-card rounded-lg p-4">
            <h2 className="text-xl font-semibold mb-1">
              {t('settings.about.title')}
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
              {t('settings.about.description')}
            </p>

            <div className="space-y-4">
              <div>
                <h3 className="text-sm text-gray-500 dark:text-gray-400">
                  {t('settings.about.appVersion')}
                </h3>
                <p>1.2.0</p>
              </div>

              <div>
                <h3 className="text-sm text-gray-500 dark:text-gray-400">
                  {t('settings.about.buildDate')}
                </h3>
                <p>{currentDate}</p>
              </div>
            </div>
          </section>
        </div>
      </main>

      <BottomNavigation />
    </div>
  );
}
