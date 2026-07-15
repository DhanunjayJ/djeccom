import { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import Header from "./Header";
import { Toaster } from "react-hot-toast"; 

export default function Layout() {
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem("theme") === "dark";
  });


  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  return (
    <div className="min-h-screen bg-gray-50/50 transition-colors duration-300 dark:bg-zinc-950">
      <Toaster 
        position="top-right" 
        toastOptions={{
          className: 'dark:bg-zinc-900 dark:text-white dark:border dark:border-zinc-800 font-medium text-sm rounded-xl px-4 py-2.5 shadow-md',
          duration: 3000,
        }}
      />
      <Header darkMode={darkMode} setDarkMode={setDarkMode} />
      
      <main className="mx-auto max-w-7xl px-4 pt-28 pb-12">
        <Outlet />
      </main>
    </div>
  );
}