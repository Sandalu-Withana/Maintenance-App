import { useEffect } from 'react';
import { App } from '@capacitor/app';
import { Capacitor } from '@capacitor/core';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export function useBackButton() {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (!Capacitor.isNativePlatform()) return;

    const handleBackButtonPromise = App.addListener(
      'backButton',
      ({ canGoBack }) => {
        // If we're on the login page or main search page and authenticated, exit the app
        if (
          (location.pathname === '/login' && !isAuthenticated) ||
          (location.pathname === '/equipment/search' && isAuthenticated)
        ) {
          App.exitApp();
          return;
        }

        // Otherwise, navigate back
        if (canGoBack) {
          navigate(-1);
        } else {
          // If we can't go back, go to the main page based on auth state
          navigate(isAuthenticated ? '/equipment/search' : '/login');
        }
      }
    );

    return () => {
      handleBackButtonPromise.then((handleBackButton) =>
        handleBackButton.remove()
      );
    };
  }, [navigate, location.pathname, isAuthenticated]);
}
