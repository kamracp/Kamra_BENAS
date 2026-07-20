import client from "../../../services/api/client";

// ── Types ────────────────────────────────────────────────────────────────────

export interface UtilityBill {
  id: number;
  organization_id: number;
  meter_id: number;
  bill_number?: string;
  billing_period_start: string; // "YYYY-MM-DD"
  billing_period_end: string; // "YYYY-MM-DD"
  consumption: number;
  amount?: number;
  currency: string;
  bill_date?: string;
  due_date?: string;
  document_url?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface UtilityBillCreate {
  meter_id: number;
  bill_number?: string;
  billing_period_start: string;
  billing_period_end: string;
  consumption: number;
  amount?: number;
  currency?: string; // backend defaults to "INR"
  bill_date?: string;
  due_date?: string;
  document_url?: string;
  notes?: string;
}

export interface UtilityBillUpdate {
  // meter_id is NOT updatable — a bill belongs to its meter
  bill_number?: string;
  billing_period_start?: string;
  billing_period_end?: string;
  consumption?: number;
  amount?: number;
  currency?: string;
  bill_date?: string;
  due_date?: string;
  document_url?: string;
  notes?: string;
}

// ── API calls ─────────────────────────────────────────────────────────────────

const BASE_URL = "/utility-bills";

export const utilityBillApi = {
  async getAll(): Promise<UtilityBill[]> {
    const { data } = await client.get<UtilityBill[]>(BASE_URL);
    return data;
  },

  async getByMeter(meterId: number): Promise<UtilityBill[]> {
    const { data } = await client.get<UtilityBill[]>(BASE_URL, {
      params: { meter_id: meterId },
    });
    return data;
  },

  async getById(id: number): Promise<UtilityBill> {
    const { data } = await client.get<UtilityBill>(`${BASE_URL}/${id}`);
    return data;
  },

  async create(payload: UtilityBillCreate): Promise<UtilityBill> {
    const { data } = await client.post<UtilityBill>(BASE_URL, payload);
    return data;
  },

  async update(id: number, payload: UtilityBillUpdate): Promise<UtilityBill> {
    const { data } = await client.put<UtilityBill>(`${BASE_URL}/${id}`, payload);
    return data;
  },

  async remove(id: number): Promise<void> {
    await client.delete(`${BASE_URL}/${id}`);
  },
};
