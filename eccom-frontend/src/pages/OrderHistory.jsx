import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { getOrderHistoryApi } from "../http";

export default function OrderHistory() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      const user = JSON.parse(localStorage.getItem("user"));
      
      if (!user || !user.email) {
        toast.error("Please log in to view your orders.");
        navigate("/login");
        return;
      }

      try {
        const data = await getOrderHistoryApi(user.email);
        const sortedOrders = data.sort((a, b) => b.id - a.id);
        setOrders(sortedOrders);
      } catch (error) {
        console.error("Failed to fetch orders:", error);
        toast.error("Could not load order history.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [navigate]);

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-black border-t-transparent dark:border-white dark:border-t-transparent"></div>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center text-center">
        <h2 className="mb-4 text-2xl font-black text-black dark:text-white">No orders yet</h2>
        <p className="mb-6 text-gray-500 dark:text-gray-400">Looks like you haven't made any purchases.</p>
        <button 
          onClick={() => navigate("/")}
          className="rounded-2xl bg-black px-6 py-3 text-sm font-bold text-white transition hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-gray-100"
        >
          Start Shopping
        </button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <h1 className="mb-8 text-3xl font-black text-black dark:text-white">Order History</h1>
      
      <div className="space-y-6">
        {orders.map((order) => (
          <div 
            key={order.id} 
            className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900"
          >
          
            <div className="border-b border-gray-100 bg-gray-50 px-6 py-4 dark:border-zinc-800 dark:bg-zinc-950 flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-gray-500">Order ID</p>
                <p className="font-mono text-sm font-medium text-black dark:text-white">#{order.id}</p>
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-gray-500">Total Amount</p>
                <p className="font-bold text-black dark:text-white">${order.totalAmount?.toFixed(2)}</p>
              </div>
              <div>
                <span className={`inline-flex rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wide
                  ${order.status === 'PAID' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' : 
                    order.status === 'SHIPPED' ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400' :
                    order.status === 'DELIVERED' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
                    'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300'}`}
                >
                  {order.status}
                </span>
              </div>
            </div>


            <div className="p-6">
              <div className="space-y-4">
                {order.orderItems?.map((item, index) => (
                  <div key={index} className="flex items-center gap-4">
                    <img
                      src={item.product?.imageUrl}
                      alt={item.product?.name}
                      className="h-16 w-16 rounded-xl bg-gray-100 object-cover dark:bg-zinc-800"
                    />
                    <div className="flex-1">
                      <h4 className="line-clamp-1 font-bold text-gray-900 dark:text-white">
                        {item.product?.name}
                      </h4>
                      <p className="text-sm font-medium text-gray-500">
                        Qty: {item.quantity} × ${item.priceAtPurchase}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}