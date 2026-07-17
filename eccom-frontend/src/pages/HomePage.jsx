import { useEffect, useState } from "react";
import { getAllProductsApi } from "../http";
import toast from "react-hot-toast";

export default function HomePage() {
  const [products, setProducts] = useState(null);

  useEffect(() => {
    const loadProduct = async () => {
      try {
        const products = await getAllProductsApi();
        setProducts(products);
      } catch (err) {
        toast.error(err.message || "Unable to Fetch Products");
      }
    };
    loadProduct();
  }, []);

  return (
    <div className="space-y-10">
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

      <div className="space-y-6">
        <div>
          <h3 className="text-2xl font-black tracking-tight text-black dark:text-white">
            Featured Products
          </h3>
          <p className="text-sm text-gray-500 dark:text-zinc-400">
            Handpicked items just for you
          </p>
        </div>

        {products ? (
          <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
            {products.map((product) => (
              <div
                key={product.id}
                className="group relative flex cursor-pointer flex-col"
              >
                <div className="aspect-square w-full overflow-hidden rounded-2xl border border-gray-100 bg-gray-100 transition dark:border-zinc-800 dark:bg-zinc-800/50">
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="h-full w-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                  />
                </div>

                <div className="mt-4 flex flex-1 flex-col justify-between">
                  <div>
                    <p className="text-xs font-medium text-gray-400">
                      {product.category}
                    </p>
                    <h4 className="mt-0.5 line-clamp-1 text-sm font-bold text-gray-900 dark:text-gray-100">
                      {product.name}
                    </h4>
                  </div>
                  <p className="mt-1 text-sm font-black text-black dark:text-white">
                    ${product.price}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex h-64 w-full flex-col items-center justify-center gap-4">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-zinc-200 border-t-black dark:border-zinc-800 dark:border-t-white" />
            <p className="animate-pulse text-sm font-medium text-zinc-500">
              Loading Premium Products...
            </p>
          </div>
        )}
      </div>
    </div>
  );
}