import { BrowserRouter, Route, Routes } from "react-router-dom"
import Layout from "./components/Layout"
import HomePage from "./pages/HomePage"
import LoginPage from "./pages/LoginPage"
import SignupPage from "./pages/SignupPage"
import ProductPage from "./pages/ProductPage"
import Checkout from "./components/Checkout"
import OrderSuccess from "./pages/OrderSucess"
import OrderHistory from "./pages/OrderHistory"
import AdminConsole from "./pages/AdminConsole"
import StaffOrders from "./pages/StaffOrders"
import RequireRole from "./components/RequireRole"

function App() {
  return (
    <BrowserRouter>
    <Routes>
      <Route path="/" element={<Layout/>}> 
      <Route index element={<HomePage />}/>
      <Route path="login" element={<LoginPage />}/>
      <Route path="signup" element={<SignupPage />} />
      <Route path="/product/:id" element={<ProductPage />} />
      <Route path="checkout" element={<Checkout />} />
      <Route path="/order-success" element={<OrderSuccess />} />
      <Route path="/orders" element={<OrderHistory />} />
      <Route
        path="/admin"
        element={
          <RequireRole roles={["ADMIN"]}>
            <AdminConsole />
          </RequireRole>
        }
      />
      <Route
        path="/staff/orders"
        element={
          <RequireRole roles={["ADMIN", "SUPPORT", "FULFILLMENT"]}>
            <StaffOrders />
          </RequireRole>
        }
      />
      </Route>
    </Routes>
    </BrowserRouter>
  )
}

export default App
