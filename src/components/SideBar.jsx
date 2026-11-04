import {
  LayoutDashboard,
  Users,
  GraduationCap,
  BookOpen,
  UsersRound,
  CreditCard,
  Settings,
  LogOut,
  X,
} from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

const navItem = [
  { name: "sidebar.dashboard", icon: LayoutDashboard, path: "/" },
  { name: "sidebar.students", icon: Users, path: "/admin/students" },
  { name: "sidebar.teachers", icon: GraduationCap, path: "/admin/teachers" },
  { name: "sidebar.courses", icon: BookOpen, path: "/admin/courses" },
  { name: "sidebar.groups", icon: UsersRound, path: "/admin/groups" },
  { name: "sidebar.payments", icon: CreditCard, path: "/admin/payments" },
  { name: "sidebar.settings", icon: Settings, path: "/admin/settings" },
];

const Sidebar = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <>
      {isOpen && (
        <button
          type="button"
          onClick={onClose}
          aria-label={t("sidebar.close_menu")}
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
        />
      )}

      <aside
        className={`fixed inset-y-0 right-0 z-50 bg-primary-900 flex flex-col w-64 p-4 min-h-screen transition-transform duration-300 ease-in-out lg:static lg:translate-x-0 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="mb-8 flex items-center justify-between px-2 pt-2">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary-700 border border-primary-600 flex items-center justify-center text-accent-500 font-display font-bold text-xl">
              S
            </div>
            <div>
              <h2 className="text-xl font-display font-bold text-white">
                {t("sidebar.brand")}
              </h2>
              <p className="text-xs text-white/60">{t("sidebar.subtitle")}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label={t("sidebar.close_menu")}
            className="lg:hidden text-white/80 hover:text-white"
          >
            <X size={20} />
          </button>
        </div>

        <nav className="flex flex-col gap-1.5">
          {navItem.map((item) => {
            return (
              <NavLink
                key={item.name}
                to={item.path}
                end={item.path === "/admin"}
                onClick={onClose}
                className={({ isActive }) =>
                  `relative flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? "bg-primary-700 text-white"
                      : "text-white/75 hover:bg-primary-800 hover:text-white"
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    {isActive && (
                      <span className="absolute right-0 top-2.5 bottom-2.5 w-1 bg-accent-500 rounded-l-full" />
                    )}
                    <item.icon
                      className={`h-5 w-5 ${
                        isActive ? "text-accent-500" : "text-white/60"
                      }`}
                    />
                    {t(item.name)}
                  </>
                )}
              </NavLink>
            );
          })}
        </nav>

        <button
          className="mt-auto flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-red-400 bg-primary-950 hover:bg-primary-800 transition-colors"
          onClick={() => navigate("/")}
        >
          <LogOut size={20} className="text-danger" />
          {t("sidebar.logout")}
        </button>
      </aside>
    </>
  );
};

export default Sidebar;
