function getInitials(name) {
  if (!name) return "؟";

  const letters = name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((word) => word[0]);

  return letters.join("") || "؟";
}

function formatMoney(amount, currency = "USD") {
  if (typeof amount !== "number") return "—";

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
  }).format(amount);
}

export function buildActivity(activity, lookups) {
  const { studentsById, coursesById, teachersById, paymentsById, groupsById } =
    lookups;

  switch (activity.type) {
    case "studentAdded":
    case "studentRegistered": {
      const student = studentsById.get(String(activity.studentId));
      const course = coursesById.get(
        String(activity.courseId ?? student?.courseId),
      );

      return {
        id: activity.id,
        initials: getInitials(student?.name),
        tone: "green",
        titleKey: "dashboard.activities.studentRegistered",
        name: student?.name ?? "—",
        detailKey: "dashboard.activities.joinedCourse",
        detailValues: { course: course?.name ?? "—" },
      };
    }

    case "paymentReceived":
    case "paymentRecorded": {
      const payment = paymentsById.get(String(activity.paymentId));
      const student = studentsById.get(
        String(payment?.studentId ?? activity.studentId),
      );

      return {
        id: activity.id,
        initials: "$$",
        tone: "gold",
        titleKey: "dashboard.activities.paymentReceived",
        name: formatMoney(payment?.amount, payment?.currency),
        detailKey: "dashboard.activities.paymentFrom",
        detailValues: { student: student?.name ?? "—" },
      };
    }

    case "groupCreated": {
      const group = groupsById.get(String(activity.groupId));
      const teacher = teachersById.get(
        String(group?.teacherId ?? activity.teacherId),
      );

      return {
        id: activity.id,
        initials: "مج",
        tone: "gray",
        titleKey: "dashboard.activities.groupCreated",
        name: group?.name ?? "—",
        detailKey: "dashboard.activities.assignedTo",
        detailValues: { teacher: teacher?.name ?? "—" },
      };
    }

    case "teacherAdded": {
      const teacher = teachersById.get(String(activity.teacherId));

      return {
        id: activity.id,
        initials: getInitials(teacher?.name),
        tone: "green",
        titleKey: "dashboard.activities.teacherAdded",
        name: teacher?.name ?? "—",
        detailKey: "dashboard.activities.joinedTeam",
        detailValues: {},
      };
    }

    default:
      return null;
  }
}
