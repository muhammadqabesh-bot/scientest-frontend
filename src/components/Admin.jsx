import { useState } from "react";
import { Menu } from "lucide-react";
import { useTranslation } from "react-i18next";
import SideBar from "./SideBar";
import Header from "./Header";

const Admin = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-gray-50 lg:flex">
      <SideBar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      <div className="flex flex-1 flex-col min-w-0">
        <Header onMenuClick={() => setIsSidebarOpen(true)} />

        <main className="flex-1 p-4 lg:p-6">
          <div className="mx-auto max-w-7xl"></div>
        </main>
      </div>
    </div>
  );
};

export default Admin;
