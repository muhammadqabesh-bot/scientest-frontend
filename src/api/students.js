const BASE_URL = "http://localhost:3001";

export async function fetchStudents() {
  const res = await fetch(`${BASE_URL}/students`);

  if (!res.ok) throw new Error("فشل جلب البيامات");
  return res.json();
}

export async function AddStudent(data) {
  const res = await fetch(`${BASE_URL}/students`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!res.ok) throw new Error("فشل تسجيل الطالب");
  return res.json();
}
