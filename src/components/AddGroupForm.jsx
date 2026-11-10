import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { addGroup } from "../api/groups";
import { addActivity } from "../api/activities";
import { fetchCourses } from "../api/courses";
import { fetchTeachers } from "../api/teachers";

const initialForm = { name: "", courseId: "", teacherId: "" };

const AddGroupForm = ({ onClose }) => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();

  const [form, setForm] = useState(initialForm);
  const [groupCreated, setGroupCreated] = useState(false);

  const { data: courses = [] } = useQuery({
    queryKey: ["courses"],
    queryFn: fetchCourses,
  });

  const { data: teachers = [] } = useQuery({
    queryKey: ["teachers"],
    queryFn: fetchTeachers,
  });

  const refreshLists = () => {
    queryClient.invalidateQueries({ queryKey: ["groups"] });
    queryClient.invalidateQueries({ queryKey: ["activities"] });
  };

  const mutation = useMutation({
    mutationFn: async (data) => {
      const group = await addGroup(data);

      try {
        await addActivity({
          type: "groupCreated",
          groupId: group.id,
          createdAt: new Date().toISOString(),
        });
      } catch (cause) {
        const error = new Error(t("forms.group.activityError"), { cause });
        error.groupCreated = true;
        throw error;
      }

      return group;
    },
    onSuccess: () => {
      refreshLists();
      setForm(initialForm);
      onClose();
    },
    onError: (error) => {
      if (error.groupCreated) {
        setGroupCreated(true);
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
        <label htmlFor="group-name" className={labelClass}>
          {t("forms.group.name")}
        </label>
        <input
          id="group-name"
          name="name"
          type="text"
          value={form.name}
          onChange={handleChange}
          required
          className={inputClass}
        />
      </div>

      <div>
        <label htmlFor="group-course" className={labelClass}>
          {t("forms.group.course")}
        </label>
        <select
          id="group-course"
          name="courseId"
          value={form.courseId}
          onChange={handleChange}
          required
          className={inputClass}
        >
          <option value="" disabled>
            {t("forms.group.selectCourse")}
          </option>
          {courses.map((course) => (
            <option key={course.id} value={course.id}>
              {course.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="group-teacher" className={labelClass}>
          {t("forms.group.teacher")}
        </label>
        <select
          id="group-teacher"
          name="teacherId"
          value={form.teacherId}
          onChange={handleChange}
          required
          className={inputClass}
        >
          <option value="" disabled>
            {t("forms.group.selectTeacher")}
          </option>
          {teachers.map((teacher) => (
            <option key={teacher.id} value={teacher.id}>
              {teacher.name}
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
          disabled={mutation.isPending || groupCreated}
          className="rounded-xl bg-primary-800 px-4 py-2 text-sm font-semibold text-white hover:opacity-90 disabled:opacity-60"
        >
          {mutation.isPending
            ? t("forms.saving")
            : groupCreated
              ? t("forms.group.created")
              : t("forms.group.submit")}
        </button>
      </div>
    </form>
  );
};

export default AddGroupForm;
