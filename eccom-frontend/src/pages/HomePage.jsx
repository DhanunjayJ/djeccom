import { useState } from "react";

const MOCK_PRODUCTS = [
  { id: 1, name: "Minimalist Leather Wallet", price: "$45.00", category: "Accessories", image: "https://images.unsplash.com/photo-1627123424574-724758594e93?w=500&auto=format&fit=crop&q=60" },
  { id: 2, name: "Wireless Mechanical Keyboard", price: "$125.00", category: "Tech", image: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=500&auto=format&fit=crop&q=60" },
  { id: 3, name: "Matte Black Water Bottle", price: "$32.00", category: "Lifestyle", image: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=500&auto=format&fit=crop&q=60" },
  { id: 4, name: "Premium Noise-Canceling Headphones", price: "$299.00", category: "Tech", image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&auto=format&fit=crop&q=60" },
];

export default function HomePage() {
  return (
    <div className="space-y-10">
      
 
      <div className="rounded-3xl bg-zinc-900 p-8 text-white md:p-12 shadow-sm">
        <div className="max-w-md space-y-4">
          <span className="text-xs font-bold uppercase tracking-widest text-zinc-400">New Arrivals</span>
          <h2 className="text-4xl font-black tracking-tight md:text-5xl">The Premium Tech & Lifestyle Corner.</h2>
          <p className="text-zinc-400 text-sm">Carefully curated essentials designed to elevate your everyday workflow and lifestyle.</p>
          <button className="rounded-xl bg-white px-5 py-2.5 text-sm font-semibold text-black transition hover:bg-zinc-100 active:scale-95">
            Shop Collection
          </button>
        </div>
      </div>


      <div className="space-y-6">
        <div>
          <h3 className="text-2xl font-black tracking-tight text-black">Featured Products</h3>
          <p className="text-sm text-gray-500">Handpicked items just for you</p>
        </div>

        <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
          {MOCK_PRODUCTS.map((product) => (
            <div key={product.id} className="group relative flex flex-col cursor-pointer">
           
              <div className="aspect-square w-full overflow-hidden rounded-2xl bg-gray-100 border border-gray-100 group-hover:opacity-90 transition">
                <img
                  src={product.image}
                  alt={product.name}
                  className="h-full w-full object-cover object-center"
                  loading="lazy"
                />
              </div>
              
              
              <div className="mt-4 flex flex-col justify-between flex-1">
                <div>
                  <p className="text-xs text-gray-400 font-medium">{product.category}</p>
                  <h4 className="text-sm font-bold text-gray-900 mt-0.5 line-clamp-1">{product.name}</h4>
                </div>
                <p className="text-sm font-black text-black mt-1">{product.price}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}