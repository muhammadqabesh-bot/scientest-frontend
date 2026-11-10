const BASE_URL = "http://localhost:3001";

export async function fetchCourses() {
  const res = await fetch(`${BASE_URL}/courses`);
  if (!res.ok) throw new Error("فشل جلب الدورات");
  return res.json();
}

export async function fetchCourse(id) {
  const res = await fetch(`${BASE_URL}/courses/${id}`);
  if (!res.ok) throw new Error("فشل جلب الدورة");
  return res.json();
}

export async function addCourse(data) {
  const res = await fetch(`${BASE_URL}/courses`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("فشل إضافة الدورة");
  return res.json();
}

export async function updateCourse(id, data) {
  const res = await fetch(`${BASE_URL}/courses/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("فشل تعديل الدورة");
  return res.json();
}

export async function deleteCourse(id) {
  const res = await fetch(`${BASE_URL}/courses/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error("فشل حذف الدورة");
  return res.json();
}