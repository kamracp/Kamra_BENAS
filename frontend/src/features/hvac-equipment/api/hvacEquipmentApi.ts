import client from "../../../services/api/client";

export interface HvacEquipment {
  id: number;
  organization_id: number;
  building_id: number;
  equipment_code: string;
  equipment_name: string;
  equipment_type: string;
  capacity_kw: number;
  cop: number;
  operating_hours_per_day: number;
  operating_days_per_month: number;
  manufacturer?: string;
  installation_year?: number;
  is_active: boolean;
  estimated_monthly_energy_kwh: number;
  created_at: string;
  updated_at: string;
}

export interface HvacEquipmentCreate {
  building_id: number;
  equipment_code: string;
  equipment_name: string;
  equipment_type: string;
  capacity_kw: number;
  cop: number;
  operating_hours_per_day: number;
  operating_days_per_month?: number;
  manufacturer?: string;
  installation_year?: number;
  is_active?: boolean;
}

export interface HvacEquipmentUpdate {
  building_id?: number;
  equipment_code?: string;
  equipment_name?: string;
  equipment_type?: string;
  capacity_kw?: number;
  cop?: number;
  operating_hours_per_day?: number;
  operating_days_per_month?: number;
  manufacturer?: string;
  installation_year?: number;
  is_active?: boolean;
}

export const hvacEquipmentApi = {
  getAll: async (buildingId?: number): Promise<HvacEquipment[]> => {
    const response = await client.get<HvacEquipment[]>("/hvac-equipment/", {
      params: buildingId ? { building_id: buildingId } : undefined,
    });
    return response.data;
  },
  getById: async (id: number): Promise<HvacEquipment> => {
    const response = await client.get<HvacEquipment>(`/hvac-equipment/${id}`);
    return response.data;
  },
  create: async (data: HvacEquipmentCreate): Promise<HvacEquipment> => {
    const response = await client.post<HvacEquipment>("/hvac-equipment/", data);
    return response.data;
  },
  update: async (id: number, data: HvacEquipmentUpdate): Promise<HvacEquipment> => {
    const response = await client.put<HvacEquipment>(`/hvac-equipment/${id}`, data);
    return response.data;
  },
  remove: async (id: number): Promise<void> => {
    await client.delete(`/hvac-equipment/${id}`);
  },
};

export default hvacEquipmentApi;
