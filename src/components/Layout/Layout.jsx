import { AnimatePresence, motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { NavLink } from "react-router-dom";
import { useApp } from "../../context/AppContext";
import { translations } from "../../locales/translations";

const navItems = [
  { to: "/dashboard", key: "dashboard" },
  { to: "/upload", key: "upload" },
  { to: "/chat", key: "chat" },
  { to: "/analytics", key: "analytics" },
  { to: "/documents", key: "documents" },
];

const Layout = ({ children }) => {
  const { state, actions } = useApp();
  const [isOpen, setIsOpen] = useState(false);
  const t = translations[state.language].layout;

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
    actions.setSidebarOpen(!isOpen);
  };

  const toggleLanguage = () => {
    actions.setLanguage(state.language === "en" ? "ml" : "en");
  };

  return (
    <div className="flex min-h-screen bg-secondary text-white relative z-10">

  {/* Sidebar - Desktop */}
  <div className="hidden md:flex fixed top-0 left-0 h-screen w-64 bg-secondary-900 border-r border-secondary-700/50 flex-col overflow-hidden">
        <div className="p-6">
          <h2 className="text-xl font-bold text-white mb-8">SoochiRail</h2>
          <nav className="space-y-2">
            {navItems.map((item) => (
              <NavLink
                key={item.key}
                to={item.to}
                className={({ isActive }) =>
                  `flex items-center p-3 rounded-lg text-sm transition ${
                    isActive
                      ? "bg-primary-600/20 text-primary-300"
                      : "text-secondary-300 hover:bg-secondary-800/50"
                  }`
                }
              >
                {t[item.key]}
              </NavLink>
            ))}
          </nav>
        </div>
        <div className="mt-auto p-6">
          <button
            onClick={toggleLanguage}
            className="text-sm text-secondary-300 hover:text-primary-300"
          >
            {t.language}
          </button>
        </div>
      </div>

      {/* Sidebar - Mobile */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Overlay */}
            <motion.div
              className="fixed inset-0 bg-black/50 z-40 md:hidden "
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={toggleSidebar}
            />

            {/* Drawer */}
            <motion.div
              initial={{ x: -250 }}
              animate={{ x: 0 }}
              exit={{ x: -250 }}
              transition={{ duration: 0.3 }}
              className="fixed top-0 left-0 h-full w-64 bg-secondary-900 border-r border-secondary-700/50 z-50 flex flex-col"
            >
              <div className="p-6">
                <h2 className="text-xl font-bold text-white mb-8">KMRL KKO</h2>
                <nav className="space-y-2">
                  {navItems.map((item) => (
                    <NavLink
                      key={item.key}
                      to={item.to}
                      className={({ isActive }) =>
                        `flex items-center p-3 rounded-lg text-sm transition ${
                          isActive
                            ? "bg-primary-600/20 text-primary-300"
                            : "text-secondary-300 hover:bg-secondary-800/50"
                        }`
                      }
                      onClick={toggleSidebar}
                    >
                      {t[item.key]}
                    </NavLink>
                  ))}
                </nav>
              </div>
              <div className="mt-auto p-6">
                <button
                  onClick={toggleLanguage}
                  className="text-sm text-secondary-300 hover:text-primary-300"
                >
                  {t.language}
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

  {/* Main Content */}
  <div className="flex-1 p-6 lg:p-10 md:ml-64">
        {/* Toggle Button for Mobile */}
        <button
          onClick={toggleSidebar}
          className="fixed top-4 left-4 z-50 p-2 rounded-lg bg-secondary-800/50 text-white hover:bg-primary-600/50 md:hidden"
        >
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>

        <div className="max-w-7xl mx-auto">{children}</div>
      </div>
    </div>
  );
};

export default Layout;