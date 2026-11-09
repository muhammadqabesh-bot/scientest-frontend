const BASE_URL = "http://localhost:3001";

export async function fetchActivities() {
  const res = await fetch(`${BASE_URL}/activities`);
  if (!res.ok) throw new Error("فشل جلب الأنشطة");
  return res.json();
}
