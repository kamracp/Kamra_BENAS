import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import axios from "axios";
import {
  energyMeterApi,
  type EnergyMeter,
  type EnergyMeterCreate,
  type EnergyMeterUpdate,
} from "../api/energyMeterApi";

const QUERY_KEY = ["energy-meters"];

// ── Queries ───────────────────────────────────────────────────────────────────

export function useEnergyMeters() {
  return useQuery({
    queryKey: QUERY_KEY,
    queryFn: energyMeterApi.getAll,
  });
}

export function useEnergyMetersByBuilding(buildingId: number) {
  return useQuery({
    queryKey: [...QUERY_KEY, "building", buildingId],
    queryFn: () => energyMeterApi.getByBuilding(buildingId),
    enabled: !!buildingId,
  });
}

export function useEnergyMeter(id: number) {
  return useQuery({
    queryKey: [...QUERY_KEY, id],
    queryFn: () => energyMeterApi.getById(id),
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

export function useCreateEnergyMeter() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: EnergyMeterCreate) =>
      energyMeterApi.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY });
      toast.success("Energy meter created successfully.");
    },
    onError: (error) => {
      toast.error(
        getErrorMessage(error, "Failed to create energy meter.")
      );
    },
  });
}

export function useUpdateEnergyMeter() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: EnergyMeterUpdate }) =>
      energyMeterApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY });
      toast.success("Energy meter updated successfully.");
    },
    onError: (error) => {
      toast.error(
        getErrorMessage(error, "Failed to update energy meter.")
      );
    },
  });
}

export function useDeleteEnergyMeter() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => energyMeterApi.remove(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY });
      toast.success("Energy meter deleted successfully.");
    },
    onError: (error) => {
      toast.error(
        getErrorMessage(error, "Failed to delete energy meter.")
      );
    },
  });
}

// ── Re-exports ────────────────────────────────────────────────────────────────

export type { EnergyMeter, EnergyMeterCreate, EnergyMeterUpdate };