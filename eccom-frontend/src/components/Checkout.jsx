import { useState } from "react";
import { useStore } from "../context/StoreProvider";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { loadRazorpayScript } from "../utils/razorpay";
import { createRazorpayOrderApi, verifyOrderApi } from "../http";

export default function Checkout() {
  const { cart, cartTotal, setCart } = useStore();
  const navigate = useNavigate();

  const [shippingAddress, setShippingAddress] = useState({
    fullName: "",
    street: "",
    city: "",
    state: "",
    zipCode: "",
    contact: ""
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setShippingAddress((prev) => ({ ...prev, [name]: value }));
  };

  const handleProceedToPay = async (e) => {
    e.preventDefault();
    
    const isScriptLoaded = await loadRazorpayScript();
    
    if(!isScriptLoaded){
      toast.error("Razorpay SDK failed to load. Please check your internet connection");
      return;
    }

    try {
      const orderData = await createRazorpayOrderApi(cartTotal);

      const options = {
        key: "rzp_test_THQ4jX7qDUBHtf",
        amount: orderData.amount,
        currency: orderData.currency,
        name: "DJcorner",
        description: "Order Payment",
        order_id: orderData.id,
        handler: async function (response) {
          console.log("Payment success Response ", response);

          const orderItems = cart.map((item) => ({
            productId: item.product.id,
            quantity: item.quantity,
          }));


          const verificationPayload = {
            razorpayPaymentId: response.razorpay_payment_id,
            razorpayOrderId: response.razorpay_order_id,
            razorpaySignature: response.razorpay_signature,
            orderRequest: {
              email: JSON.parse(localStorage.getItem("user"))?.email,
              shippingAddress: `${shippingAddress.street}, ${shippingAddress.city}, ${shippingAddress.state}, ${shippingAddress.zipCode}`,
              items: orderItems,
            },
          };

          try {
            const verifyResponse = await verifyOrderApi(verificationPayload);
            
            if (verifyResponse.status === 200) {
              toast.success("Order placed successfully!");
              setCart([]); 
              navigate("/order-success"); 
            }
          } catch (err) {
            console.error("Verification failed:", err);
            toast.error(err.message || "Payment verified, but order creation failed.");
          }
        },
        prefill: {
          name: shippingAddress.fullName,
          email: JSON.parse(localStorage.getItem("user"))?.email || "", 
          contact: shippingAddress.contact
        },
        theme: {
          color: "#000000",
        },
      };

      const paymentObject = new window.Razorpay(options);
      paymentObject.open();
    } catch (error) {
      console.error("Checkout Error :", error);
      toast.error(error.message || "Something went wrong during checkout");
    }
  };


  if (cart.length === 0) {
    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center text-center">
        <h2 className="mb-4 text-2xl font-black text-black dark:text-white">Your cart is empty</h2>
        <button 
          onClick={() => navigate("/")}
          className="rounded-2xl bg-black px-6 py-3 text-sm font-bold text-white transition hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-gray-100"
        >
          Continue Shopping
        </button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl">
      <h1 className="mb-8 text-3xl font-black text-black dark:text-white">Checkout</h1>
      
      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
            <h2 className="mb-6 text-xl font-bold text-black dark:text-white">Shipping Address</h2>
            
            <form onSubmit={handleProceedToPay} className="space-y-4">
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Full Name</label>
                <input 
                  type="text" 
                  name="fullName" 
                  required
                  value={shippingAddress.fullName}
                  onChange={handleInputChange}
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none transition focus:border-black dark:border-zinc-700 dark:bg-zinc-800 dark:text-white dark:focus:border-white"
                />
              </div>
              
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Street Address</label>
                <input 
                  type="text" 
                  name="street" 
                  required
                  value={shippingAddress.street}
                  onChange={handleInputChange}
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none transition focus:border-black dark:border-zinc-700 dark:bg-zinc-800 dark:text-white dark:focus:border-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">City</label>
                  <input 
                    type="text" 
                    name="city" 
                    required
                    value={shippingAddress.city}
                    onChange={handleInputChange}
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none transition focus:border-black dark:border-zinc-700 dark:bg-zinc-800 dark:text-white dark:focus:border-white"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">State</label>
                  <input 
                    type="text" 
                    name="state" 
                    required
                    value={shippingAddress.state}
                    onChange={handleInputChange}
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none transition focus:border-black dark:border-zinc-700 dark:bg-zinc-800 dark:text-white dark:focus:border-white"
                  />
                </div>
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Zip Code</label>
                <input 
                  type="text" 
                  name="zipCode" 
                  required
                  value={shippingAddress.zipCode}
                  onChange={handleInputChange}
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none transition focus:border-black dark:border-zinc-700 dark:bg-zinc-800 dark:text-white dark:focus:border-white"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Phone Number</label>
                <input 
                  type="text" 
                  name="contact" 
                  required
                  value={shippingAddress.contact}
                  onChange={handleInputChange}
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none transition focus:border-black dark:border-zinc-700 dark:bg-zinc-800 dark:text-white dark:focus:border-white"
                />
              </div>

              <button 
                type="submit"
                className="mt-6 w-full rounded-2xl bg-black py-4 text-sm font-bold text-white transition active:scale-95 hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-gray-100"
              >
                Proceed to Pay
              </button>
            </form>
          </div>
        </div>

        <div>
          <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
            <h2 className="mb-6 text-xl font-bold text-black dark:text-white">Order Summary</h2>
            
            <div className="space-y-4">
              {cart.map((item, index) => (
                <div key={index} className="flex gap-4">
                  <img
                    src={item.product.imageUrl}
                    alt={item.product.name}
                    className="h-16 w-16 rounded-xl bg-gray-100 object-cover dark:bg-zinc-800"
                  />
                  <div className="flex flex-1 flex-col justify-center">
                    <h4 className="line-clamp-1 text-sm font-bold text-gray-900 dark:text-white">
                      {item.product.name}
                    </h4>
                    <p className="mt-1 text-sm font-medium text-gray-500">
                      Qty: {item.quantity} × ${item.product.price}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 border-t border-gray-100 pt-4 dark:border-zinc-800">
              <div className="flex items-center justify-between text-lg font-black text-black dark:text-white">
                <span>Total</span>
                <span>${cartTotal.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}