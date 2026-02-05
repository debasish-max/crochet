import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Cart from "./pages/Cart";
import { CartProvider } from "./context/CartContext";
import Toast from "./components/Toast";
import { useState } from "react";

export default function App() {
  const [toast, setToast] = useState("");

  return (
    <CartProvider>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home setToast={setToast} />} />
          <Route path="/cart" element={<Cart setToast={setToast} />} />
        </Routes>
        <Toast message={toast} />
      </BrowserRouter>
    </CartProvider>
  );
}
