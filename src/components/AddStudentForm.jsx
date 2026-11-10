import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AddStudent } from "../api/students";
import { addActivity } from "../api/activities";
import { fetchCourse } from "../api/courses"; 

const initialForm = { name: "", phone: "", guardian: "", courseId: "" };

const AddStudentForm = ({ onClose }) => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();

  const [form, setForm] = useState(initialForm);
  const [studentCreated, setStudentCreated] = useState(false);

  const { data: courses = [] } = useQuery({
    queryKey: ["courses"],
    queryFn: fetchCourse,
  });

  const refreshLists = () => {
    queryClient.invalidateQueries({ queryKey: ["students"] });
    queryClient.invalidateQueries({ queryKey: ["activities"] });
  };

  const mutation = useMutation({
    mutationFn: async (data) => {
      const student = await AddStudent(data);

      try {
        await addActivity({
          type: "studentAdded",
          studentId: student.id,
          createdAt: new Date().toISOString(),
        });
      } catch (cause) {
        const error = new Error(t("forms.student.activityError"), { cause });
        error.studentCreated = true;
        throw error;
      }

      return student;
    },
    onSuccess: () => {
      refreshLists();
      setForm(initialForm);
      onClose();
    },
    onError: (error) => {
      if (error.studentCreated) {
        setStudentCreated(true);
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
        <label htmlFor="student-name" className={labelClass}>
          {t("forms.student.name")}
        </label>
        <input
          id="student-name"
          name="name"
          type="text"
          value={form.name}
          onChange={handleChange}
          required
          className={inputClass}
        />
      </div>

      <div>
        <label htmlFor="student-phone" className={labelClass}>
          {t("forms.student.phone")}
        </label>
        <input
          id="student-phone"
          name="phone"
          type="tel"
          value={form.phone}
          onChange={handleChange}
          required
          className={inputClass}
        />
      </div>

      <div>
        <label htmlFor="student-guardian" className={labelClass}>
          {t("forms.student.guardian")}
        </label>
        <input
          id="student-guardian"
          name="guardian"
          type="text"
          value={form.guardian}
          onChange={handleChange}
          required
          className={inputClass}
        />
      </div>

      <div>
        <label htmlFor="student-course" className={labelClass}>
          {t("forms.student.course")}
        </label>
        <select
          id="student-course"
          name="courseId"
          value={form.courseId}
          onChange={handleChange}
          required
          className={inputClass}
        >
          <option value="" disabled>
            {t("forms.student.selectCourse")}
          </option>
          {courses.map((course) => (
            <option key={course.id} value={course.id}>
              {course.name}
            </option>
          ))}
        </select>
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
          disabled={mutation.isPending || studentCreated}
          className="rounded-xl bg-primary-800 px-4 py-2 text-sm font-semibold text-white hover:opacity-90 disabled:opacity-60"
        >
          {mutation.isPending
            ? t("forms.saving")
            : studentCreated
              ? t("forms.student.created")
              : t("forms.student.submit")}
        </button>
      </div>
    </form>
  );
};

export default AddStudentForm;