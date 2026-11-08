const BASE_URL = "http://localhost:3001";

export async function fetchTeachers() {
  const res = await fetch(`${BASE_URL}/teachers`);
  if (!res.ok) throw new Error("فشل جلب اسماء المعلمين ");
  return res.json();
}
