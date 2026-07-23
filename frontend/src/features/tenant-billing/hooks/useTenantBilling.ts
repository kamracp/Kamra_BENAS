import { useQuery } from "@tanstack/react-query";
import tenantBillingApi, {
  type OccupantBillingResult,
} from "../api/tenantBillingApi";

export function useTenantBilling(floorId?: number, billingMonth?: string) {
  return useQuery<OccupantBillingResult[]>({
    queryKey: ["tenant-billing", floorId ?? "none", billingMonth ?? "current"],
    queryFn: () =>
      tenantBillingApi.getFloorBilling(floorId as number, billingMonth),
    enabled: !!floorId,
    staleTime: 2 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
}