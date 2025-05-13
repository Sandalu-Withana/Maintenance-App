import { useState } from 'react';
import { ToggleSwitch } from './components/ToogleSwitch';
import { SearchBar } from './components/SearchBar';
import { Dropdown } from './components/Dropdown';
import { ViewToggle } from './components/ViewToggle';
import { AirportMap } from './components/AirportMap';
import { EquipmentList } from './components/EquipmentList';
import { useI18n } from '../../i18n';

// Mock data for equipment markers on the map
const mockMapMarkers = [
  {
    id: 'ATF-0023',
    type: 'PT',
    position: [-79.6248, 43.6777] as [number, number],
    color: '#3b82f6',
  },
  {
    id: 'ATF-0024',
    type: 'PT',
    position: [-79.6228, 43.6797] as [number, number],
    color: '#3b82f6',
  },
  {
    id: 'BTF-0012',
    type: 'BT',
    position: [-79.6208, 43.6757] as [number, number],
    color: '#10b981',
  },
  {
    id: 'LDF-0008',
    type: 'LD',
    position: [-79.6268, 43.6747] as [number, number],
    color: '#06b6d4',
  },
  {
    id: 'FTF-0005',
    type: 'FT',
    position: [-79.6288, 43.6787] as [number, number],
    color: '#f59e0b',
  },
  {
    id: 'GSF-0019',
    type: 'GS',
    position: [-79.6218, 43.6767] as [number, number],
    color: '#8b5cf6',
  },
];

// Mock data for equipment list
const mockEquipment = [
  {
    id: 'ATF-0023',
    type: 'Pushback Tractor',
    distance: '85m',
    aircraft: 'Narrow & Wide Body (except 777)',
    powerType: 'Powered',
    available: false,
  },
  {
    id: 'ATF-0024',
    type: 'Pushback Tractor',
    distance: '95m',
    aircraft: 'Boeing 777 Only',
    powerType: 'Powered',
    available: true,
  },
  {
    id: 'BTF-0012',
    type: 'Baggage Tractor',
    distance: '120m',
    aircraft: 'All Aircraft',
    powerType: 'Powered',
    available: true,
  },
];

export default function EquipmentSearchPage() {
  const { t } = useI18n();
  const [searchQuery, setSearchQuery] = useState('');
  const [showInUse, setShowInUse] = useState(false);
  const [equipmentFilter, setEquipmentFilter] = useState(
    t('search.filters.allEquipment')
  );
  const [aircraftFilter, setAircraftFilter] = useState(
    t('search.filters.allAircraft')
  );
  const [activeView, setActiveView] = useState<'map' | 'list'>('map');

  const equipmentOptions = [
    t('search.filters.allEquipment'),
    'Baggage Tractors',
    'Pushback Tractors',
    'Loaders',
    'Fuel Trucks',
  ];
  const aircraftOptions = [
    t('search.filters.allAircraft'),
    'Boeing 737',
    'Boeing 777',
    'Airbus A320',
    'Airbus A350',
  ];

  const handleReserve = (id: string) => {
    console.log(`Reserved equipment: ${id}`);
    // Implement reservation logic here
  };

  return (
    <div className="flex flex-col h-full bg-background text-foreground">
      <main className="flex flex-col flex-1 overflow-hidden px-4 pt-4 pb-0">
        <div className="sticky top-0 z-10 mb-4 space-y-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold">{t('search.title')}</h1>
            <ToggleSwitch
              checked={showInUse}
              onChange={setShowInUse}
              label={t('search.showInUse')}
            />
          </div>

          <div>
            <SearchBar
              value={searchQuery}
              onChange={setSearchQuery}
              placeholder={t('search.searchPlaceholder')}
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <Dropdown
              options={equipmentOptions}
              selected={equipmentFilter}
              onSelect={setEquipmentFilter}
            />
            <Dropdown
              options={aircraftOptions}
              selected={aircraftFilter}
              onSelect={setAircraftFilter}
            />
          </div>

          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              {t('search.found', { count: mockEquipment.length })}
            </p>
            <ViewToggle activeView={activeView} onViewChange={setActiveView} />
          </div>
        </div>
        <div className="flex-1 overflow-auto">
          {activeView === 'map' ? (
            <div className="h-full pb-6">
              <AirportMap
                airportName={t('search.map.title')}
                markers={mockMapMarkers}
                itemCount={mockEquipment.length}
              />
            </div>
          ) : (
            <EquipmentList
              equipment={mockEquipment}
              onReserve={handleReserve}
            />
          )}
        </div>
      </main>
    </div>
  );
}
