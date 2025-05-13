import { EquipmentListItem } from './EquipmentListItem';

interface Equipment {
  id: string;
  type: string;
  distance: string;
  aircraft: string;
  powerType: string;
  available: boolean;
}

interface EquipmentListProps {
  equipment: Equipment[];
  onReserve: (id: string) => void;
}

export function EquipmentList({ equipment, onReserve }: EquipmentListProps) {
  return (
    <div className="space-y-4 last:mb-6">
      {equipment.map((item) => (
        <EquipmentListItem
          key={item.id}
          id={item.id}
          type={item.type}
          distance={item.distance}
          aircraft={item.aircraft}
          powerType={item.powerType}
          available={item.available}
          onReserve={onReserve}
        />
      ))}
    </div>
  );
}
