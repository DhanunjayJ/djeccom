import { ShoppingCart, User, Search } from "lucide-react";
import { Link } from "react-router-dom";

export default function Header() {
  return (
    <header className="sticky top-4 z-50 mx-4 mt-4 max-w-7xl border border-gray-100 bg-white/70 shadow-sm backdrop-blur-md rounded-2xl xl:mx-auto ">
      <div className="flex items-center justify-between px-6 py-4 gap-4">
        <div className="flex-shrink-0">
          <Link
            to="/"
            className="block text-2xl font-black tracking-tight text-black transition hover:opacity-80 dark:text-white select-none"
          >
            DJCorner
          </Link>
        </div>

        <div className="max-w-md flex-1">
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search products..."
              className="w-full rounded-full border border-gray-200 bg-gray-50/50 pl-10 pr-5 py-2 text-sm text-gray-900 transition-all placeholder:text-gray-400 focus:border-black focus:bg-white focus:outline-none focus:ring-2 focus:ring-gray-100"
            />
          </div>
        </div>

        <div className="flex items-center gap-4">
          <Link
            to="/login"
            className="flex items-center gap-1.5 rounded-full border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50 hover:text-black active:scale-95"
          >
            <User className="h-4 w-4" />
            <span>Login / Signup</span>
          </Link>

          <button className="relative flex items-center gap-1.5 rounded-full bg-black px-4 py-2 text-sm font-medium text-white transition hover:bg-zinc-900 active:scale-95 shadow-sm">
            <ShoppingCart className="h-4 w-4" />
            <span>Cart</span>
            <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-black text-[10px] font-bold text-white border border-white">
              0
            </span>
          </button>
        </div>
      </div>
    </header>
  );
}
