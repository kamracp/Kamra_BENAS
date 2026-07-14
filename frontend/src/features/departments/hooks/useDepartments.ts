import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

import {
  departmentApi,
  type Department,
  type DepartmentCreate,
  type DepartmentUpdate,
} from "../api/departmentApi";

const QUERY_KEY = ["departments"];

export function useDepartments() {
  return useQuery({
    queryKey: QUERY_KEY,
    queryFn: departmentApi.getAll,
  });
}

export function useDepartment(id: number) {
  return useQuery({
    queryKey: [...QUERY_KEY, id],
    queryFn: () => departmentApi.getById(id),
    enabled: !!id,
  });
}

export function useCreateDepartment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: DepartmentCreate) =>
      departmentApi.create(payload),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: QUERY_KEY,
      });

      toast.success("Department created successfully.");
    },

    onError: () => {
      toast.error("Failed to create department.");
    },
  });
}

export function useUpdateDepartment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: number;
      data: DepartmentUpdate;
    }) => departmentApi.update(id, data),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: QUERY_KEY,
      });

      toast.success("Department updated successfully.");
    },

    onError: () => {
      toast.error("Failed to update department.");
    },
  });
}

export function useDeleteDepartment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) =>
      departmentApi.remove(id),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: QUERY_KEY,
      });

      toast.success("Department deleted successfully.");
    },

    onError: () => {
      toast.error("Failed to delete department.");
    },
  });
}

export type {
  Department,
  DepartmentCreate,
  DepartmentUpdate,
};