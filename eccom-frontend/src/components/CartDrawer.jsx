import { useStore } from "../context/StoreProvider";
import { X, Trash2, Minus, Plus } from "lucide-react";

export default function CartDrawer() {
  const { cart, isCartOpen, setIsCartOpen, removeFromCart, updateQuantity,cartTotal } = useStore();

  return (
    <>
      {isCartOpen && (
        <div
          className="fixed inset-0 z-[60] bg-black/40 backdrop-blur-sm transition-opacity"
          onClick={() => setIsCartOpen(false)}
        />
      )}

      <div
        className={`fixed bottom-0 right-0 top-0 z-[70] flex w-full max-w-md flex-col bg-white shadow-2xl transition-transform duration-300 ease-in-out dark:bg-zinc-900 ${
          isCartOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between border-b border-gray-100 p-6 dark:border-zinc-800">
          <h2 className="text-xl font-black text-black dark:text-white">
            Your Cart
          </h2>
          <button
            onClick={() => setIsCartOpen(false)}
            className="rounded-full p-2 text-gray-500 transition hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-zinc-800"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {cart.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center text-center">
              <p className="text-gray-500 dark:text-gray-400">
                Your cart is empty.
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {cart.map((item, index) => (
                <div key={index} className="flex gap-4">
                  <img
                    src={item.product.imageUrl}
                    alt={item.product.name}
                    className="h-24 w-24 rounded-2xl bg-gray-100 object-cover dark:bg-zinc-800"
                  />

                  <div className="flex flex-1 flex-col justify-between py-1">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h4 className="line-clamp-1 text-sm font-bold text-gray-900 dark:text-white">
                          {item.product.name}
                        </h4>
                        <p className="mt-1 text-sm font-medium text-gray-500">
                          ${item.product.price}
                        </p>
                      </div>
                      <button
                        onClick={() => removeFromCart(item.product.id)}
                        className="rounded-full p-1.5 text-gray-400 transition hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-500/10"
                        title="Remove item"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>

                    <div className="mt-2 flex items-center gap-3">
                      <div className="flex items-center rounded-full border border-gray-200 dark:border-zinc-700">
                        <button
                          onClick={() =>
                            updateQuantity(item.product.id, item.quantity - 1)
                          }
                          disabled={item.quantity <= 1}
                          className="flex h-8 w-8 items-center justify-center rounded-l-full text-gray-500 transition hover:bg-gray-50 disabled:opacity-50 dark:text-gray-400 dark:hover:bg-zinc-800"
                        >
                          <Minus className="h-3 w-3" />
                        </button>

                        <span className="flex w-8 items-center justify-center text-sm font-bold text-black dark:text-white">
                          {item.quantity}
                        </span>

                        <button
                          onClick={() =>
                            updateQuantity(item.product.id, item.quantity + 1)
                          }
                          disabled={item.quantity >= item.product.stockQuantity}
                          className="flex h-8 w-8 items-center justify-center rounded-r-full text-gray-500 transition hover:bg-gray-50 disabled:opacity-50 dark:text-gray-400 dark:hover:bg-zinc-800"
                        >
                          <Plus className="h-3 w-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

       
        {cart.length > 0 && (
          <div className="border-t border-gray-100 p-6 dark:border-zinc-800">
            <div className="mb-4 flex items-center justify-between text-lg font-black text-black dark:text-white">
              <span>Subtotal</span>
              <span>${cartTotal.toFixed(2)}</span>
            </div>
            
            <button className="w-full rounded-2xl bg-black py-4 text-sm font-bold text-white transition active:scale-95 hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-gray-100">
              Proceed to Checkout
            </button>
          </div>
        )}
      </div>
    </>
  );
}
