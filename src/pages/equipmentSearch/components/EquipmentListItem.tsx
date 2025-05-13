import { Check } from 'lucide-react';
import { useI18n } from '../../../i18n';
import { useNavigate } from 'react-router-dom';

interface EquipmentListItemProps {
  id: string;
  type: string;
  distance: string;
  aircraft: string;
  powerType: string;
  available: boolean;
  onReserve?: (id: string) => void;
}

export function EquipmentListItem({
  id,
  type,
  distance,
  aircraft,
  powerType,
  available,
}: EquipmentListItemProps) {
  const { t } = useI18n();
  const navigate = useNavigate();

  const handleReserve = () => {
    navigate(`/equipment/checkout/${id}`);
  };

  return (
    <div className="bg-card rounded-lg p-4 mb-4">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center">
          <h3 className="text-lg font-semibold mr-2">{type}</h3>
          <div className="w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center text-white text-sm font-medium mr-2">
            A
          </div>
          {available && (
            <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center text-white">
              <Check className="w-4 h-4" />
            </div>
          )}
        </div>
        <div className="bg-input text-secondary-foreground px-3 py-1 rounded-full text-sm">
          {available
            ? t('search.equipment.available')
            : t('search.equipment.inUse')}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-y-2 mb-4">
        <div>
          <p className="text-sm text-muted-foreground">
            {t('search.equipment.id')}
          </p>
          <p className="font-medium">{id}</p>
        </div>
        <div>
          <p className="text-sm text-muted-foreground">
            {t('search.equipment.distance')}
          </p>
          <p className="font-medium">{distance}</p>
        </div>
        <div>
          <p className="text-sm text-muted-foreground">
            {t('search.equipment.aircraft')}
          </p>
          <p className="font-medium">{aircraft}</p>
        </div>
        <div>
          <p className="text-sm text-muted-foreground">
            {t('search.equipment.powerType')}
          </p>
          <p className="font-medium">{powerType}</p>
        </div>
      </div>

      <button
        className="w-full bg-[#4285f4] hover:bg-[#357ae8] text-white py-2 rounded-full transition-colors font-semibold disabled:opacity-60"
        disabled={!available}
        onClick={handleReserve}
      >
        {t('search.equipment.reserve')}
      </button>
    </div>
  );
}
