import client from "../../../services/api/client";

export interface Organization {
  id: number;

  // Identity
  organization_code: string;
  organization_name: string;
  legal_name?: string;

  // Business
  industry?: string;
  gstin?: string;
  pan?: string;

  // Contact
  email?: string;
  phone?: string;
  website?: string;

  // Address
  address_line_1?: string;
  address_line_2?: string;
  city?: string;
  state?: string;
  country?: string;
  pincode?: string;

  // Regional
  timezone?: string;
  currency?: string;

  // System
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface OrganizationCreate {
  organization_code: string;
  organization_name: string;
  legal_name?: string;

  industry?: string;
  gstin?: string;
  pan?: string;

  email?: string;
  phone?: string;
  website?: string;

  address_line_1?: string;
  address_line_2?: string;
  city?: string;
  state?: string;
  country?: string;
  pincode?: string;

  timezone?: string;
  currency?: string;

  is_active?: boolean;
}

export interface OrganizationUpdate
  extends Partial<OrganizationCreate> {}

const API_URL = "/organizations";

export const organizationApi = {
  getAll: async (): Promise<Organization[]> => {
    const response = await client.get(API_URL);
    return response.data;
  },

  getById: async (
    id: number
  ): Promise<Organization> => {
    const response = await client.get(
      `${API_URL}/${id}`
    );

    return response.data;
  },

  create: async (
    data: OrganizationCreate
  ): Promise<Organization> => {
    const response = await client.post(
      API_URL,
      data
    );

    return response.data;
  },

  update: async (
    id: number,
    data: OrganizationUpdate
  ): Promise<Organization> => {
    const response = await client.put(
      `${API_URL}/${id}`,
      data
    );

    return response.data;
  },

  remove: async (
    id: number
  ): Promise<void> => {
    await client.delete(
      `${API_URL}/${id}`
    );
  },
};

export default organizationApi;