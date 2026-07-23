import client from "../../../services/api/client";

export interface Floor {
  id: number;
  organization_id: number;
  building_id: number;
  floor_code: string;
  floor_name: string;
  floor_number: number;
  gross_area_sqm?: number;
  conditioned_area_sqm?: number;
  clear_height_m?: number;
  occupancy_capacity?: number;
  remarks?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface FloorCreate {
  building_id: number;
  floor_code: string;
  floor_name: string;
  floor_number: number;
  gross_area_sqm?: number;
  conditioned_area_sqm?: number;
  clear_height_m?: number;
  occupancy_capacity?: number;
  remarks?: string;
  is_active?: boolean;
}

export interface FloorUpdate {
  floor_code?: string;
  floor_name?: string;
  floor_number?: number;
  gross_area_sqm?: number;
  conditioned_area_sqm?: number;
  clear_height_m?: number;
  occupancy_capacity?: number;
  remarks?: string;
  is_active?: boolean;
}

export const floorApi = {
  getAll: async (buildingId?: number): Promise<Floor[]> => {
    const response = await client.get<Floor[]>("/floors/", {
      params: buildingId ? { building_id: buildingId } : undefined,
    });
    return response.data;
  },
  create: async (data: FloorCreate): Promise<Floor> => {
    const response = await client.post<Floor>("/floors/", data);
    return response.data;
  },
  update: async (id: number, data: FloorUpdate): Promise<Floor> => {
    const response = await client.put<Floor>(`/floors/${id}`, data);
    return response.data;
  },
  remove: async (id: number): Promise<void> => {
    await client.delete(`/floors/${id}`);
  },
};

export default floorApi;