import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { buildActivity } from "../utils/buildActivity";
import {
  animate,
  motion,
  useMotionValue,
  useReducedMotion,
  useTransform,
} from "framer-motion";
import {
  BookOpen,
  CalendarDays,
  CreditCard,
  GraduationCap,
  UserRoundPlus,
  Users,
  UsersRound,
  X,
} from "lucide-react";

import Card from "./ui/Card";
import StateMessage from "./ui/StateNessege";
import Modal from "./ui/Modal";

import { useSchedule } from "../Hooks/useSchedule";
import { useTeachers } from "../Hooks/useTeachers";
import { useCourses } from "../Hooks/useCourses";
import { useStudents } from "../Hooks/useStudents";
import { usePayments } from "../Hooks/usePayments";
import { useGroups } from "../Hooks/useGroups";
import { useActivities } from "../Hooks/useActivities";

import AddTeacherForm from "./AddTeacherForm";

const statsConfig = [
  {
    id: "students",
    icon: "Users",
    labelKey: "dashboard.stats.students",
    noteKey: "dashboard.stats.vsLastMonth",
  },
  {
    id: "teachers",
    icon: "GraduationCap",
    labelKey: "dashboard.stats.teachers",
    noteKey: "dashboard.stats.teachingTeam",
  },
  {
    id: "courses",
    icon: "BookOpen",
    labelKey: "dashboard.stats.courses",
    noteKey: "dashboard.stats.activePrograms",
  },
  {
    id: "classes",
    icon: "CalendarDays",
    labelKey: "dashboard.stats.classesToday",
    noteKey: "dashboard.stats.remaining",
  },
];

const quickActions = [
  {
    id: "addStudent",
    icon: "UserRoundPlus",
    titleKey: "dashboard.quickActions.addStudent.title",
    descriptionKey: "dashboard.quickActions.addStudent.description",
  },
  {
    id: "addTeacher",
    icon: "GraduationCap",
    titleKey: "dashboard.quickActions.addTeacher.title",
    descriptionKey: "dashboard.quickActions.addTeacher.description",
  },
  {
    id: "createGroup",
    icon: "UsersRound",
    titleKey: "dashboard.quickActions.createGroup.title",
    descriptionKey: "dashboard.quickActions.createGroup.description",
  },
  {
    id: "recordPayment",
    icon: "CreditCard",
    titleKey: "dashboard.quickActions.recordPayment.title",
    descriptionKey: "dashboard.quickActions.recordPayment.description",
  },
];

const toneClasses = {
  green: "bg-status-success-bg text-status-success-text",
  gold: "bg-accent-50 text-accent-600",
  gray: "bg-border-subtle text-text-secondary",
};

const iconMap = {
  Users,
  GraduationCap,
  BookOpen,
  CalendarDays,
  UserRoundPlus,
  UsersRound,
  CreditCard,
};

const itemVariants = {
  hidden: {
    opacity: 0,
    y: 16,
    scale: 0.98,
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.45,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

function createStaggerVariants(delayChildren, staggerChildren) {
  return {
    hidden: { opacity: 1 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren,
        staggerChildren,
      },
    },
  };
}

const reducedItemVariants = {
  hidden: { opacity: 1, y: 0, scale: 1 },
  visible: { opacity: 1, y: 0, scale: 1 },
};

const statsStagger = createStaggerVariants(0.12, 0.09);
const actionsStagger = createStaggerVariants(0.35, 0.08);
const panelsStagger = createStaggerVariants(0.65, 0.12);

function AnimatedNumber({ value, reduceMotion }) {
  const target = Number(value);
  const count = useMotionValue(reduceMotion ? target : 0);

  const displayedValue = useTransform(count, (current) =>
    Math.round(current).toLocaleString("en-US"),
  );

  useEffect(() => {
    if (!Number.isFinite(target)) return;

    if (reduceMotion) {
      count.set(target);
      return;
    }

    count.set(0);

    const controls = animate(count, target, {
      duration: 1.15,
      ease: [0.16, 1, 0.3, 1],
    });

    return () => controls.stop();
  }, [count, target, reduceMotion]);

  if (!Number.isFinite(target)) {
    return <span>{value}</span>;
  }

  return (
    <motion.span aria-label={String(target)}>{displayedValue}</motion.span>
  );
}

export default function Dashboard() {
  const { t } = useTranslation();
  const prefersReducedMotion = useReducedMotion();
  const reduceMotion = Boolean(prefersReducedMotion);

  const [activeModal, setActiveModal] = useState(null);

  const today = new Date()
    .toLocaleDateString("er", { weekday: "long" })
    .toLowerCase();

  const { data: schedule = [], isLoading, isError } = useSchedule(today);
  const { data: courses = [] } = useCourses();
  const { data: teachers = [] } = useTeachers();
  const { data: students = [] } = useStudents();
  const { data: payments = [] } = usePayments();
  const { data: groups = [] } = useGroups();
  const {
    data: activities = [],
    isLoading: activitiesLoading,
    isError: activitiesError,
  } = useActivities();

  const recentActivities = useMemo(
    () =>
      [...activities]
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 5),
    [activities],
  );

  const counts = {
    students: students.length,
    teachers: teachers.length,
    courses: courses.length,
    classes: schedule.length,
  };

  const stats = statsConfig.map((item) => ({
    ...item,
    value: counts[item.id],
  }));

  const coursesById = useMemo(
    () => new Map(courses.map((course) => [String(course.id), course])),
    [courses],
  );

  const teachersById = useMemo(
    () => new Map(teachers.map((teacher) => [String(teacher.id), teacher])),
    [teachers],
  );

  const studentsById = useMemo(
    () => new Map(students.map((s) => [String(s.id), s])),
    [students],
  );
  const paymentsById = useMemo(
    () => new Map(payments.map((p) => [String(p.id), p])),
    [payments],
  );
  const groupsById = useMemo(
    () => new Map(groups.map((g) => [String(g.id), g])),
    [groups],
  );

  const activityItems = useMemo(() => {
    const lookups = {
      studentsById,
      coursesById,
      teachersById,
      paymentsById,
      groupsById,
    };

    return recentActivities
      .map((activity) => buildActivity(activity, lookups))
      .filter(Boolean);
  }, [
    recentActivities,
    studentsById,
    coursesById,
    teachersById,
    paymentsById,
    groupsById,
  ]);

  const cardMotion = reduceMotion ? reducedItemVariants : itemVariants;

  const hoverMotion = reduceMotion
    ? {}
    : {
        whileHover: { y: -4 },
        whileTap: { scale: 0.99 },
      };

  return (
    <main dir="rtl" className="space-y-7 p-5 md:p-7">
      <motion.section
        variants={cardMotion}
        initial={reduceMotion ? false : "hidden"}
        animate="visible"
        className="flex flex-wrap items-end justify-between gap-4"
      >
        <div>
          <h1 className="text-2xl font-bold text-text-primary">
            {t("dashboard.welcome")}
          </h1>

          <p className="mt-2 text-sm text-text-secondary">
            {t("dashboard.welcomeDescription")}
          </p>
        </div>
      </motion.section>

      <motion.section
        variants={reduceMotion ? undefined : statsStagger}
        initial={reduceMotion ? false : "hidden"}
        animate="visible"
        className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4"
      >
        {stats.map((stat) => {
          const Icon = iconMap[stat.icon] || Users;

          return (
            <motion.div
              key={stat.id}
              variants={cardMotion}
              {...hoverMotion}
              className="h-full"
            >
              <Card
                variant="default"
                size="md"
                className="group h-full border border-border-subtle transition-all duration-300 hover:border-accent-600/40 hover:shadow-card-hover"
              >
                <div className="flex items-center justify-between gap-3">
                  <span className="grid h-10 w-10 place-items-center rounded-xl bg-accent-50 text-accent-600 transition-all duration-300 group-hover:scale-110 group-hover:bg-accent-100">
                    <Icon className="h-5 w-5" aria-hidden="true" />
                  </span>

                  <span className="text-xs font-semibold tracking-wide text-text-secondary">
                    {t(stat.labelKey)}
                  </span>
                </div>

                <p className="mt-4 text-3xl font-bold text-primary-800 transition-colors duration-300 group-hover:text-primary-600">
                  <AnimatedNumber
                    value={stat.value}
                    reduceMotion={reduceMotion}
                  />
                </p>

                <p className="mt-3 text-xs text-text-muted">
                  {t(stat.noteKey)}
                </p>
              </Card>
            </motion.div>
          );
        })}
      </motion.section>

      <motion.section
        variants={reduceMotion ? undefined : actionsStagger}
        initial={reduceMotion ? false : "hidden"}
        animate="visible"
      >
        <div className="mb-4">
          <h2 className="text-lg font-semibold text-text-primary">
            {t("dashboard.quickActionsHeading")}
          </h2>

          <p className="mt-1 text-sm text-text-secondary">
            {t("dashboard.quickActionsDescription")}
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {quickActions.map((action) => {
            const Icon = iconMap[action.icon] || Users;

            return (
              <motion.div
                key={action.id}
                variants={cardMotion}
                {...hoverMotion}
                className="h-full"
                onClick={() => setActiveModal(action.id)}
              >
                <Card
                  variant="interactive"
                  size="md"
                  className="group h-full w-full text-right"
                >
                  <div className="flex items-center gap-3">
                    <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-accent-50 text-accent-600 transition-all duration-300 group-hover:-rotate-6 group-hover:scale-110 group-hover:bg-accent-100">
                      <Icon className="h-5 w-5" aria-hidden="true" />
                    </span>

                    <span className="min-w-0 flex-1">
                      <span className="block text-sm font-semibold text-text-primary">
                        {t(action.titleKey)}
                      </span>

                      <span className="mt-1 block text-xs text-text-muted">
                        {t(action.descriptionKey)}
                      </span>
                    </span>

                    <span
                      aria-hidden="true"
                      className="grid h-7 w-7 shrink-0 place-items-center rounded-lg border border-border-subtle bg-surface text-text-secondary transition-all duration-300 group-hover:border-primary-800 group-hover:bg-primary-800 group-hover:text-white"
                    >
                      +
                    </span>
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </motion.section>

      <motion.section
        variants={reduceMotion ? undefined : panelsStagger}
        initial={reduceMotion ? false : "hidden"}
        animate="visible"
        className="grid grid-cols-1 gap-5 xl:grid-cols-2"
      >
        <motion.div variants={cardMotion}>
          <Card size="md" className="h-full">
            <div className="mb-4 flex items-center justify-between gap-3">
              <div>
                <h2 className="font-semibold text-text-primary">
                  {t("dashboard.todaySchedule")}
                </h2>

                <p className="mt-1 text-xs text-text-muted">
                  {t("dashboard.scheduleDescription")}
                </p>
              </div>
            </div>

            {isLoading && <StateMessage>جاري التحميل ...</StateMessage>}

            {isError && (
              <StateMessage tone="danger">تعذّر تحميل الجدول</StateMessage>
            )}
            {!isLoading && !isError && schedule.length === 0 && (
              <StateMessage>لا يوجد حصص اليوم</StateMessage>
            )}
            {!isLoading && !isError && schedule.length > 0 && (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[520px] text-right text-sm">
                  <thead className="text-xs text-text-muted">
                    <tr className="border-b border-border-subtle">
                      <th className="px-2 py-3 font-medium">
                        {t("dashboard.table.time")}
                      </th>
                      <th className="px-2 py-3 font-medium">
                        {t("dashboard.table.course")}
                      </th>
                      <th className="px-2 py-3 font-medium">
                        {t("dashboard.table.teacher")}
                      </th>
                      <th className="px-2 py-3 font-medium">
                        {t("dashboard.table.room")}
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {schedule.map((item) => (
                      <tr
                        key={item.id}
                        className="border-b border-border-subtle transition-colors last:border-0 hover:bg-surface-hover"
                      >
                        <td
                          dir="ltr"
                          className="px-2 py-3 text-right font-medium text-accent-600"
                        >
                          {item.time}
                        </td>

                        <td className="px-2 py-3 text-text-primary">
                          {coursesById.get(String(item.courseId))?.name ?? "—"}
                        </td>

                        <td className="px-2 py-3 text-text-secondary">
                          {teachersById.get(String(item.teacherId))?.name ??
                            "—"}
                        </td>

                        <td className="px-2 py-3">
                          <span className="rounded-md border border-border-subtle px-2 py-1 text-xs text-text-secondary">
                            {item.room}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </Card>
        </motion.div>

        <motion.div variants={cardMotion}>
          <Card size="md" className="h-full">
            <div className="mb-3 flex items-start justify-between gap-3">
              <div>
                <h2 className="font-semibold text-text-primary">
                  {t("dashboard.recentActivity")}
                </h2>

                <p className="mt-1 text-xs text-text-muted">
                  {t("dashboard.recentActivityDescription")}
                </p>
              </div>

              <button
                type="button"
                className="text-xs font-medium text-accent-600 transition-colors hover:text-primary-700"
              >
                {t("dashboard.viewAll")}
              </button>
            </div>
            {activitiesLoading && <StateMessage>جارٍ التحميل...</StateMessage>}
            {activitiesError && (
              <StateMessage tone="danger">تعذّر تحميل النشاط</StateMessage>
            )}
            {!activitiesLoading &&
              !activitiesError &&
              activityItems.length === 0 && (
                <StateMessage>لا يوجد انشطة بعد </StateMessage>
              )}
            {!activitiesLoading &&
              !activitiesError &&
              activityItems.length > 0 && (
                <ul className="divide-y divide-border-subtle">
                  {activityItems.map((activity) => (
                    <li
                      key={activity.id}
                      className="flex items-center gap-3 py-3 first:pt-2 last:pb-0"
                    >
                      <span
                        className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl text-xs font-semibold ${toneClasses[activity.tone] ?? toneClasses.gray}`}
                      >
                        {activity.initials}
                      </span>

                      <span className="min-w-0 flex-1">
                        <span className="block text-sm text-text-secondary">
                          {t(activity.titleKey)}{" "}
                          <strong className="font-semibold text-text-primary">
                            {activity.name}
                          </strong>
                        </span>

                        <span className="mt-1 block text-xs text-text-muted">
                          {t(activity.detailKey, activity.detailValues)}
                        </span>
                      </span>

                      {/* <span className="shrink-0 text-xs text-text-muted">
                    {t(activity.timeKey, activity.timeValues)}
                  </span> */}
                    </li>
                  ))}
                </ul>
              )}
          </Card>
        </motion.div>
      </motion.section>
      <Modal
        isOpen={activeModal === "addStudent"}
        onClose={() => setActiveModal(null)}
        title={t("dashboard.quickActions.addStudent.title")}
      >
        <p>تجربة</p>
      </Modal>

      <Modal
        isOpen={activeModal === "addTeacher"}
        onClose={() => setActiveModal(null)}
        title={t("dashboard.quickActions.addTeacher.title")}
      >
        <AddTeacherForm onClose={() => setActiveModal(null)} />
      </Modal>

      <Modal
        isOpen={activeModal === "createGroup"}
        onClose={() => setActiveModal(null)}
        title={t("dashboard.quickActions.createGroup.title")}
      >
        <p>تجربة</p>
      </Modal>

      <Modal
        isOpen={activeModal === "recordPayment"}
        onClose={() => setActiveModal(null)}
        title={t("dashboard.quickActions.recordPayment.title")}
      >
        <p>تجربة</p>
      </Modal>
    </main>
  );
}
