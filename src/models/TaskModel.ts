export interface Equipment {
  id: number;
  serial_number: string;
  model: string;
  manufacturer: string;
  type_name: string;
  equipment_class: string;
  is_powered: boolean;
}

export interface Terminal {
  id: number;
  name: string;
  location: string;
}

export interface TaskModel {
  id: number;
  equipment_id: number;
  maintenance_type: string;
  description: string;
  assigned_by: number;
  assigned_to: number;
  status: string;
  priority: string;
  type: string;
  start_time: string;
  end_time: string;
  actual_start_time: string | null;
  actual_parked_time: string | null;
  actual_end_time: string | null;
  created_at: string;
  updated_at: string;
  equipment: Equipment;
  terminal: Terminal;
}
