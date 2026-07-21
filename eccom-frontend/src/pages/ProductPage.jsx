import { useEffect } from "react";
import { useLocation, Link, Navigate } from "react-router-dom";
import { ArrowLeft, ShoppingCart, ShieldCheck, Truck } from "lucide-react";
import { useStore } from "../context/StoreProvider";

export default function ProductPage() {
  const location = useLocation();
  const product = location.state?.product;

  const { addToCart } = useStore();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  if (!product) {

    return <Navigate to="/" replace />;
  }

  const isOutOfStock = product.stockQuantity === 0;

  return (
    <div className="mx-auto max-w-7xl space-y-8 px-4 pt-8 md:px-6">
      <Link
        to="/"
        className="inline-flex items-center gap-2 text-sm font-medium text-gray-500 transition hover:text-black dark:text-gray-400 dark:hover:text-white"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Products
      </Link>

      <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-16">
        <div className="aspect-square w-full overflow-hidden rounded-3xl border border-gray-100 bg-gray-50 dark:border-zinc-800 dark:bg-zinc-900/50">
          <img
            src={product.imageUrl}
            alt={product.name}
            className="h-full w-full object-cover object-center"
          />
        </div>

        <div className="flex flex-col justify-center space-y-8">
          <div className="space-y-4">
            <p className="text-sm font-bold uppercase tracking-widest text-zinc-500 dark:text-zinc-400">
              {product.brand} • {product.category}
            </p>
            <h1 className="text-4xl font-black tracking-tight text-black dark:text-white sm:text-5xl">
              {product.name}
            </h1>
            <p className="text-3xl font-bold text-black dark:text-white">
              ${product.price}
            </p>
          </div>

          <p className="text-base leading-relaxed text-gray-600 dark:text-gray-300">
            {product.description}
          </p>

          <div className="space-y-4 pt-4">
  
            <button
              disabled={isOutOfStock}
              onClick={() => addToCart(product)}
              className={`flex w-full items-center justify-center gap-2 rounded-2xl px-8 py-4 text-lg font-bold transition active:scale-[0.98] ${
                isOutOfStock
                  ? "cursor-not-allowed bg-gray-200 text-gray-500 dark:bg-zinc-800 dark:text-gray-500"
                  : "bg-black text-white shadow-xl shadow-black/10 hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-gray-100"
              }`}
            >
              <ShoppingCart className="h-5 w-5" />
              {isOutOfStock ? "Out of Stock" : "Add to Cart"}
            </button>

            <p className={`text-center text-sm font-medium ${isOutOfStock ? "text-red-500" : "text-green-600 dark:text-green-400"}`}>
              {isOutOfStock ? "Currently unavailable." : `In Stock (${product.stockQuantity} available)`}
            </p>
          </div>


          <div className="grid grid-cols-2 gap-4 rounded-2xl border border-gray-100 bg-gray-50 p-6 dark:border-zinc-800 dark:bg-zinc-900/50">
            <div className="flex items-center gap-3">
              <Truck className="h-6 w-6 text-gray-400" />
              <p className="text-sm font-medium text-gray-900 dark:text-white">Free express shipping</p>
            </div>
            <div className="flex items-center gap-3">
              <ShieldCheck className="h-6 w-6 text-gray-400" />
              <p className="text-sm font-medium text-gray-900 dark:text-white">1-year warranty</p>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
}
