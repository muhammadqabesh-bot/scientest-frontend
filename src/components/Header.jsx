import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Bell,
  CalendarDays,
  ChevronDown,
  Menu,
  Search,
  UserRound,
} from "lucide-react";
import { useTranslation } from "react-i18next";

function getDateTime() {
  const now = new Date();

  return {
    date: new Intl.DateTimeFormat("ar", {
      weekday: "long",
      day: "numeric",
      month: "short",
      year: "numeric",
    }).format(now),

    time: new Intl.DateTimeFormat("ar", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    }).format(now),
  };
}

export default function Header({ onMenuClick }) {


  const { t } = useTranslation();
  const [dateTime, setDateTime] = useState(getDateTime);

  useEffect(() => {
    const timer = setInterval(() => {
      setDateTime(getDateTime());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <motion.header
      dir="rtl"
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className="sticky top-0 z-30 h-16 border-b border-[#e8ebe7] bg-white/95 backdrop-blur-md"
    >
      <div className="mx-auto flex h-full items-center justify-between gap-3 px-4 sm:gap-4 sm:px-6 lg:px-8">
        {/* التاريخ والوقت */}
        <div className="flex shrink-0 items-center gap-2 rounded-xl border border-[#e8ebe7] bg-white px-2.5 py-2 text-xs text-[#53605b] shadow-sm sm:px-3">
          <CalendarDays className="h-4 w-4 shrink-0 text-[#b89b53]" />

          <span className="hidden sm:inline">{dateTime.date}</span>

          <span className="hidden h-4 w-px bg-[#e8ebe7] sm:block" />

          <span className="font-medium text-[#21312e]">{dateTime.time}</span>
        </div>

        {/* زر القائمة للموبايل */}
        <button
          type="button"
          onClick={onMenuClick}
          aria-label={t("header.open_menu", "فتح القائمة")}
          className="grid h-10 w-10 shrink-0 place-items-center rounded-lg text-[#53605b] transition-colors hover:bg-[#f3f5f1] lg:hidden"
        >
          <Menu className="h-5 w-5" />
        </button>

        {/* حقل البحث */}
        <div className="mx-auto flex h-10 w-full max-w-md items-center gap-2 rounded-xl border border-[#e8ebe7] bg-[#f9faf8] px-3 transition-colors focus-within:border-[#b7c8bf] focus-within:bg-white">
          <Search className="h-[18px] w-[18px] shrink-0 text-[#87918d]" />

          <input
            type="search"
            placeholder={t(
              "header.search_placeholder",
              "ابحث عن طالب، معلم...",
            )}
            aria-label={t("header.search_aria", "البحث")}
            className="h-full min-w-0 flex-1 bg-transparent text-sm text-[#21312e] outline-none placeholder:text-[#9aa39f]"
          />
        </div>

        {/* الإشعارات والملف الشخصي */}
        <div className="flex shrink-0 items-center gap-1 sm:gap-3">
          <button
            type="button"
            aria-label={t("header.notifications", "الإشعارات")}
            className="relative grid h-10 w-10 place-items-center rounded-lg text-[#73807a] transition-colors hover:bg-[#f3f5f1] hover:text-[#103b31]"
          >
            <Bell className="h-5 w-5" />

            <span className="absolute right-2.5 top-2 h-2 w-2 rounded-full border-2 border-white bg-[#b89b53]" />
          </button>

          <button
            type="button"
            aria-label={t("header.profile", "الملف الشخصي")}
            className="flex items-center gap-2 rounded-xl p-1 text-right transition-colors hover:bg-[#f3f5f1]"
          >
            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-[#103b31] text-white">
              <UserRound className="h-[18px] w-[18px]" />
            </span>

            <span className="hidden sm:flex sm:flex-col">
              <span className="text-xs font-semibold text-[#21312e]">
                {t("header.user_name", "أحمد محمود")}
              </span>

              <span className="text-[11px] text-[#87918d]">
                {t("header.user_role", "مدير النظام")}
              </span>
            </span>

            <ChevronDown className="hidden h-4 w-4 text-[#87918d] sm:block" />
          </button>
        </div>
      </div>
    </motion.header>
  );
}
