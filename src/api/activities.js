const BASE_URL = "http://localhost:3001";

export async function fetchActivities() {
  const res = await fetch(`${BASE_URL}/activities`);
  if (!res.ok) throw new Error("فشل جلب الأنشطة");
  return res.json();
}

export async function addActivity(data) {
  const res = await fetch(`${BASE_URL}/activities`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("تعذر تسجيل النشاط");
  return res.json();
}
