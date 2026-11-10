import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { addPayment } from "../api/payments";
import { addActivity } from "../api/activities";
import { fetchStudents } from "../api/students";

const initialForm = {
  studentId: "",
  amount: "",
  date: new Date(Date.now() - new Date().getTimezoneOffset() * 60000)
    .toISOString()
    .slice(0, 10),
  note: "",
};

const AddPaymentForm = ({ onClose }) => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();

  const [form, setForm] = useState(initialForm);
  const [paymentCreated, setPaymentCreated] = useState(false);

  const { data: students = [] } = useQuery({
    queryKey: ["students"],
    queryFn: fetchStudents,
  });

  const refreshLists = () => {
    queryClient.invalidateQueries({ queryKey: ["payments"] });
    queryClient.invalidateQueries({ queryKey: ["students"] });
    queryClient.invalidateQueries({ queryKey: ["activities"] });
  };

  const mutation = useMutation({
    mutationFn: async (data) => {
      const payment = await addPayment({ ...data, amount: Number(data.amount) });

      try {
        await addActivity({
          type: "paymentRecorded",
          paymentId: payment.id,
          studentId: payment.studentId,
          createdAt: new Date().toISOString(),
        });
      } catch (cause) {
        const error = new Error(t("forms.payment.activityError"), { cause });
        error.paymentCreated = true;
        throw error;
      }

      return payment;
    },
    onSuccess: () => {
      refreshLists();
      setForm(initialForm);
      onClose();
    },
    onError: (error) => {
      if (error.paymentCreated) {
        setPaymentCreated(true);
        refreshLists();
      }
    },
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    mutation.mutate(form);
  };

  const inputClass =
    "w-full rounded-xl border border-border-subtle bg-surface px-3 py-2 text-sm text-text-primary outline-none focus:border-primary-800";
  const labelClass = "mb-1 block text-sm font-medium text-text-primary";

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {mutation.isError && (
        <p role="alert" className="text-sm text-danger">
          {mutation.error.message}
        </p>
      )}

      <div>
        <label htmlFor="payment-student" className={labelClass}>
          {t("forms.payment.student")}
        </label>
        <select
          id="payment-student"
          name="studentId"
          value={form.studentId}
          onChange={handleChange}
          required
          className={inputClass}
        >
          <option value="" disabled>
            {t("forms.payment.selectStudent")}
          </option>
          {students.map((student) => (
            <option key={student.id} value={student.id}>
              {student.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="payment-amount" className={labelClass}>
          {t("forms.payment.amount")}
        </label>
        <input
          id="payment-amount"
          name="amount"
          type="number"
          min="0.01"
          step="0.01"
          value={form.amount}
          onChange={handleChange}
          required
          className={inputClass}
        />
      </div>

      <div>
        <label htmlFor="payment-date" className={labelClass}>
          {t("forms.payment.date")}
        </label>
        <input
          id="payment-date"
          name="date"
          type="date"
          value={form.date}
          onChange={handleChange}
          required
          className={inputClass}
        />
      </div>

      <div>
        <label htmlFor="payment-note" className={labelClass}>
          {t("forms.payment.note")}
        </label>
        <input
          id="payment-note"
          name="note"
          type="text"
          value={form.note}
          onChange={handleChange}
          className={inputClass}
        />
      </div>

      <div className="flex justify-end gap-2 pt-2">
        <button
          type="button"
          onClick={onClose}
          className="rounded-xl border border-border-subtle px-4 py-2 text-sm text-text-secondary hover:bg-gray-50"
        >
          {t("forms.cancel")}
        </button>
        <button
          type="submit"
          disabled={mutation.isPending || paymentCreated}
          className="rounded-xl bg-primary-800 px-4 py-2 text-sm font-semibold text-white hover:opacity-90 disabled:opacity-60"
        >
          {mutation.isPending
            ? t("forms.saving")
            : paymentCreated
              ? t("forms.payment.created")
              : t("forms.payment.submit")}
        </button>
      </div>
    </form>
  );
};

export default AddPaymentForm;
