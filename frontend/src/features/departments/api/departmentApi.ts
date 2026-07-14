import client from "../../../services/api/client";

export interface Department {
  id: number;

  // Identity
  department_code: string;
  department_name: string;

  // Relationship
  organization_id: number;

  // Optional
  description?: string;

  // System
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface DepartmentCreate {
  department_code: string;
  department_name: string;
  organization_id: number;
  description?: string;
  is_active: boolean;
}

export interface DepartmentUpdate {
  department_code?: string;
  department_name?: string;
  organization_id?: number;
  description?: string;
  is_active?: boolean;
}

const BASE_URL = "/departments";

export const departmentApi = {
  async getAll(): Promise<Department[]> {
    const { data } = await client.get<Department[]>(BASE_URL);
    return data;
  },

  async getById(id: number): Promise<Department> {
    const { data } = await client.get<Department>(`${BASE_URL}/${id}`);
    return data;
  },

  async create(payload: DepartmentCreate): Promise<Department> {
    const { data } = await client.post<Department>(BASE_URL, payload);
    return data;
  },

  async update(
    id: number,
    payload: DepartmentUpdate
  ): Promise<Department> {
    const { data } = await client.put<Department>(
      `${BASE_URL}/${id}`,
      payload
    );

    return data;
  },

  async remove(id: number): Promise<void> {
    await client.delete(`${BASE_URL}/${id}`);
  },
};