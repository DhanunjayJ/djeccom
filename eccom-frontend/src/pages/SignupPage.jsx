
import { Link, useNavigate } from "react-router-dom";

export default function SignupPage() {
  const navigate = useNavigate();

  const handleSignup = (e) => {
    e.preventDefault();

    navigate("/");
  };

  return (
    <div className="mx-auto mt-12 max-w-md rounded-2xl border border-gray-100 bg-white p-8 shadow-sm">
      <h2 className="text-2xl font-black text-black mb-6">Create Account</h2>
      <form onSubmit={handleSignup} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
          <input type="text" required className="w-full rounded-xl border border-gray-200 px-4 py-2 text-sm focus:border-black focus:outline-none focus:ring-1 focus:ring-black" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <input type="email" required className="w-full rounded-xl border border-gray-200 px-4 py-2 text-sm focus:border-black focus:outline-none focus:ring-1 focus:ring-black" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
          <input type="password" required className="w-full rounded-xl border border-gray-200 px-4 py-2 text-sm focus:border-black focus:outline-none focus:ring-1 focus:ring-black" />
        </div>
        <button type="submit" className="w-full rounded-xl bg-black py-2.5 text-sm font-semibold text-white transition hover:bg-zinc-900 active:scale-[0.98]">
          Register
        </button>
      </form>
      <p className="mt-6 text-center text-sm text-gray-600">
        Already have an account?{" "}
        <Link to="/login" className="font-semibold text-black hover:underline">
          Sign In
        </Link>
      </p>
    </div>
  );
}