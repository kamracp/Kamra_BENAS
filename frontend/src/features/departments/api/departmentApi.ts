import client from "../../../services/api/client";

export interface Department {
  id: number;
  organization_id: number;
  department_code: string;
  department_name: string;
  description?: string;
  hod_name?: string;
  email?: string;
  phone?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface DepartmentCreate {
  organization_id: number;
  department_code: string;
  department_name: string;
  description?: string;
  hod_name?: string;
  email?: string;
  phone?: string;
  is_active?: boolean;
}

export interface DepartmentUpdate
  extends Partial<DepartmentCreate> {}

const API_URL = "/departments";

export const departmentApi = {
  getAll: async (): Promise<Department[]> => {
    const response = await client.get(API_URL);
    return response.data;
  },

  getById: async (id: number): Promise<Department> => {
    const response = await client.get(`${API_URL}/${id}`);
    return response.data;
  },

  create: async (
    data: DepartmentCreate
  ): Promise<Department> => {
    const response = await client.post(API_URL, data);
    return response.data;
  },

  update: async (
    id: number,
    data: DepartmentUpdate
  ): Promise<Department> => {
    const response = await client.put(`${API_URL}/${id}`, data);
    return response.data;
  },

  remove: async (id: number): Promise<void> => {
    await client.delete(`${API_URL}/${id}`);
  },
};

export default departmentApi;