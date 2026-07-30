import { useState, useEffect, useRef } from "react";
import { ShoppingCart, User, Search, LogOut, Sun, Moon, Package } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useStore } from "../context/StoreContext";
import { clearUser, getStoredUser } from "../auth";

export default function Header({ darkMode, setDarkMode }) {
  const [user, setUser] = useState(getStoredUser);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const { totalCartItems, setIsCartOpen, setCart } = useStore();
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleExpiredAuth = () => setUser(null);
    window.addEventListener("auth:expired", handleExpiredAuth);
    return () => window.removeEventListener("auth:expired", handleExpiredAuth);
  }, []);


  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownRef]);

  const handleLogout = () => {
    clearUser();
    setCart([]);
    setUser(null);
    setIsDropdownOpen(false); 
    navigate("/");
  };

  return (
    <>
      <header className="sticky top-4 z-50 mx-4 mt-4 max-w-7xl rounded-4xl border border-gray-100 bg-white/70 shadow-sm backdrop-blur-md xl:mx-auto dark:border-zinc-800 dark:bg-zinc-900/70">
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
              <div className="relative flex items-center gap-1.5 md:gap-2" ref={dropdownRef}>
                <button 
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center justify-center gap-1.5 rounded-full bg-gray-100 p-2 text-sm font-medium text-gray-800 transition hover:bg-gray-200 md:px-4 md:py-2 dark:bg-zinc-800 dark:text-zinc-200 dark:hover:bg-zinc-700"
                >
                  <User className="h-4 w-4" />
                  <span className="hidden max-w-30 truncate md:block">
                    Hi, {user.userName || user.name || "User"}
                  </span>
                </button>

                {/* Dropdown Menu */}
                {isDropdownOpen && (
                  <div className="absolute right-0 top-full mt-2 w-48 overflow-hidden rounded-xl border border-gray-100 bg-white shadow-lg dark:border-zinc-700 dark:bg-zinc-800">
                    <div className="flex flex-col py-1">
                      <Link
                        to="/orders"
                        onClick={() => setIsDropdownOpen(false)}
                        className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 transition hover:bg-gray-50 dark:text-gray-200 dark:hover:bg-zinc-700/50"
                      >
                        <Package className="h-4 w-4" />
                        My Orders
                      </Link>
                      <div className="mx-4 my-1 border-t border-gray-100 dark:border-zinc-700"></div>
                      <button
                        onClick={handleLogout}
                        className="flex w-full items-center gap-3 px-4 py-3 text-left text-sm text-red-600 transition hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-500/10"
                      >
                        <LogOut className="h-4 w-4" />
                        Logout
                      </button>
                    </div>
                  </div>
                )}
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

            <button 
              onClick={() => setIsCartOpen(true)}
              className="relative hidden items-center gap-1.5 rounded-full bg-black px-4 py-2 text-sm font-medium text-white shadow-sm transition active:scale-95 hover:bg-zinc-900 md:flex dark:bg-white dark:text-black dark:hover:bg-zinc-100"
            >
              <ShoppingCart className="h-4 w-4" />
              <span>Cart</span>
              <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full border border-white bg-black text-[10px] font-bold text-white dark:border-zinc-900 dark:bg-white dark:text-black">
                {totalCartItems}
              </span>
            </button>
          </div>
        </div>
      </header>

      <button 
        onClick={() => setIsCartOpen(true)}
        className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-black text-white shadow-xl transition active:scale-95 md:hidden dark:bg-white dark:text-black"
      >
        <ShoppingCart className="h-6 w-6" />
        <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full border-2 border-white bg-black text-[10px] font-bold text-white dark:border-zinc-900 dark:bg-white dark:text-black">
          {totalCartItems}
        </span>
      </button>
    </>
  );
}
