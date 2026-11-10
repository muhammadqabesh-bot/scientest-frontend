const BASE_URL = "http://localhost:3001";

export async function fetchPayments() {
  const res = await fetch(`${BASE_URL}/payments`);
  if (!res.ok) throw new Error("فشل جلب الدفعات");
  return res.json();
}

export async function addPayment(data) {
  const res = await fetch(`${BASE_URL}/payments`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("فشل تسجيل الدفعة");
  return res.json();
}
