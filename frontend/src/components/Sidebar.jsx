import { NavLink, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  LayoutDashboard,
  Briefcase,
  Users,
  FileText,
  LogOut,
  FolderOpen,
  Plus,
  Tags,
  BookOpen,
} from "lucide-react";
import logo from "../assets/logo.png";

function Sidebar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    // ✅ clear auth
    localStorage.removeItem("token");
    localStorage.removeItem("admin"); // if you stored admin data
    localStorage.clear(); // optional (remove if you store other keys)


    navigate("/signin");
  };

  const menuItems = [
    {
      title: "Dashboard",
      icon: LayoutDashboard,
      path: "/dashboard",
    },
    {
      title: "Portfolio Management",
      icon: Briefcase,
      submenu: [
        {
          title: "Categories",
          path: "/portfolio/categories",
          icon: FolderOpen,
        },
        { title: "Create Portfolio", path: "/portfolio/create", icon: Plus },
      ],
    },
    {
      title: "Jobs Management",
      icon: Users,
      submenu: [
        { title: "Create Job", path: "/jobs/create", icon: Plus },
        { title: "Applications", path: "/jobs/applications", icon: FileText },
      ],
    },
    {
      title: "Blog Management",
      icon: BookOpen,
      submenu: [
        { title: "Categories", path: "/blogs/categories", icon: FolderOpen },
        { title: "Tags", path: "/blogs/tags", icon: Tags },
        { title: "Create Blog", path: "/blogs/create", icon: Plus },
      ],
    },
  ];

  return (
    <div className="h-screen w-64 bg-[#f7f7f7] border-r border-gray-200 fixed left-0 top-0 flex flex-col">
      <div className="h-16 flex items-center px-6 border-b border-gray-200">
        <img src={logo} alt="Tech Rabbit" className="h-10 w-10" />
        <span className="ml-3 text-xl font-bold text-gray-900">
          Tech Rabbit
        </span>
      </div>

      <nav className="flex-1 overflow-y-auto py-6 px-3">
        <div className="space-y-1">
          {menuItems.map((item, index) => (
            <div key={index}>
              {item.submenu ? (
                <div className="mb-2">
                  <div className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    <item.icon className="inline h-4 w-4 mr-2" />
                    {item.title}
                  </div>
                  <div className="ml-4 space-y-1">
                    {item.submenu.map((subItem, subIndex) => (
                      <NavLink
                        key={subIndex}
                        to={subItem.path}
                        className={({ isActive }) =>
                          `flex items-center px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                            isActive
                              ? "bg-primary-50 text-[#25b485]"
                              : "text-gray-700 hover:bg-gray-50"
                          }`
                        }
                      >
                        {({ isActive }) => (
                          <>
                            <subItem.icon className="h-5 w-5 mr-3" />
                            {subItem.title}
                            {isActive && (
                              <motion.div
                                layoutId="activeTab"
                                className="absolute left-0 w-1 h-8 bg-[#25b485] rounded-r"
                              />
                            )}
                          </>
                        )}
                      </NavLink>
                    ))}
                  </div>
                </div>
              ) : (
                <NavLink
                  to={item.path}
                  className={({ isActive }) =>
                    `flex items-center px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                      isActive
                        ? "bg-primary-50 text-[#25b485]"
                        : "text-gray-700 hover:bg-gray-50"
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      <item.icon className="h-5 w-5 mr-3" />
                      {item.title}
                      {isActive && (
                        <motion.div
                          layoutId="activeTab"
                          className="absolute left-0 w-1 h-8 bg-[#25b485] rounded-r"
                        />
                      )}
                    </>
                  )}
                </NavLink>
              )}
            </div>
          ))}
        </div>
      </nav>

      <div className="p-4 border-t border-gray-200">
        <button
          onClick={handleLogout}
          className="flex items-center w-full px-3 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
        >
          <LogOut className="h-5 w-5 mr-3" />
          Logout
        </button>
      </div>
    </div>
  );
}

export default Sidebar;
