import client from "../../../services/api/client";

export interface ProductionRecord {
  id: number;
  organization_id: number;
  manufacturing_unit_id: number;
  period_start: string;
  period_end: string;
  production_quantity: number;
  production_unit: string;
  remarks?: string;
}

export interface ProductionRecordCreate {
  manufacturing_unit_id: number;
  period_start: string;
  period_end: string;
  production_quantity: number;
  production_unit: string;
  remarks?: string;
}

export interface ProductionRecordUpdate {
  manufacturing_unit_id?: number;
  period_start?: string;
  period_end?: string;
  production_quantity?: number;
  production_unit?: string;
  remarks?: string;
}

export const productionRecordApi = {
  getAll: async (manufacturingUnitId?: number): Promise<ProductionRecord[]> => {
    const response = await client.get<ProductionRecord[]>("/production-records/", {
      params: manufacturingUnitId ? { manufacturing_unit_id: manufacturingUnitId } : undefined,
    });
    return response.data;
  },
  getById: async (id: number): Promise<ProductionRecord> => {
    const response = await client.get<ProductionRecord>(`/production-records/${id}`);
    return response.data;
  },
  create: async (data: ProductionRecordCreate): Promise<ProductionRecord> => {
    const response = await client.post<ProductionRecord>("/production-records/", data);
    return response.data;
  },
  update: async (id: number, data: ProductionRecordUpdate): Promise<ProductionRecord> => {
    const response = await client.put<ProductionRecord>(`/production-records/${id}`, data);
    return response.data;
  },
  remove: async (id: number): Promise<void> => {
    await client.delete(`/production-records/${id}`);
  },
};

export default productionRecordApi;
