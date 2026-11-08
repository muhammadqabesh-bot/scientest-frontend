const BASE_URL = "http://localhost:3001";

export async function fetchSchedule(day) {
  const res = await fetch(`${BASE_URL}/schedule?day=${day}`);
  if (!res.ok) throw new Error("فشل جلب الجدول");
  return res.json();
}
