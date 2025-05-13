import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { Capacitor } from '@capacitor/core';
import { SplashScreen } from '@capacitor/splash-screen';

// Hide the splash screen when the app is ready
if (Capacitor.isNativePlatform()) {
  SplashScreen.hide();
}

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
