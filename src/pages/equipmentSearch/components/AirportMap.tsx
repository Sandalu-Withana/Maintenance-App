'use client';

import { useEffect, useRef, useState } from 'react';
import { Plus, Minus, Locate } from 'lucide-react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { useI18n } from '../../../i18n';
import { useTheme } from '../../../context/ThemeContext';
import { useLocationTracking } from '../../../hooks/useLocationTracking';
import { Capacitor } from '@capacitor/core';
import { Haptics, ImpactStyle } from '@capacitor/haptics';

// Replace with your Mapbox access token
mapboxgl.accessToken =
  'pk.eyJ1Ijoic2hpZnRncm91cCIsImEiOiJjbHR5cmowdnkwaGZ3MmtscXhpOHpsdzU1In0._OCMHSvGl1_UasezGkygbA';

interface MapMarker {
  id: string;
  type: string;
  position: [number, number]; // [longitude, latitude]
  color: string;
}

interface AirportMapProps {
  airportName: string;
  markers: MapMarker | MapMarker[];
  itemCount?: number;
}

export function AirportMap({
  airportName,
  markers,
  itemCount,
}: AirportMapProps) {
  const { t } = useI18n();
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const userLocationMarker = useRef<mapboxgl.Marker | null>(null);
  const { theme } = useTheme();
  const [zoom, setZoom] = useState(14);
  const [isFollowingUser, setIsFollowingUser] = useState(false);

  // YYZ Airport coordinates
  const yyzCoordinates: [number, number] = [-79.6248, 43.6777];

  // Use the location tracking hook
  const { position, error, getCurrentPosition, requestPermissions } =
    useLocationTracking(true);

  // Initialize map
  useEffect(() => {
    if (map.current) return; // initialize map only once

    if (mapContainer.current) {
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style:
          theme === 'dark'
            ? 'mapbox://styles/mapbox/dark-v11'
            : 'mapbox://styles/mapbox/light-v10', // dark style for dark mode
        center: yyzCoordinates,
        zoom: zoom,
        attributionControl: false,
      });

      // Add markers when map loads
      map.current.on('load', () => {
        (Array.isArray(markers) ? markers : [markers]).forEach((marker) => {
          const el = document.createElement('div');
          el.className = 'marker';
          el.style.backgroundColor = marker.color;
          el.style.width = '24px';
          el.style.height = '24px';
          el.style.borderRadius = '50%';
          el.style.display = 'flex';
          el.style.alignItems = 'center';
          el.style.justifyContent = 'center';
          el.style.color = 'white';
          el.style.fontWeight = 'bold';
          el.style.fontSize = '12px';
          el.innerText = marker.type.substring(0, 2);

          new mapboxgl.Marker(el)
            .setLngLat(marker.position)
            .addTo(map.current!);
        });
      });
    }
  }, [markers]);

  // Update map style when theme changes
  useEffect(() => {
    if (map.current) {
      map.current.setStyle(
        theme === 'dark'
          ? 'mapbox://styles/mapbox/dark-v11'
          : 'mapbox://styles/mapbox/light-v10'
      );
    }
  }, [theme]);

  // Update zoom level
  useEffect(() => {
    if (map.current) {
      map.current.setZoom(zoom);
    }
  }, [zoom]);

  // Update user location marker when position changes
  useEffect(() => {
    if (!map.current || !position?.coords) return;

    const { latitude, longitude, accuracy } = position.coords;
    const userLocation: [number, number] = [longitude, latitude];

    // Create or update user location marker
    if (!userLocationMarker.current) {
      // Create main marker element
      const el = document.createElement('div');
      el.className = 'user-location-marker';
      el.style.width = '16px';
      el.style.height = '16px';
      el.style.borderRadius = '50%';
      el.style.backgroundColor = '#3b82f6';
      el.style.border = '2px solid white';
      el.style.boxShadow = '0 0 0 2px rgba(59, 130, 246, 0.5)';

      // Create inner element for the navigation icon
      const innerEl = document.createElement('div');
      innerEl.style.position = 'absolute';
      innerEl.style.top = '50%';
      innerEl.style.left = '50%';
      innerEl.style.transform = 'translate(-50%, -50%)';
      innerEl.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="3 11 22 2 13 21 11 13 3 11"/></svg>`;

      el.appendChild(innerEl);

      // Create pulsing animation element
      const pulseEl = document.createElement('div');
      pulseEl.className = 'pulse-animation';
      pulseEl.style.position = 'absolute';
      pulseEl.style.top = '-8px';
      pulseEl.style.left = '-8px';
      pulseEl.style.width = '32px';
      pulseEl.style.height = '32px';
      pulseEl.style.borderRadius = '50%';
      pulseEl.style.backgroundColor = 'rgba(59, 130, 246, 0.3)';
      pulseEl.style.animation = 'pulse 2s infinite';

      el.appendChild(pulseEl);

      // Add CSS animation
      const style = document.createElement('style');
      style.innerHTML = `
        @keyframes pulse {
          0% { transform: scale(0.5); opacity: 1; }
          100% { transform: scale(1.5); opacity: 0; }
        }
      `;
      document.head.appendChild(style);

      userLocationMarker.current = new mapboxgl.Marker(el)
        .setLngLat(userLocation)
        .addTo(map.current);

      // Create accuracy radius circle
      if (accuracy) {
        // We don't need a separate marker for the radius as we'll use a layer instead
        // This will be added when the map is fully loaded
        if (map.current.isStyleLoaded()) {
          addAccuracyRadiusLayer(userLocation, accuracy);
        } else {
          map.current.once('load', () => {
            addAccuracyRadiusLayer(userLocation, accuracy);
          });
        }
      }
    } else {
      // Update existing marker position
      userLocationMarker.current.setLngLat(userLocation);

      // Update accuracy radius if it exists
      if (accuracy && map.current.getSource('user-location-accuracy')) {
        (
          map.current.getSource(
            'user-location-accuracy'
          ) as mapboxgl.GeoJSONSource
        ).setData({
          type: 'Feature',
          geometry: {
            type: 'Point',
            coordinates: userLocation,
          },
          properties: {
            accuracy: accuracy,
          },
        });
      }
    }

    // If following user, center map on user location
    if (isFollowingUser) {
      map.current.flyTo({
        center: userLocation,
        essential: true,
      });
    }
  }, [position]);

  // Function to add accuracy radius layer
  const addAccuracyRadiusLayer = (
    location: [number, number],
    accuracy: number
  ) => {
    if (!map.current) return;

    // Remove existing source and layers if they exist
    if (map.current.getSource('user-location-accuracy')) {
      map.current.removeLayer('user-location-accuracy-fill');
      map.current.removeLayer('user-location-accuracy-border');
      map.current.removeSource('user-location-accuracy');
    }

    // Add new source and layers
    map.current.addSource('user-location-accuracy', {
      type: 'geojson',
      data: {
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: location,
        },
        properties: {
          accuracy: accuracy,
        },
      },
    });

    map.current.addLayer({
      id: 'user-location-accuracy-fill',
      type: 'circle',
      source: 'user-location-accuracy',
      paint: {
        'circle-radius': {
          stops: [
            [0, 0],
            [20, accuracy / 2], // Scale the radius appropriately based on zoom level
          ],
          base: 2,
        },
        'circle-color': '#3b82f6',
        'circle-opacity': 0.15,
      },
    });

    map.current.addLayer({
      id: 'user-location-accuracy-border',
      type: 'circle',
      source: 'user-location-accuracy',
      paint: {
        'circle-radius': {
          stops: [
            [0, 0],
            [20, accuracy / 2],
          ],
          base: 2,
        },
        'circle-color': '#3b82f6',
        'circle-opacity': 0,
        'circle-stroke-width': 1,
        'circle-stroke-color': '#3b82f6',
        'circle-stroke-opacity': 0.3,
      },
    });
  };

  const handleZoomIn = () => {
    setZoom((prevZoom) => Math.min(prevZoom + 1, 18));
  };

  const handleZoomOut = () => {
    setZoom((prevZoom) => Math.max(prevZoom - 1, 10));
  };

  const handleLocate = async () => {
    if (!map.current) return;

    if (!position) {
      // Request location permissions if needed
      const status = await requestPermissions();
      if (status.location === 'granted') {
        const newPosition = await getCurrentPosition();
        if (newPosition?.coords) {
          const userLocation: [number, number] = [
            newPosition.coords.longitude,
            newPosition.coords.latitude,
          ];
          map.current.flyTo({
            center: userLocation,
            zoom: 16,
            essential: true,
          });
          setIsFollowingUser(true);
        }
      }
    } else {
      // Toggle following mode
      setIsFollowingUser(!isFollowingUser);

      if (!isFollowingUser) {
        // If turning on following mode, center on user
        const userLocation: [number, number] = [
          position.coords.longitude,
          position.coords.latitude,
        ];
        map.current.flyTo({
          center: userLocation,
          zoom: 16,
          essential: true,
        });

        // Provide haptic feedback on native platforms
        if (Capacitor.isNativePlatform()) {
          await Haptics.impact({ style: ImpactStyle.Light });
        }
      }
    }
  };

  const handleLocateAirport = () => {
    if (map.current) {
      map.current.flyTo({
        center: yyzCoordinates,
        zoom: 14,
        essential: true,
      });
    }
  };

  return (
    <div className="relative w-full h-full bg-muted rounded-lg overflow-hidden">
      {itemCount && (
        <div className="absolute top-4 left-4 bg-background/80 backdrop-blur-sm p-2 rounded-md z-10">
          <h3 className="font-semibold text-foreground">{airportName}</h3>
          <p className="text-xs text-muted-foreground">
            {t('search.map.showing', { count: itemCount })}
          </p>
        </div>
      )}

      {/* Map Controls */}
      <div className="absolute top-4 right-4 flex flex-col gap-2 z-10">
        <button
          className="w-8 h-8 flex items-center justify-center bg-background/80 backdrop-blur-sm rounded-md hover:bg-accent"
          onClick={handleZoomIn}
        >
          <Plus className="w-5 h-5 text-foreground" />
        </button>
        <button
          className="w-8 h-8 flex items-center justify-center bg-background/80 backdrop-blur-sm rounded-md hover:bg-accent"
          onClick={handleZoomOut}
        >
          <Minus className="w-5 h-5 text-foreground" />
        </button>
        <button
          className="w-8 h-8 flex items-center justify-center bg-background/80 backdrop-blur-sm rounded-md hover:bg-accent mt-6"
          onClick={handleLocateAirport}
        >
          <Locate className="w-5 h-5 text-foreground" />
        </button>
      </div>

      {/* Location Button */}
      <button
        className={`absolute bottom-4 right-4 w-10 h-10 flex items-center justify-center rounded-full z-10 ${
          isFollowingUser
            ? 'bg-blue-600 text-white'
            : 'bg-background/80 backdrop-blur-sm hover:bg-accent text-foreground'
        }`}
        onClick={handleLocate}
      >
        <Locate className="w-5 h-5" />
      </button>

      {/* Location Permission Error */}
      {error && (
        <div className="absolute bottom-16 left-4 right-4 bg-red-600/90 text-white p-2 rounded-md z-10 text-sm">
          {t('search.map.locationError')}
        </div>
      )}

      {/* Map Container */}
      <div ref={mapContainer} className="w-full h-full" />
    </div>
  );
}
