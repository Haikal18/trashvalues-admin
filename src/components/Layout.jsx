import { Outlet } from "react-router-dom";
import { useState, useEffect } from "react";
import CustomSidebar from "./CustomSidebar";
import Navbar from "./Navbar";
import Footer from "./Footer";

function Layout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
      if (window.innerWidth >= 1024) {
        setIsSidebarOpen(true);
      } else {
        setIsSidebarOpen(false);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const isMobileView = windowWidth < 1024;

  return (
    <div className="flex min-h-screen flex-col bg-gray-50 py-10">
      <Navbar isMobileView={isMobileView} />

      <div className="flex h-full flex-1 pt-[60px]">
        <CustomSidebar
          isOpen={isSidebarOpen}
          toggleSidebar={toggleSidebar}
          isMobile={isMobileView}
        />

        <main
          className={`flex-1 transition-all duration-300 ${
            isMobileView
              ? "ml-0"
              : isSidebarOpen
              ? "ml-0 lg:ml-[280px]"
              : "ml-0"
          }`}
        >
          <Outlet />
        </main>
      </div>

      <Footer />
    </div>
  );
}

export default Layout;
