import { useQuery } from "@tanstack/react-query";
import { fetchTeachers } from "../api/teachers";

export function useTeachers() {
  return useQuery({ queryKey: ["teaches"], queryFn: fetchTeachers });
}
