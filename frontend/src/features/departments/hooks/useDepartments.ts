import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

import departmentApi, {
  type Department,
  type DepartmentCreate,
  type DepartmentUpdate,
} from "../api/departmentApi";

const QUERY_KEY = ["departments"] as const;

export function useDepartments() {
  return useQuery<Department[]>({
    queryKey: QUERY_KEY,
    queryFn: departmentApi.getAll,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
}

export function useDepartment(id?: number) {
  return useQuery<Department>({
    queryKey: [...QUERY_KEY, id],
    queryFn: () => departmentApi.getById(id as number),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });
}

export function useCreateDepartment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: DepartmentCreate) =>
      departmentApi.create(data),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: QUERY_KEY,
      });

      toast.success("Department created successfully.");
    },

    onError: (error: any) => {
      toast.error(
        error?.response?.data?.detail ??
          "Failed to create department."
      );
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

    onError: (error: any) => {
      toast.error(
        error?.response?.data?.detail ??
          "Failed to update department."
      );
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

    onError: (error: any) => {
      toast.error(
        error?.response?.data?.detail ??
          "Failed to delete department."
      );
    },
  });
}

export function useRefreshDepartments() {
  const queryClient = useQueryClient();

  return () =>
    queryClient.invalidateQueries({
      queryKey: QUERY_KEY,
    });
}

export function useDepartmentCache() {
  const queryClient = useQueryClient();

  return {
    getAll: () =>
      queryClient.getQueryData<Department[]>(QUERY_KEY),

    setAll: (departments: Department[]) =>
      queryClient.setQueryData(QUERY_KEY, departments),

    clear: () =>
      queryClient.removeQueries({
        queryKey: QUERY_KEY,
      }),
  };
}