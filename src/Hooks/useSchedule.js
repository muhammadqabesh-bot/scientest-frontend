import { useQuery } from "@tanstack/react-query";
import { fetchSchedule } from "../api/schedule";

export function useSchedule(day) {
  return useQuery({
    queryKey: ["schedule", day],
    queryFn: () => fetchSchedule(day),
  });
}
