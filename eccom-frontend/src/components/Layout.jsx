import { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import Header from "./Header";
import { Toaster } from "react-hot-toast";
import toast from "react-hot-toast";
import { getAllProductsApi } from "../http"; 

export default function Layout() {
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem("theme") === "dark";
  });
  
  const [products, setProducts] = useState(null);


  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);


  useEffect(() => {
    const loadProduct = async () => {
      try {
        const data = await getAllProductsApi();
        setProducts(data);
      } catch (err) {
        toast.error(err.message || "Unable to Fetch Products");
      }
    };
    
    if (!products) {
      loadProduct();
    }
  }, [products]);

  return (
    <div className="min-h-screen">
      <Toaster 
        position="top-right" 
        toastOptions={{
          className: 'dark:bg-zinc-900 dark:text-white dark:border dark:border-zinc-800 font-medium text-sm rounded-xl px-4 py-2.5 shadow-md',
          duration: 3000,
        }}
      />
      <Header darkMode={darkMode} setDarkMode={setDarkMode} />
      
      <main className="mx-auto max-w-7xl px-4 pb-12 pt-28">
        <Outlet context={{ products }} />
      </main>
    </div>
  );
}