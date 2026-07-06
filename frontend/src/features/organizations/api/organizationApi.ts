import client from "../../../services/api/client";

export interface Organization {
  id: number;
  organization_code: string;
  organization_name: string;
  legal_name: string;
  gstin: string;
  pan: string;
  email: string;
  phone: string;
  website?: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  pincode?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface OrganizationCreate {
  organization_code: string;
  organization_name: string;
  legal_name: string;
  gstin: string;
  pan: string;
  email: string;
  phone: string;
  website?: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  pincode?: string;
}

export interface OrganizationUpdate
  extends Partial<OrganizationCreate> {}

// इसे बदलकर अंत में स्लैश लगा दें
const API_BASE_URL = 'http://localhost:8000/api/v1/organizations/';

export const organizationApi = {
  getAll: async (): Promise<Organization[]> => {
    const response = await client.get(API_URL);
    return response.data;
  },

  getById: async (id: number): Promise<Organization> => {
    const response = await client.get(`${API_URL}/${id}`);
    return response.data;
  },

  create: async (
    data: OrganizationCreate
  ): Promise<Organization> => {
    const response = await client.post(API_URL, data);
    return response.data;
  },

  update: async (
    id: number,
    data: OrganizationUpdate
  ): Promise<Organization> => {
    const response = await client.put(`${API_URL}/${id}`, data);
    return response.data;
  },

  remove: async (id: number): Promise<void> => {
    await client.delete(`${API_URL}/${id}`);
  },
};

export default organizationApi;