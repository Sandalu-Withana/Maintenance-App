import { Check, X } from 'lucide-react';
import { useI18n } from '../../../i18n';
import { useNavigate } from 'react-router-dom';

interface EquipmentPopupProps {
  equipment: {
    id: string;
    type: string;
    distance: string;
    aircraft: string;
    inUse: boolean;
    lastUsed: string;
    certification: {
      verified: boolean;
      name: string;
    };
    classType: string;
  };
  onClose: () => void;
}

export function EquipmentPopup({ equipment, onClose }: EquipmentPopupProps) {
  const { t } = useI18n();
  const navigate = useNavigate();

  const handleReserve = () => {
    navigate(`/equipment/checkout/${equipment.id}`);
  };

  return (
    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[90%] max-w-sm bg-card rounded-lg p-4 z-20 shadow-lg">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold text-card-foreground">
          {equipment.type}
        </h3>
        <button
          onClick={onClose}
          className="w-6 h-6 flex items-center justify-center rounded-full bg-muted hover:bg-accent"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="flex items-center gap-2 mb-4">
        <div className="bg-muted text-muted-foreground px-3 py-1 rounded-md text-sm font-medium">
          {equipment.id}
        </div>
        <div className="bg-blue-500/20 text-blue-500 px-3 py-1 rounded-md text-sm font-medium">
          {equipment.inUse ? 'In Use' : 'Available'}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-y-4 mb-4">
        <div>
          <p className="text-sm text-muted-foreground">Class</p>
          <div className="flex items-center mt-1">
            <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center text-white text-xs font-medium">
              {equipment.classType}
            </div>
          </div>
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Distance</p>
          <p className="font-medium">{equipment.distance}</p>
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Aircraft</p>
          <p className="font-medium">{equipment.aircraft}</p>
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Last Used</p>
          <p className="font-medium">{equipment.lastUsed}</p>
        </div>
      </div>

      {equipment.certification.verified && (
        <div className="bg-green-500/10 rounded-lg p-3 mb-4">
          <div className="flex items-center">
            <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center text-white mr-2">
              <Check className="w-4 h-4" />
            </div>
            <p className="text-green-500 font-medium">Certification Verified</p>
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            {equipment.certification.name}
          </p>
        </div>
      )}

      <button
        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md transition-colors"
        onClick={handleReserve}
      >
        {t('search.equipment.reserve')}
      </button>
    </div>
  );
}
