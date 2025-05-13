import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.aircanada.gse.maintenance',
  appName: 'AC GSE Maintenance',
  webDir: 'dist',
  server: {
    androidScheme: 'https',
  },
  plugins: {
    EdgeToEdge: {
      backgroundColor: '#000000',
    },
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: '#000000',
      showSpinner: false,
      androidSpinnerStyle: 'large',
      spinnerColor: '#E31837',
      splashFullScreen: true,
      splashImmersive: true,
    },
    Geolocation: {
      // iOS configuration
      ios: {
        plistAdditions: {
          NSLocationWhenInUseUsageDescription:
            'We need your location to show you nearby equipment on the map.',
          NSLocationAlwaysUsageDescription:
            'We need your location to show you nearby equipment on the map.',
        },
      },
      // Android configuration
      permissions: {
        geolocation: ['coarse', 'fine'],
      },
    },
  },
};

export default config;
