import { Link } from 'react-router-dom';
import logoDark from '../assets/logo_light.png';
import logoLight from '../assets/logo_dark.svg';

export function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between h-16 px-4 py-3 bg-background border-b border-border">
      <div className="flex w-full items-center justify-center">
        <Link to="/">
          <img
            src={logoLight}
            alt="Logo"
            className="hidden dark:block w-auto h-6 mr-2"
          />
          <img
            src={logoDark}
            alt="Logo"
            className="block dark:hidden w-auto h-6 mr-2"
          />
        </Link>
        {/* <span className="ml-1 text-sm font-medium">GSE</span> */}
      </div>
      {/* <div className="flex items-center space-x-4">
        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-800 text-sm font-medium">
          JS
        </div>
        <button className="flex items-center text-sm text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white">
          <LogOut className="w-4 h-4 mr-1" />
          <span>{t('auth.logout')}</span>
        </button>
      </div> */}
    </header>
  );
}
