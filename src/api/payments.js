const BASE_URL = "http://localhost:3001";

export async function fetchPayments() {
  const res = await fetch(`${BASE_URL}/payments`);
  if (!res.ok) throw new Error("فشل جلب الدفعات");
  return res.json();
}
