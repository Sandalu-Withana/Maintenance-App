import { useI18n } from '../../../i18n';
import { useState } from 'react';

export function LanguageSwitcher() {
  const { locale, setLocale } = useI18n();
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => setIsOpen(!isOpen);

  const changeLanguage = (newLocale: 'en' | 'fr') => {
    setLocale(newLocale);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={toggleDropdown}
        className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-black dark:hover:text-white"
      >
        {locale === 'en' ? 'English' : 'Français'}
        <svg
          className="w-4 h-4 ml-1"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-40 bg-white dark:bg-gray-800 rounded-md shadow-lg z-10 border border-gray-200 dark:border-gray-700">
          <button
            onClick={() => changeLanguage('en')}
            className={`block w-full text-left px-4 py-2 text-sm ${
              locale === 'en'
                ? 'bg-gray-100 dark:bg-gray-700 text-black dark:text-white'
                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
            }`}
          >
            English
          </button>
          <button
            onClick={() => changeLanguage('fr')}
            className={`block w-full text-left px-4 py-2 text-sm ${
              locale === 'fr'
                ? 'bg-gray-100 dark:bg-gray-700 text-black dark:text-white'
                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
            }`}
          >
            Français
          </button>
        </div>
      )}
    </div>
  );
}
