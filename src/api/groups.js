const BASE_URL = "http://localhost:3001";

export async function fetchGroups() {
  const res = await fetch(`${BASE_URL}/groups`);
  if (!res.ok) throw new Error("فشل جلب الدفعات");
  return res.json();
}
