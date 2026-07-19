import { useEffect, useState, useRef } from "react";
import { getAllProductsApi } from "../http";
import toast from "react-hot-toast";
import { ChevronLeft, ChevronRight } from "lucide-react"; // Import arrows


const CategoryCarousel = ({ categoryName, categoryProducts }) => {
  const scrollRef = useRef(null);

  const infiniteProducts = [
    ...categoryProducts,
    ...categoryProducts,
    ...categoryProducts,
  ];

  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;

    container.style.scrollBehavior = "auto";
    container.scrollLeft = container.scrollWidth / 3;
  }, [categoryProducts]);

  const handleScroll = () => {
    const container = scrollRef.current;
    if (!container) return;

    const maxScrollLeft = container.scrollWidth - container.clientWidth;
    const thirdOfWidth = container.scrollWidth / 3;

    if (container.scrollLeft <= 0) {
      container.style.scrollBehavior = "auto";
      container.scrollLeft = thirdOfWidth;
    }
    
    else if (container.scrollLeft >= maxScrollLeft - 10) {
      container.style.scrollBehavior = "auto";
      container.scrollLeft = thirdOfWidth * 2 - container.clientWidth;
    }
  };

  const scroll = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = scrollRef.current.offsetWidth;
      scrollRef.current.style.scrollBehavior = "smooth";
      scrollRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
      });
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-end justify-between">
        <div>
          <h3 className="text-2xl font-black tracking-tight text-black dark:text-white">
            {categoryName}
          </h3>
        </div>

        <div className="hidden items-center gap-2 md:flex">
          <button
            onClick={() => scroll("left")}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 bg-white text-black transition hover:bg-gray-50 active:scale-95 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white dark:hover:bg-zinc-700"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            onClick={() => scroll("right")}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 bg-white text-black transition hover:bg-gray-50 active:scale-95 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white dark:hover:bg-zinc-700"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>


      <div
        ref={scrollRef}
        onScroll={handleScroll}
       
        className="flex gap-6 overflow-x-auto snap-x snap-mandatory pb-4 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
      >
   
        {infiniteProducts.map((product, index) => (
          <div
          
            key={`${product.id}-${index}`}
            className="group relative flex cursor-pointer flex-col flex-shrink-0 snap-start w-[85vw] sm:w-[calc(50%-12px)] lg:w-[calc(25%-18px)]"
          >
            <div className="aspect-square w-full overflow-hidden rounded-2xl border border-gray-100 bg-gray-100 transition dark:border-zinc-800 dark:bg-zinc-800/50">
              <img
                src={product.imageUrl}
                alt={product.name}
                className="h-full w-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
                loading="lazy"
                decoding="async"
              />
            </div>

            <div className="mt-4 flex flex-1 flex-col justify-between">
              <div>
                <p className="text-xs font-medium text-gray-400">
                  {product.brand}
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
    </div>
  );
};

export default CategoryCarousel;