import { useEffect } from 'react';
import { Capacitor } from '@capacitor/core';
import { StatusBar, Style } from '@capacitor/status-bar';
import { useTheme } from '../context/ThemeContext';

export function useStatusBar() {
  const { theme } = useTheme();

  useEffect(() => {
    if (Capacitor.isNativePlatform()) {
      const setupStatusBar = async () => {
        try {
          await StatusBar.setStyle({
            style: theme === 'dark' ? Style.Dark : Style.Light,
          });

          if (theme === 'dark') {
            // For dark mode, make status bar transparent with light text
            await StatusBar.setBackgroundColor({ color: '#000000' });
          } else {
            // For light mode, white background with dark text
            await StatusBar.setBackgroundColor({ color: '#FFFFFF' });
          }
        } catch (error) {
          console.error('Error setting status bar', error);
        }
      };

      setupStatusBar();
    }
  }, [theme]);
}
