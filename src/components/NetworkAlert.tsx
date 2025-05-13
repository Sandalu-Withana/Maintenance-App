import { useNetworkStatus } from '../hooks/useNetworkStatus';
import { useI18n } from '../i18n';
import { WifiOff } from 'lucide-react';

export function NetworkAlert() {
  const { isConnected } = useNetworkStatus();
  const { t } = useI18n();

  if (isConnected) return null;

  return (
    <div className="fixed top-14 left-0 right-0 bg-red-600 text-white p-2 z-50">
      <div className="flex items-center justify-center">
        <WifiOff className="w-4 h-4 mr-2" />
        <span className="text-sm font-medium">{t('network.offline')}</span>
      </div>
    </div>
  );
}
