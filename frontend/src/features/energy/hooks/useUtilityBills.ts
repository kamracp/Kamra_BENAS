import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import axios from "axios";
import {
  utilityBillApi,
  type UtilityBill,
  type UtilityBillCreate,
  type UtilityBillUpdate,
} from "../api/utilityBillApi";

const QUERY_KEY = ["utility-bills"];

// ── Queries ───────────────────────────────────────────────────────────────────

export function useUtilityBills() {
  return useQuery({
    queryKey: QUERY_KEY,
    queryFn: utilityBillApi.getAll,
  });
}

export function useUtilityBillsByMeter(meterId: number) {
  return useQuery({
    queryKey: [...QUERY_KEY, "meter", meterId],
    queryFn: () => utilityBillApi.getByMeter(meterId),
    enabled: !!meterId,
  });
}

export function useUtilityBill(id: number) {
  return useQuery({
    queryKey: [...QUERY_KEY, id],
    queryFn: () => utilityBillApi.getById(id),
    enabled: !!id,
  });
}

// ── Mutations ─────────────────────────────────────────────────────────────────

function getErrorMessage(error: unknown, fallback: string): string {
  if (axios.isAxiosError(error)) {
    const detail = error.response?.data?.detail;
    if (typeof detail === "string") return detail;
  }
  return fallback;
}

export function useCreateUtilityBill() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: UtilityBillCreate) =>
      utilityBillApi.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY });
      toast.success("Utility bill created successfully.");
    },
    onError: (error) => {
      toast.error(
        getErrorMessage(error, "Failed to create utility bill.")
      );
    },
  });
}

export function useUpdateUtilityBill() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UtilityBillUpdate }) =>
      utilityBillApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY });
      toast.success("Utility bill updated successfully.");
    },
    onError: (error) => {
      toast.error(
        getErrorMessage(error, "Failed to update utility bill.")
      );
    },
  });
}

export function useDeleteUtilityBill() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => utilityBillApi.remove(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY });
      toast.success("Utility bill deleted successfully.");
    },
    onError: (error) => {
      toast.error(
        getErrorMessage(error, "Failed to delete utility bill.")
      );
    },
  });
}

// ── Re-exports ────────────────────────────────────────────────────────────────

export type { UtilityBill, UtilityBillCreate, UtilityBillUpdate };
