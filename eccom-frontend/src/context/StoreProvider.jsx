import { useState, useEffect } from "react";
import { getAllProductsApi } from "../http";
import toast from "react-hot-toast";
import { StoreContext } from "./StoreContext";

export function StoreProvider({ children }) {
  const [products, setProducts] = useState(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem("cart");
    return savedCart ? JSON.parse(savedCart) : [];
  });

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const data = await getAllProductsApi();
        setProducts(data);
      } catch (err) {
        toast.error(err.message || "Unable to fetch products");
      }
    };
    loadProducts();
  }, []);

  const addToCart = (product) => {
    setCart((prevCart) => {

      const existingItem = prevCart.find((item) => item.product.id === product.id);

      if (existingItem) {
        if (existingItem.quantity >= product.stockQuantity) {
          toast.error("Maximum available stock reached!");
          return prevCart; 
        }
        
       
        toast.success("Increased quantity in cart");
        return prevCart.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      toast.success("Added to cart!");
      return [...prevCart, { product: product, quantity: 1 }];
    });
  };

  const removeFromCart = (productId) => {
    setCart((prevCart) => prevCart.filter((item) => item.product.id !== productId));
    toast.success("Item removed");
  };

  const updateQuantity = (productId, newQuantity) => {
    setCart((prevCart) =>
      prevCart.map((item) => {
        if (item.product.id === productId) {
         
          if (newQuantity < 1) return item;
          
          if (newQuantity > item.product.stockQuantity) {
            toast.error("Maximum available stock reached!");
            return item;
          }

          return { ...item, quantity: newQuantity };
        }
        return item;
      })
    );
  };

  const cartTotal = cart.reduce((total, item) => total + (item.product.price * item.quantity), 0);

  const totalCartItems = cart.reduce((total, item) => total + item.quantity, 0);

  const value = {
    products,
    cart,
    setCart,
    addToCart,
    totalCartItems,
    isCartOpen,
    setIsCartOpen,
    removeFromCart,
    updateQuantity,
    cartTotal
  };

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}
