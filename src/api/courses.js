const BASE_URL = "http://localhost:3001";

export async function fetchCourses() {
  const res = await fetch(`${BASE_URL}/courses`);
  if (!res.ok) throw new Error("فشل جلب الدورات");
  return res.json();
}
