import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/use-auth";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Package,
  User,
  History,
  LogOut,
  ChevronRight,
  Menu,
  X,
  Recycle,
} from "lucide-react";

const menus = [
  {
    label: "Dashboard",
    path: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "Dropoff",
    path: "/dropoff",
    icon: Package,
  },
  {
    label: "Waste Types",
    path: "/waste-types",
    icon: Recycle,
  },
  {
    label: "Profile",
    path: "/profile",
    icon: User,
  },
  {
    label: "History",
    path: "/history",
    icon: History,
  },
];

export default function CustomSidebar({ isOpen, toggleSidebar, isMobile }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  const handleNavigation = (path) => {
    navigate(path);
    if (isMobile) {
      toggleSidebar();
    }
  };

  return (
    <>
      {isMobile && (
        <button
          onClick={toggleSidebar}
          className="fixed top-[72px] left-4 z-50 h-10 w-10 flex items-center justify-center rounded-full bg-white shadow-md border border-gray-200"
          aria-label="Toggle sidebar"
        >
          {isOpen ? (
            <X className="h-5 w-5 text-gray-700" />
          ) : (
            <Menu className="h-5 w-5 text-gray-700" />
          )}
        </button>
      )}

      <div
        className={cn(
          "fixed top-0 left-0 z-30 h-full bg-white border-r border-gray-200 shadow-lg transition-all duration-300 overflow-y-auto md:pt-28 lg:pt-16",
          isMobile ? "w-[270px]" : "w-[280px]",
          isOpen
            ? "translate-x-0"
            : isMobile
            ? "-translate-x-full"
            : "-translate-x-full lg:translate-x-0"
        )}
      >
        <div className="p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center text-white font-bold shadow-md">
              T4C
            </div>
            <div>
              <span className="font-bold text-xl whitespace-nowrap">
                Trash4Cash
              </span>
              <p className="text-xs text-gray-500 mt-[-2px]">Admin Dashboard</p>
            </div>
          </div>
        </div>

        <div className="h-px bg-gray-200 my-2"></div>

        <div className="px-3">
          <ul className="flex flex-col gap-1">
            {menus.map((menu) => (
              <li key={menu.path}>
                <button
                  onClick={() => handleNavigation(menu.path)}
                  className={cn(
                    "w-full flex items-center gap-3 py-3.5 px-4 rounded-lg transition-all duration-200 font-medium",
                    location.pathname === menu.path
                      ? "bg-green-50 text-green-600"
                      : "hover:bg-gray-100"
                  )}
                >
                  <menu.icon
                    className={cn(
                      "h-5 w-5 flex-shrink-0",
                      location.pathname === menu.path
                        ? "text-green-500"
                        : "text-gray-500"
                    )}
                  />
                  <span className="flex-1">{menu.label}</span>
                  <ChevronRight
                    className={cn(
                      "h-4 w-4",
                      location.pathname === menu.path
                        ? "text-green-500 opacity-100"
                        : "opacity-40"
                    )}
                  />
                </button>
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-auto p-3 pb-5">
          <div className="h-px bg-gray-200 mb-3"></div>
          <ul>
            <li>
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 py-3.5 px-4 rounded-lg transition-colors text-red-500 hover:bg-red-50 hover:text-red-600 font-medium"
              >
                <LogOut className="h-5 w-5 flex-shrink-0" />
                <span className="flex-1">Logout</span>
              </button>
            </li>
          </ul>
        </div>
      </div>

      {isMobile && isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-20"
          onClick={toggleSidebar}
        ></div>
      )}
    </>
  );
}
