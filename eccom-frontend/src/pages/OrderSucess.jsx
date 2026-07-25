import { useNavigate } from "react-router-dom";

export default function OrderSuccess() {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
      <div className="mb-8 flex h-24 w-24 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30">
        <svg 
          className="h-12 w-12 text-green-600 dark:text-green-500" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24" 
          xmlns="http://www.w3.org/2000/svg"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
        </svg>
      </div>
      
      <h1 className="mb-4 text-3xl font-black text-black dark:text-white">
        Payment Successful!
      </h1>
      
      <p className="mb-8 max-w-md text-gray-600 dark:text-gray-400">
        Thank you for your purchase. Your order has been placed successfully and is now being processed.
      </p>
      
      <div className="flex gap-4">
        <button 
          onClick={() => navigate("/")}
          className="rounded-2xl bg-black px-8 py-4 text-sm font-bold text-white transition active:scale-95 hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-gray-100"
        >
          Continue Shopping
        </button>
      </div>
    </div>
  );
}