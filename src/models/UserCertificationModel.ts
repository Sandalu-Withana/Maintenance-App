export interface UserCertificationModel {
  user_id: number;
  certification_id: number;
  issue_date: string;
  expiration_date: string;
  status: 'active' | 'inactive' | 'expired';
  station_code: string;
  last_status_update: string;
  id: number;
  certification_name: string;
  certification_description: string;
  certification_type: string;
}
