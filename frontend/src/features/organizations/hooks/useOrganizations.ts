import {
  useQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import organizationApi from "../api/organizationApi";

import type {
  OrganizationCreate,
  OrganizationUpdate,
} from "../api/organizationApi";

const QUERY_KEY = ["organizations"];

export function useOrganizations() {
  return useQuery({
    queryKey: QUERY_KEY,
    queryFn: organizationApi.getAll,
  });
}

export function useCreateOrganization() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: OrganizationCreate) =>
      organizationApi.create(data),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: QUERY_KEY,
      });
    },
  });
}

export function useUpdateOrganization() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: number;
      data: OrganizationUpdate;
    }) => organizationApi.update(id, data),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: QUERY_KEY,
      });
    },
  });
}

export function useDeleteOrganization() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: organizationApi.remove,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: QUERY_KEY,
      });
    },
  });
}