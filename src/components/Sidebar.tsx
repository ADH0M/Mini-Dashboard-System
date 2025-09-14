import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import useAuth from "../Hooks/useAuth";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const [auth, setAuth] = useAuth(); // ← تأكد إن useAuth يعيد [auth, setAuth]

  const navItems = [
    { name: "Home", path: "/" },
    { name: "Users", path: "/users" },
    { name: "Create User", path: "/create-user" },
  ];

  const isAuthenticated = Boolean(auth.email || auth.username);

  const handleLogout = () => {
    localStorage.removeItem("rememberedUser");
    sessionStorage.removeItem("rememberedUser");
    setAuth({});
    navigate("/");
  };

  return (
    <>
      {/* Hamburger Button for Mobile */}
      <button
        className="md:hidden fixed top-4 right-4 z-50 p-2 rounded-md bg-gray-700 text-white"
        onClick={() => setIsOpen(!isOpen)}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d={isOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}
          />
        </svg>
      </button>

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-gray-700 text-white transition-transform duration-300 ease-in-out md:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } md:static md:h-full`}
      >
        <div className="p-5 flex flex-col h-full justify-between">
          {/* Top section */}
          <div>
            <h1 className="text-xl font-bold mb-8 mt-3">Mini Dashboard</h1>
            <nav>
              <ul className="space-y-4">
                {navItems.map((item) => {
                  const isHome = item.path === "/";
                  if (!isHome && !isAuthenticated) return null;

                  return (
                    <li key={item.path}>
                      <Link
                        to={item.path}
                        className={`block px-4 py-2 rounded-md duration-200 ease-out transition-colors ${
                          location.pathname === item.path
                            ? "bg-blue-600"
                            : "hover:bg-gray-700"
                        }`}
                        onClick={() => setIsOpen(false)}
                      >
                        {item.name}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </nav>
          </div>

          {/* Logout section (bottom) */}
          {isAuthenticated && (
            <button
              onClick={handleLogout}
              className="mt-10 px-4 py-2 rounded-md bg-red-600 text-white hover:bg-red-700 transition-colors w-full"
            >
              Logout
            </button>
          )}
        </div>
      </div>

      {/* Overlay for Mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/10 backdrop-blur-sm z-30 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
};

export default Sidebar;
