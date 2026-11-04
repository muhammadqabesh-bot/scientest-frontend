import { useEffect } from "react";
import { useTranslation } from "react-i18next";
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
} from "lucide-react";

import Card from "./ui/Card";

/*
  بيانات تجريبية للواجهة فقط.

  TODO (أنت): استبدل demoData لاحقًا ببيانات الـAPI.
  TODO (أنت): أضف حالة loading و error ومعالجة الأخطاء عند ربط الباك إند.
*/
const demoData = {
  stats: [
    {
      id: "students",
      icon: "Users",
      labelKey: "dashboard.stats.students",
      value: 248,
      change: "+12%",
      noteKey: "dashboard.stats.vsLastMonth",
    },
    {
      id: "teachers",
      icon: "GraduationCap",
      labelKey: "dashboard.stats.teachers",
      value: 18,
      change: "+6%",
      noteKey: "dashboard.stats.teachingTeam",
    },
    {
      id: "courses",
      icon: "BookOpen",
      labelKey: "dashboard.stats.courses",
      value: 12,
      change: "+2",
      noteKey: "dashboard.stats.activePrograms",
    },
    {
      id: "classes",
      icon: "CalendarDays",
      labelKey: "dashboard.stats.classesToday",
      value: 6,
      change: "2",
      noteKey: "dashboard.stats.remaining",
    },
  ],

  quickActions: [
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
  ],

  schedule: [
    {
      id: 1,
      range: "today",
      time: "09:00 ص",
      course: "تطوير الويب",
      teacher: "أحمد علي",
      room: "مختبر ١",
    },
    {
      id: 2,
      range: "today",
      time: "11:30 ص",
      course: "هياكل البيانات",
      teacher: "سارة نور",
      room: "قاعة ٢٠٤",
    },
    {
      id: 3,
      range: "today",
      time: "02:00 م",
      course: "تصميم تجربة المستخدم",
      teacher: "عمر خالد",
      room: "مختبر ٣",
    },
    {
      id: 4,
      range: "today",
      time: "04:30 م",
      course: "قواعد البيانات",
      teacher: "رامي حسن",
      room: "مختبر ٢",
    },
    {
      id: 5,
      range: "week",
      time: "10:00 ص",
      course: "أساسيات البرمجة",
      teacher: "منى ياسين",
      room: "قاعة ١٠٢",
    },
    {
      id: 6,
      range: "week",
      time: "01:00 م",
      course: "تطوير الواجهات",
      teacher: "أحمد علي",
      room: "مختبر ١",
    },
    {
      id: 7,
      range: "week",
      time: "03:30 م",
      course: "مهارات العرض",
      teacher: "سارة نور",
      room: "قاعة ٢٠٤",
    },
  ],

  activities: [
    {
      id: 1,
      initials: "كت",
      tone: "green",
      titleKey: "dashboard.activities.studentRegistered",
      name: "كريم تمر",
      detailKey: "dashboard.activities.joinedCourse",
      detailValues: { course: "تطوير الويب الشامل" },
      timeKey: "dashboard.activities.minutesAgo",
      timeValues: { count: 10 },
    },
    {
      id: 2,
      initials: "$$",
      tone: "gold",
      titleKey: "dashboard.activities.paymentReceived",
      name: "$150.00",
      detailKey: "dashboard.activities.paymentFrom",
      detailValues: { student: "ليلى حسن" },
      timeKey: "dashboard.activities.minutesAgo",
      timeValues: { count: 35 },
    },
    {
      id: 3,
      initials: "مج",
      tone: "gray",
      titleKey: "dashboard.activities.groupCreated",
      name: "React Next-4",
      detailKey: "dashboard.activities.assignedTo",
      detailValues: { teacher: "أحمد محمود" },
      timeKey: "dashboard.activities.hoursAgo",
      timeValues: { count: 2 },
    },
  ],
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

/* حركة دخول البطاقة */
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

/* إنشاء تدرّج دخول بين البطاقات */
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

/* نسخ ثابتة للحركة عند اختيار تقليل الحركة في الجهاز */
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

  /*
    TODO (أنت): بعد ربط الـAPI، خذ هذه البيانات من state بدل demoData.
    TODO (أنت): أضف هنا واجهات التحميل والخطأ إذا احتجتها.
  */
  const stats = demoData.stats;
  const quickActions = demoData.quickActions;
  const schedule = demoData.schedule;
  const activities = demoData.activities;

  const [unused] = []; // احذف هذا السطر عند إضافة useState للجدول

  const visibleSchedule = schedule.filter((item) => item.range === "today");

  const cardMotion = reduceMotion ? reducedItemVariants : itemVariants;

  const hoverMotion = reduceMotion
    ? {}
    : {
        whileHover: { y: -4 },
        whileTap: { scale: 0.99 },
      };

  return (
    <main dir="rtl" className="space-y-7 p-5 md:p-7">
      {/* الترحيب */}
      <motion.section
        variants={cardMotion}
        initial={reduceMotion ? false : "hidden"}
        animate="visible"
        className="flex flex-wrap items-end justify-between gap-4"
      >
        <div>
          <h1 className="text-2xl font-bold text-[#21312e]">
            {t("dashboard.welcome")}
          </h1>

          <p className="mt-2 text-sm text-[#7a8582]">
            {t("dashboard.welcomeDescription")}
          </p>
        </div>
      </motion.section>

      {/* بطاقات الإحصاءات: تدخل بالتتابع والأرقام تعدّ عند فتح الصفحة */}
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
                className="group h-full border border-gray-100 transition-all duration-300 hover:border-[#b89b53]/40 hover:shadow-lg"
              >
                <div className="flex items-center justify-between gap-3">
                  <span className="grid h-10 w-10 place-items-center rounded-xl bg-[#f6f2e7] text-[#b89b53] transition-all duration-300 group-hover:scale-110 group-hover:bg-[#efe8d5] group-hover:text-[#967b38]">
                    <Icon className="h-5 w-5" aria-hidden="true" />
                  </span>

                  <span className="text-xs font-semibold tracking-wide text-[#7a8582]">
                    {t(stat.labelKey)}
                  </span>
                </div>

                <p className="mt-4 text-3xl font-bold text-[#103b31] transition-colors duration-300 group-hover:text-[#21614f]">
                  <AnimatedNumber
                    value={stat.value}
                    reduceMotion={reduceMotion}
                  />
                </p>

                <div className="mt-3 flex items-center gap-2">
                  <span className="rounded-full bg-[#e8f5ec] px-2 py-1 text-xs font-semibold text-[#397652]">
                    {stat.change}
                  </span>

                  <span className="text-xs text-[#87918d]">
                    {t(stat.noteKey)}
                  </span>
                </div>
              </Card>
            </motion.div>
          );
        })}
      </motion.section>

      {/* الإجراءات السريعة: الأيقونة تتحرك وزر + يتغير لونه عند التحويم */}
      <motion.section
        variants={reduceMotion ? undefined : actionsStagger}
        initial={reduceMotion ? false : "hidden"}
        animate="visible"
      >
        <div className="mb-4">
          <h2 className="text-lg font-semibold text-[#21312e]">
            {t("dashboard.quickActionsHeading")}
          </h2>

          <p className="mt-1 text-sm text-[#7a8582]">
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
              >
                <Card
                  variant="interactive"
                  size="md"
                  className="group h-full w-full text-right"
                >
                  {/*
                    TODO (أنت): أضف onClick هنا إذا أردت فتح المودال
                    أو تنفيذ إجراء سريع.
                  */}
                  <div className="flex items-center gap-3">
                    <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-[#f6f2e7] text-[#b89b53] transition-all duration-300 group-hover:-rotate-6 group-hover:scale-110 group-hover:bg-[#efe8d5]">
                      <Icon className="h-5 w-5" aria-hidden="true" />
                    </span>

                    <span className="min-w-0 flex-1">
                      <span className="block text-sm font-semibold text-[#21312e]">
                        {t(action.titleKey)}
                      </span>

                      <span className="mt-1 block text-xs text-[#87918d]">
                        {t(action.descriptionKey)}
                      </span>
                    </span>

                    <span
                      aria-hidden="true"
                      className="grid h-7 w-7 shrink-0 place-items-center rounded-lg border border-gray-200 bg-white text-[#53605b] transition-all duration-300 group-hover:border-[#103b31] group-hover:bg-[#103b31] group-hover:text-white"
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

      {/* الجدول والنشاط */}
      <motion.section
        variants={reduceMotion ? undefined : panelsStagger}
        initial={reduceMotion ? false : "hidden"}
        animate="visible"
        className="grid grid-cols-1 gap-5 xl:grid-cols-2"
      >
        {/* جدول اليوم */}
        <motion.div variants={cardMotion}>
          <Card size="md" className="h-full">
            <div className="mb-4 flex items-center justify-between gap-3">
              <div>
                <h2 className="font-semibold text-[#21312e]">
                  {t("dashboard.todaySchedule")}
                </h2>

                <p className="mt-1 text-xs text-[#87918d]">
                  {t("dashboard.scheduleDescription")}
                </p>
              </div>

              {/* تحكم محلي بالعرض التجريبي؛ لا يستدعي API */}
              <select
                aria-label="نطاق عرض الجدول"
                className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-xs text-[#53605b] outline-none transition-colors focus:border-[#b89b53]"
                defaultValue="today"
                onChange={(event) => {
                  /*
                    TODO (أنت): اربط اختيار النطاق بالبيانات القادمة من API.
                    حاليًا هذا العنصر للعرض فقط.
                  */
                }}
              >
                <option value="today">اليوم</option>
                <option value="week">هذا الأسبوع</option>
              </select>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[520px] text-right text-sm">
                <thead className="text-xs text-[#87918d]">
                  <tr className="border-b border-gray-100">
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
                  {visibleSchedule.map((item) => (
                    <tr
                      key={item.id}
                      className="border-b border-gray-100 transition-colors last:border-0 hover:bg-gray-50/70"
                    >
                      <td
                        dir="ltr"
                        className="px-2 py-3 text-right font-medium text-[#a48a47]"
                      >
                        {item.time}
                      </td>

                      <td className="px-2 py-3 text-[#35443f]">
                        {item.course}
                      </td>

                      <td className="px-2 py-3 text-[#7a8582]">
                        {item.teacher}
                      </td>

                      <td className="px-2 py-3">
                        <span className="rounded-md border border-gray-200 px-2 py-1 text-xs text-[#7a8582]">
                          {item.room}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </motion.div>

        {/* النشاط الأخير */}
        <motion.div variants={cardMotion}>
          <Card size="md" className="h-full">
            <div className="mb-3 flex items-start justify-between gap-3">
              <div>
                <h2 className="font-semibold text-[#21312e]">
                  {t("dashboard.recentActivity")}
                </h2>

                <p className="mt-1 text-xs text-[#87918d]">
                  {t("dashboard.recentActivityDescription")}
                </p>
              </div>

              {/* TODO (أنت): أضف وظيفة هذا الزر بنفسك إذا احتجتها */}
              <button
                type="button"
                className="text-xs font-medium text-[#a28743] transition-colors hover:text-[#80682d]"
              >
                {t("dashboard.viewAll")}
              </button>
            </div>

            <ul className="divide-y divide-gray-100">
              {activities.map((activity) => (
                <li
                  key={activity.id}
                  className="flex items-center gap-3 py-3 first:pt-2 last:pb-0"
                >
                  <span
                    className={[
                      "grid h-10 w-10 shrink-0 place-items-center rounded-xl text-xs font-semibold",
                      activity.tone === "gold"
                        ? "bg-[#f6f2e7] text-[#9a813d]"
                        : activity.tone === "gray"
                          ? "bg-gray-100 text-gray-600"
                          : "bg-[#e4f8eb] text-[#365548]",
                    ].join(" ")}
                  >
                    {activity.initials}
                  </span>

                  <span className="min-w-0 flex-1">
                    <span className="block text-sm text-[#53605b]">
                      {t(activity.titleKey)}{" "}
                      <strong className="font-semibold text-[#30453d]">
                        {activity.name}
                      </strong>
                    </span>

                    <span className="mt-1 block text-xs text-[#87918d]">
                      {t(activity.detailKey, activity.detailValues)}
                    </span>
                  </span>

                  <span className="shrink-0 text-xs text-[#9aa39f]">
                    {t(activity.timeKey, activity.timeValues)}
                  </span>
                </li>
              ))}
            </ul>
          </Card>
        </motion.div>
      </motion.section>
    </main>
  );
}
