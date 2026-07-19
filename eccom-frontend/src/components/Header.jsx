import { useState, useEffect } from "react";
import { ShoppingCart, User, Search, LogOut, Sun, Moon } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

export default function Header({ darkMode, setDarkMode }) {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error("Failed to parse user data from localStorage");
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
    navigate("/");
  };

  return (
    <>
      <header className="sticky top-4 z-50 mx-4 mt-4 max-w-7xl rounded-2xl border border-gray-100 bg-white/70 shadow-sm backdrop-blur-md xl:mx-auto dark:border-zinc-800 dark:bg-zinc-900/70">
        <div className="flex flex-wrap items-center justify-between gap-y-4 px-4 py-3 md:px-6 md:py-4">
          
          <div className="order-1 flex items-center md:flex-1">
            <Link
              to="/"
              className="block select-none text-xl font-black tracking-tight text-black transition hover:opacity-80 md:text-2xl dark:text-white"
            >
              DJCorner
            </Link>
          </div>

          <div className="order-3 w-full md:order-2 md:flex-2 md:flex md:justify-center">
            <div className="relative w-full md:max-w-md">
              <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search products..."
                className="w-full rounded-full border border-gray-200 bg-gray-50/50 py-2.5 pl-10 pr-5 text-sm text-gray-900 transition-all placeholder:text-gray-400 focus:border-black focus:bg-white focus:outline-none focus:ring-2 focus:ring-gray-100 dark:border-zinc-700 dark:bg-zinc-800/50 dark:text-white dark:focus:border-white dark:focus:ring-zinc-800"
              />
            </div>
          </div>

          <div className="order-2 flex items-center justify-end gap-2 md:order-3 md:flex-1 md:gap-4">
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="rounded-full p-2 text-gray-500 transition hover:bg-gray-100 hover:text-black dark:text-gray-400 dark:hover:bg-zinc-800 dark:hover:text-white"
              title="Toggle Dark Mode"
            >
              {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>

            {user ? (
              <div className="flex items-center gap-1.5 md:gap-2">
                <div className="flex items-center justify-center gap-1.5 rounded-full bg-gray-100 p-2 text-sm font-medium text-gray-800 md:px-4 md:py-2 dark:bg-zinc-800 dark:text-zinc-200">
                  <User className="h-4 w-4" />
                  <span className="hidden max-w-30 truncate md:block">
                    Hi, {user.userName}
                  </span>
                </div>
                <button
                  onClick={handleLogout}
                  className="rounded-full p-2 text-gray-500 transition hover:bg-gray-100 hover:text-black dark:text-gray-400 dark:hover:bg-zinc-800 dark:hover:text-white"
                  title="Log Out"
                >
                  <LogOut className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className="flex items-center justify-center gap-1.5 rounded-full border border-gray-200 p-2 text-sm font-medium text-gray-700 transition active:scale-95 hover:bg-gray-50 hover:text-black md:px-4 md:py-2 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800 dark:hover:text-white"
              >
                <User className="h-4 w-4" />
                <span className="hidden md:inline">Login / Signup</span>
              </Link>
            )}

            <button className="relative hidden items-center gap-1.5 rounded-full bg-black px-4 py-2 text-sm font-medium text-white shadow-sm transition active:scale-95 hover:bg-zinc-900 md:flex dark:bg-white dark:text-black dark:hover:bg-zinc-100">
              <ShoppingCart className="h-4 w-4" />
              <span>Cart</span>
              <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full border border-white bg-black text-[10px] font-bold text-white dark:border-zinc-900 dark:bg-white dark:text-black">
                0
              </span>
            </button>
          </div>
        </div>
      </header>

      <button className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-black text-white shadow-xl transition active:scale-95 md:hidden dark:bg-white dark:text-black">
        <ShoppingCart className="h-6 w-6" />
        <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full border-2 border-white bg-black text-[10px] font-bold text-white dark:border-zinc-900 dark:bg-white dark:text-black">
          0
        </span>
      </button>
    </>
  );
}