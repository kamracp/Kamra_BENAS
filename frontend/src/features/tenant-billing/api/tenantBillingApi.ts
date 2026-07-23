import client from "../../../services/api/client";

export interface OccupantBillingResult {
  occupant_id: number;
  occupant_name: string;
  office_area_sqft: number;
  billing_month: string;
  component_a_kwh: number;
  component_b_kwh: number;
  total_kwh: number;
}

export const tenantBillingApi = {
  getFloorBilling: async (
    floorId: number,
    billingMonth?: string
  ): Promise<OccupantBillingResult[]> => {
    const response = await client.get<OccupantBillingResult[]>(
      `/tenant-billing/floor/${floorId}`,
      {
        params: billingMonth ? { billing_month: billingMonth } : undefined,
      }
    );
    return response.data;
  },
};

export default tenantBillingApi;