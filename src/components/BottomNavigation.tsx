import { Search, User, LayoutList } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useI18n } from '../i18n';

export function BottomNavigation() {
  const location = useLocation();
  const { t } = useI18n();

  const isActive = (path: string) => location.pathname.includes(path);

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 h-20 flex items-center justify-around bg-background border-t border-border py-2">
      <Link
        to="search"
        className={`flex flex-col items-center p-2 ${
          isActive('/search') || isActive('/equipment')
            ? 'text-primary'
            : 'text-muted-foreground'
        }`}
      >
        <Search className="w-6 h-6" />
        <span className="text-xs mt-1">{t('navigation.search')}</span>
      </Link>

      <Link
        to="/my-tasks"
        className={`flex flex-col items-center p-2 ${
          isActive('/my-tasks') ? 'text-primary' : 'text-muted-foreground'
        }`}
      >
        <LayoutList className="w-6 h-6" />
        <span className="text-xs mt-1">{t('navigation.myTasks')}</span>
      </Link>

      <Link
        to="/profile"
        className={`flex flex-col items-center p-2 ${
          isActive('/profile') ? 'text-primary' : 'text-muted-foreground'
        }`}
      >
        <User className="w-6 h-6" />
        <span className="text-xs mt-1">{t('navigation.profile')}</span>
      </Link>

      {/* <Link
        to="/settings"
        className={`flex flex-col items-center p-2 ${
          isActive('/settings') ? 'text-primary' : 'text-muted-foreground'
        }`}
      >
        <Settings className="w-6 h-6" />
        <span className="text-xs mt-1">{t('navigation.settings')}</span>
      </Link> */}
    </nav>
  );
}
