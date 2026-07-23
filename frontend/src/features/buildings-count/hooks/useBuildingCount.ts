import { useQuery } from "@tanstack/react-query";
import { buildingCountApi } from "../api/buildingCountApi";

export function useBuildingCount() {
  return useQuery({
    queryKey: ["building-count"],
    queryFn: buildingCountApi.getCount,
  });
}
