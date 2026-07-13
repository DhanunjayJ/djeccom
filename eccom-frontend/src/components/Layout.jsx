import { Outlet } from "react-router-dom";
import Header from "./Header";

export default function Layout() {
  return (
    <div className="min-h-screen bg-gray-50/50">
      <Header />
      <main className="mx-auto max-w-7xl px-4 pt-28 pb-12">
        <Outlet />
      </main>
    </div>
  );
}