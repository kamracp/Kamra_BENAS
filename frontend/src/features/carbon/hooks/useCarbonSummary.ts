import { useQuery } from "@tanstack/react-query";
import { carbonApi } from "../api/carbonApi";

export function useCarbonSummary() {
  return useQuery({
    queryKey: ["carbon-summary"],
    queryFn: carbonApi.getSummary,
  });
}
