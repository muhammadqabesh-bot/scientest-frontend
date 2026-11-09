const BASE_URL = "http://localhost:3001";

export async function fetchTeachers() {
  const res = await fetch(`${BASE_URL}/teachers`);
  if (!res.ok) throw new Error("فشل جلب اسماء المعلمين ");
  return res.json();
}

export async function addTeacher(data) {
  const res = await fetch(`${BASE_URL}/teachers`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("تم فشل اضافة معلم");
  return res.json();
}
