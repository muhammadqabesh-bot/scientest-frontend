import { useQuery } from "@tanstack/react-query";
import { fetchPayments } from "../api/payments";

export function usePayments(day) {
  return useQuery({
    queryKey: ["payments"],
    queryFn: fetchPayments,
  });
}
