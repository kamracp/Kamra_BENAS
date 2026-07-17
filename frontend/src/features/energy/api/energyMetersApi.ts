import client from "../../../services/api/client";

// ── Types ────────────────────────────────────────────────────────────────────

export type MeterType =
  | "electricity"
  | "diesel"
  | "natural_gas"
  | "lpg"
  | "water"
  | "solar_generation"
  | "other";

export type MeterUnit =
  | "kWh"
  | "litres"
  | "kg"
  | "SCM"
  | "m3"
  | "MMBtu"
  | "other";

export interface EnergyMeter {
  id: number;
  organization_id: number;
  building_id: number;
  meter_code: string;
  meter_name: string;
  meter_type: MeterType;
  unit: MeterUnit;
  utility_meter_number?: string;
  utility_provider?: string;
  description?: string;
  is_active: boolean;
  scope: string; // auto-derived by backend (e.g. "scope_2")
  created_at: string;
  updated_at: string;
}

export interface EnergyMeterCreate {
  building_id: number;
  meter_code: string;
  meter_name: string;
  meter_type: MeterType;
  unit: MeterUnit;
  utility_meter_number?: string;
  utility_provider?: string;
  description?: string;
  is_active: boolean;
}

export interface EnergyMeterUpdate {
  building_id?: number;
  meter_code?: string;
  meter_name?: string;
  meter_type?: MeterType;
  unit?: MeterUnit;
  utility_meter_number?: string;
  utility_provider?: string;
  description?: string;
  is_active?: boolean;
}

// ── API calls ─────────────────────────────────────────────────────────────────

const BASE_URL = "/energy-meters";

export const energyMeterApi = {
  async getAll(): Promise<EnergyMeter[]> {
    const { data } = await client.get<EnergyMeter[]>(BASE_URL);
    return data;
  },

  async getByBuilding(buildingId: number): Promise<EnergyMeter[]> {
    const { data } = await client.get<EnergyMeter[]>(BASE_URL, {
      params: { building_id: buildingId },
    });
    return data;
  },

  async getById(id: number): Promise<EnergyMeter> {
    const { data } = await client.get<EnergyMeter>(`${BASE_URL}/${id}`);
    return data;
  },

  async create(payload: EnergyMeterCreate): Promise<EnergyMeter> {
    const { data } = await client.post<EnergyMeter>(BASE_URL, payload);
    return data;
  },

  async update(id: number, payload: EnergyMeterUpdate): Promise<EnergyMeter> {
    const { data } = await client.put<EnergyMeter>(
      `${BASE_URL}/${id}`,
      payload
    );
    return data;
  },

  async remove(id: number): Promise<void> {
    await client.delete(`${BASE_URL}/${id}`);
  },
};