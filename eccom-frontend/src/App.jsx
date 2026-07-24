import { BrowserRouter, Route, Routes } from "react-router-dom"
import Layout from "./components/Layout"
import HomePage from "./pages/HomePage"
import LoginPage from "./pages/LoginPage"
import SignupPage from "./pages/SignupPage"
import ProductPage from "./pages/ProductPage"
import Checkout from "./components/Checkout"

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
      </Route>
    </Routes>
    </BrowserRouter>
  )
}

export default App
