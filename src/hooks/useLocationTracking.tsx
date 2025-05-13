import { useState, useEffect } from 'react';
import {
  Geolocation,
  type Position,
  type PermissionStatus,
} from '@capacitor/geolocation';
import { Capacitor } from '@capacitor/core';
import { Haptics, ImpactStyle } from '@capacitor/haptics';

export interface LocationState {
  position: Position | null;
  error: string | null;
  loading: boolean;
  permissionStatus: PermissionStatus | null;
}

export function useLocationTracking(trackingEnabled = true) {
  const [locationState, setLocationState] = useState<LocationState>({
    position: null,
    error: null,
    loading: true,
    permissionStatus: null,
  });
  const [watchId, setWatchId] = useState<string | null>(null);

  // Check permission status
  const checkPermissions = async () => {
    try {
      const status = await Geolocation.checkPermissions();
      setLocationState((prev) => ({ ...prev, permissionStatus: status }));
      return status;
    } catch (error) {
      console.error('Error checking location permissions:', error);
      setLocationState((prev) => ({
        ...prev,
        error: 'Failed to check location permissions',
      }));
      return { location: 'denied' } as PermissionStatus;
    }
  };

  // Request permissions if needed
  const requestPermissions = async () => {
    try {
      const status = await Geolocation.requestPermissions();
      setLocationState((prev) => ({ ...prev, permissionStatus: status }));
      return status;
    } catch (error) {
      console.error('Error requesting location permissions:', error);
      setLocationState((prev) => ({
        ...prev,
        error: 'Failed to request location permissions',
      }));
      return { location: 'denied' } as PermissionStatus;
    }
  };

  // Get current position
  const getCurrentPosition = async () => {
    try {
      setLocationState((prev) => ({ ...prev, loading: true }));
      const position = await Geolocation.getCurrentPosition({
        enableHighAccuracy: true,
        timeout: 10000,
      });

      setLocationState((prev) => ({
        ...prev,
        position,
        error: null,
        loading: false,
      }));

      // Provide haptic feedback on native platforms when location is acquired
      if (Capacitor.isNativePlatform()) {
        await Haptics.impact({ style: ImpactStyle.Light });
      }

      return position;
    } catch (error) {
      console.error('Error getting current position:', error);
      setLocationState((prev) => ({
        ...prev,
        error: 'Failed to get current location',
        loading: false,
      }));
      return null;
    }
  };

  // Start watching position
  const startWatchingPosition = async () => {
    try {
      // Clear any existing watch
      if (watchId !== null) {
        await Geolocation.clearWatch({ id: watchId });
      }

      const id = await Geolocation.watchPosition(
        {
          enableHighAccuracy: true,
          timeout: 10000,
        },
        (position, err) => {
          if (err) {
            setLocationState((prev) => ({
              ...prev,
              error: err.message,
              loading: false,
            }));
            return;
          }

          setLocationState((prev) => ({
            ...prev,
            position,
            error: null,
            loading: false,
          }));
        }
      );

      setWatchId(id);
    } catch (error) {
      console.error('Error watching position:', error);
      setLocationState((prev) => ({
        ...prev,
        error: 'Failed to watch location',
        loading: false,
      }));
    }
  };

  // Stop watching position
  const stopWatchingPosition = async () => {
    if (watchId !== null) {
      await Geolocation.clearWatch({ id: watchId });
      setWatchId(null);
    }
  };

  // Initialize location tracking
  useEffect(() => {
    const initializeLocationTracking = async () => {
      const permStatus = await checkPermissions();

      if (permStatus.location === 'granted') {
        if (trackingEnabled) {
          await getCurrentPosition();
          await startWatchingPosition();
        }
      } else if (permStatus.location === 'prompt') {
        const requestStatus = await requestPermissions();
        if (requestStatus.location === 'granted' && trackingEnabled) {
          await getCurrentPosition();
          await startWatchingPosition();
        }
      }
    };

    initializeLocationTracking();

    return () => {
      stopWatchingPosition();
    };
  }, [trackingEnabled]);

  return {
    ...locationState,
    getCurrentPosition,
    requestPermissions,
    checkPermissions,
    startWatchingPosition,
    stopWatchingPosition,
  };
}
