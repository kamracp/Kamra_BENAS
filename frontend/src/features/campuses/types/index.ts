export interface Campus {
  id: number;              // बैकएंड से सिंक करने के लिए इसे हमने Integer (number) रखा है
  organization_id: number; // यह भी ऑर्गनाइजेशन की ID से मैच करेगा
  name: string;
  code: string;
  location?: string;
  description?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface CampusCreateInput {
  organization_id: number;
  name: string;
  code: string;
  location?: string;
  description?: string;
  is_active?: boolean;
}

export interface CampusUpdateInput {
  name?: string;
  code?: string;
  location?: string;
  description?: string;
  is_active?: boolean;
}