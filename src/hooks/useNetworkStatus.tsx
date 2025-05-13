import { useState, useEffect } from 'react';
import { Network } from '@capacitor/network';
import { Capacitor } from '@capacitor/core';

export function useNetworkStatus() {
  const [isConnected, setIsConnected] = useState(true);

  useEffect(() => {
    if (!Capacitor.isNativePlatform()) return;

    const checkInitialStatus = async () => {
      const status = await Network.getStatus();
      setIsConnected(status.connected);
    };

    checkInitialStatus();

    const networkListener = Network.addListener(
      'networkStatusChange',
      (status) => {
        setIsConnected(status.connected);
      }
    );

    return () => {
      networkListener.then((listener) => listener.remove());
    };
  }, []);

  return { isConnected };
}
