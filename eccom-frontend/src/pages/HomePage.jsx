import { useOutletContext } from "react-router-dom";
import CategoryCarousel from "./CategoryCarousel";
import { useStore } from "../context/StoreProvider";

export default function HomePage() {
 const { products } = useStore();

  const groupedProducts = products?.reduce((acc, product) => {
    if (!acc[product.category]) {
      acc[product.category] = [];
    }
    acc[product.category].push(product);
    return acc;
  }, {});

  return (
    <div className="space-y-12"> 
      
      <div className="rounded-3xl bg-zinc-900 p-8 text-white shadow-sm md:p-12 dark:bg-zinc-800 dark:border dark:border-zinc-700">
        <div className="max-w-md space-y-4">
          <span className="text-xs font-bold uppercase tracking-widest text-zinc-400">
            New Arrivals
          </span>
          <h2 className="text-4xl font-black tracking-tight md:text-5xl">
            The Premium Tech & Lifestyle Corner.
          </h2>
          <p className="text-sm text-zinc-400">
            Carefully curated essentials designed to elevate your everyday
            workflow and lifestyle.
          </p>
          <button className="rounded-xl bg-white px-5 py-2.5 text-sm font-semibold text-black transition active:scale-95 hover:bg-zinc-100 dark:bg-zinc-100 dark:hover:bg-white">
            Shop Collection
          </button>
        </div>
      </div>

     
      {products ? (
        <div className="space-y-16">
          {Object.entries(groupedProducts).map(([category, items]) => (
            <CategoryCarousel
              key={category}
              categoryName={category}
              categoryProducts={items}
            />
          ))}
        </div>
      ) : (
        <div className="flex h-64 w-full flex-col items-center justify-center gap-4">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-zinc-200 border-t-black dark:border-zinc-800 dark:border-t-white" />
          <p className="animate-pulse text-sm font-medium text-zinc-500">
            Loading Premium Categories...
          </p>
        </div>
      )}
    </div>
  );
}