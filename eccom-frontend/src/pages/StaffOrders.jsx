import { useEffect, useState } from "react";
import { PackageCheck, RefreshCw } from "lucide-react";
import toast from "react-hot-toast";
import { getStoredUser } from "../auth";
import { getStaffOrdersApi, updateOrderStatusApi } from "../http";

const TRANSITIONS = {
  PENDING_PAYMENT: ["PAID", "PAYMENT_FAILED", "CANCELLED"],
  PAID: ["CONFIRMED", "CANCELLED", "REFUNDED"],
  CONFIRMED: ["PACKED", "CANCELLED"],
  PACKED: ["SHIPPED"],
  SHIPPED: ["IN_TRANSIT", "DELIVERED"],
  IN_TRANSIT: ["DELIVERED", "DELIVERY_FAILED"],
  DELIVERY_FAILED: ["IN_TRANSIT", "CANCELLED"],
  DELIVERED: ["RETURN_REQUESTED"],
  RETURN_REQUESTED: ["RETURNED", "RETURN_REJECTED"],
  RETURNED: ["REFUNDED"],
};

const FULFILLMENT_TARGETS = new Set([
  "CONFIRMED",
  "PACKED",
  "SHIPPED",
  "IN_TRANSIT",
  "DELIVERY_FAILED",
  "DELIVERED",
  "RETURNED",
]);

export default function StaffOrders() {
  const user = getStoredUser();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);

  const loadOrders = async () => {
    setLoading(true);
    try {
      setOrders(await getStaffOrdersApi());
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let cancelled = false;
    getStaffOrdersApi()
      .then((data) => {
        if (!cancelled) setOrders(data);
      })
      .catch((error) => {
        if (!cancelled) toast.error(error.message);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const allowedTargets = (status) => {
    const targets = TRANSITIONS[status] ?? [];
    return user.role === "FULFILLMENT"
      ? targets.filter((target) => FULFILLMENT_TARGETS.has(target))
      : targets;
  };

  const changeStatus = async (order, status) => {
    const note = window.prompt(`Optional note for ${status}:`, "") ?? "";
    setUpdatingId(order.id);
    try {
      const updatedOrder = await updateOrderStatusApi(order.id, status, note);
      setOrders((current) =>
        current.map((item) => item.id === order.id ? updatedOrder : item),
      );
      toast.success(`Order #${order.id} moved to ${status}`);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="mx-auto max-w-6xl space-y-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-gray-500">Order operations</p>
          <h1 className="mt-2 text-3xl font-black dark:text-white">Staff Order Console</h1>
          <p className="mt-2 text-sm text-gray-500">
            Signed in as {user.role}. {user.role === "SUPPORT" && "Order status is read-only for support."}
          </p>
        </div>
        <button onClick={loadOrders} className="flex items-center gap-2 rounded-xl border px-4 py-2 text-sm font-bold dark:border-zinc-700 dark:text-white">
          <RefreshCw className="h-4 w-4" /> Refresh
        </button>
      </div>

      {loading ? (
        <div className="py-24 text-center font-semibold dark:text-white">Loading orders…</div>
      ) : orders.length === 0 ? (
        <div className="rounded-2xl border border-dashed p-16 text-center text-gray-500 dark:border-zinc-700">No orders found.</div>
      ) : (
        <div className="space-y-5">
          {orders.map((order) => {
            const targets = allowedTargets(order.status);
            return (
              <article key={order.id} className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
                <header className="flex flex-wrap items-center justify-between gap-4 border-b bg-gray-50 px-6 py-4 dark:border-zinc-800 dark:bg-zinc-950">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-gray-500">Order #{order.id}</p>
                    <p className="font-bold dark:text-white">{order.user?.userName} · {order.user?.email}</p>
                  </div>
                  <div className="text-right">
                    <span className="inline-flex rounded-full bg-blue-100 px-3 py-1 text-xs font-black text-blue-700 dark:bg-blue-950 dark:text-blue-300">{order.status}</span>
                    <p className="mt-1 font-black dark:text-white">₹{order.totalAmount}</p>
                  </div>
                </header>

                <div className="grid gap-6 p-6 lg:grid-cols-[1fr_280px]">
                  <div>
                    <p className="text-sm font-bold dark:text-white">Ship to</p>
                    <p className="mt-1 text-sm text-gray-500">{order.shippingAddress}</p>
                    <div className="mt-5 space-y-3">
                      {order.orderItems?.map((item) => (
                        <div key={item.id} className="flex items-center gap-3">
                          <img src={item.product?.imageUrl} alt="" className="h-12 w-12 rounded-lg object-cover" />
                          <div>
                            <p className="text-sm font-bold dark:text-white">{item.product?.name}</p>
                            <p className="text-xs text-gray-500">Qty {item.quantity} · ₹{item.priceAtPurchase}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="rounded-xl bg-gray-50 p-4 dark:bg-zinc-950">
                    <div className="flex items-center gap-2 font-black dark:text-white">
                      <PackageCheck className="h-5 w-5" /> Next action
                    </div>
                    {user.role === "SUPPORT" ? (
                      <p className="mt-3 text-sm text-gray-500">Support can inspect this order but cannot change fulfilment status.</p>
                    ) : targets.length ? (
                      <div className="mt-3 grid gap-2">
                        {targets.map((status) => (
                          <button
                            key={status}
                            disabled={updatingId === order.id}
                            onClick={() => changeStatus(order, status)}
                            className="rounded-xl bg-black px-3 py-2 text-sm font-bold text-white disabled:opacity-50 dark:bg-white dark:text-black"
                          >
                            Mark {status.replaceAll("_", " ")}
                          </button>
                        ))}
                      </div>
                    ) : (
                      <p className="mt-3 text-sm text-gray-500">No further transitions are available.</p>
                    )}
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}
