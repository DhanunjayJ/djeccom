import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { signUpApi } from "../http"; 

export default function SignupPage() {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const formData = new FormData(e.target);
    const signUpData = Object.fromEntries(formData.entries());

    try {
      await signUpApi(signUpData);
      
      toast.success("Account created successfully! Redirecting to login...");

      setTimeout(() => {
        navigate("/login");
      }, 1500);

    } catch (error) {
      toast.error(error.message || "Registration failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mx-auto mt-12 max-w-md rounded-2xl border border-gray-100 bg-white p-8 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
      <h2 className="mb-6 text-2xl font-black text-black dark:text-white">Create Account</h2>
      
      <form onSubmit={handleSignup} className="space-y-4">
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-zinc-300">
            Full Name
          </label>
          <input 
            type="text" 
            name="userName" 
            required 
            disabled={isLoading}
            className="w-full rounded-xl border border-gray-200 bg-transparent px-4 py-2 text-sm text-black focus:border-black focus:outline-none focus:ring-1 focus:ring-black disabled:opacity-50 dark:border-zinc-700 dark:text-white dark:focus:border-white" 
          />
        </div>
        
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-zinc-300">
            Email
          </label>
          <input 
            type="email" 
            name="email" 
            required 
            disabled={isLoading}
            className="w-full rounded-xl border border-gray-200 bg-transparent px-4 py-2 text-sm text-black focus:border-black focus:outline-none focus:ring-1 focus:ring-black disabled:opacity-50 dark:border-zinc-700 dark:text-white dark:focus:border-white" 
          />
        </div>
        
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-zinc-300">
            Password
          </label>
          <input 
            type="password" 
            name="password" 
            required 
            disabled={isLoading}
            className="w-full rounded-xl border border-gray-200 bg-transparent px-4 py-2 text-sm text-black focus:border-black focus:outline-none focus:ring-1 focus:ring-black disabled:opacity-50 dark:border-zinc-700 dark:text-white dark:focus:border-white" 
          />
        </div>
        
        <button 
          type="submit" 
          disabled={isLoading}
          className="w-full rounded-xl bg-black py-2.5 text-sm font-semibold text-white transition hover:bg-zinc-900 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 active:scale-[0.98] disabled:bg-zinc-400 dark:bg-white dark:text-black dark:hover:bg-zinc-100 dark:disabled:bg-zinc-700 dark:focus:ring-white dark:focus:ring-offset-zinc-900"
        >
          {isLoading ? "Registering..." : "Register"}
        </button>
      </form>
      
      <p className="mt-6 text-center text-sm text-gray-600 dark:text-zinc-400">
        Already have an account?{" "}
        <Link to="/login" className="font-semibold text-black hover:underline dark:text-white">
          Sign In
        </Link>
      </p>
    </div>
  );
}