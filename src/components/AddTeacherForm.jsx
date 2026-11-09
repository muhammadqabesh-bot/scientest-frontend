import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addTeacher } from "../api/teachers";
import { addActivity } from "../api/activities";

const initialForm = { name: "", phone: "", specialty: "" };

const AddTeacherForm = ({ onClose }) => {
  const { t } = useTranslation();

  const [form, setForm] = useState(initialForm);
  const [teacherCreated, setTeacherCreated] = useState(false);

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (data) => {
      const teacher = await addTeacher(data);

      try {
        await addActivity({
          type: "teacherAdded",
          teacherId: teacher.id,
          createdAt: new Date().toISOString(),
        });
      } catch (cause) {
        const error = new Error(t("forms.teacher.activityError"), { cause });
        error.teacherCreated = true;
        throw error;
      }

      return teacher;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["teachers"] });
      queryClient.invalidateQueries({ queryKey: ["activities"] });
      setForm(initialForm);
      onClose();
    },
    onError: (error) => {
      if (error.teacherCreated) {
        setTeacherCreated(true);
        queryClient.invalidateQueries({ queryKey: ["teachers"] });
        queryClient.invalidateQueries({ queryKey: ["activities"] });
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

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {mutation.isError && (
        <p role="alert" className="text-sm text-red-600">
          {mutation.error.message}
        </p>
      )}
      <div>
        <label
          htmlFor="teacher-name"
          className="mb-1 block text-sm font-medium text-text-primary"
        >
          {t("forms.teacher.name")}
        </label>
        <input
          id="teacher-name"
          name="name"
          type="text"
          value={form.name}
          onChange={handleChange}
          required
          className={inputClass}
        />
      </div>
      <div>
        <label
          htmlFor="teacher-phone"
          className="mb-1 block text-sm font-medium text-text-primary"
        >
          {t("forms.teacher.phone")}
        </label>
        <input
          id="teacher-phone"
          name="phone"
          type="tel"
          value={form.phone}
          onChange={handleChange}
          required
          className={inputClass}
        />
      </div>

      <div>
        <label
          htmlFor="teacher-specialty"
          className="mb-1 block text-sm font-medium text-text-primary"
        >
          {t("forms.teacher.specialty")}
        </label>
        <input
          id="teacher-specialty"
          name="specialty"
          type="text"
          value={form.specialty}
          onChange={handleChange}
          required
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
          disabled={mutation.isPending || teacherCreated}
          className="rounded-xl bg-primary-800 px-4 py-2 text-sm font-semibold text-white hover:opacity-90"
        >
          {mutation.isPending
            ? t("forms.saving")
            : teacherCreated
              ? t("forms.teacher.created")
              : t("forms.teacher.submit")}
        </button>
      </div>
    </form>
  );
};

export default AddTeacherForm;
