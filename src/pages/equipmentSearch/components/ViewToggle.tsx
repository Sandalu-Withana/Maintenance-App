'use client';

import { useI18n } from '../../../i18n';

interface ViewToggleProps {
  activeView: 'map' | 'list';
  onViewChange: (view: 'map' | 'list') => void;
}

export function ViewToggle({ activeView, onViewChange }: ViewToggleProps) {
  const { t } = useI18n();

  return (
    <div className="flex items-center bg-muted rounded-full p-1">
      <button
        className={`px-4 py-1 text-sm rounded-full ${
          activeView === 'map'
            ? 'bg-primary text-primary-foreground'
            : 'text-muted-foreground hover:text-foreground'
        }`}
        onClick={() => onViewChange('map')}
      >
        {t('search.views.map')}
      </button>
      <button
        className={`px-4 py-1 text-sm rounded-full ${
          activeView === 'list'
            ? 'bg-primary text-primary-foreground'
            : 'text-muted-foreground hover:text-foreground'
        }`}
        onClick={() => onViewChange('list')}
      >
        {t('search.views.list')}
      </button>
    </div>
  );
}
