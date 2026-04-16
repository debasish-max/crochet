import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Cart from "./pages/Cart";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Orders from "./pages/Orders";
import AdminDashboard from "./pages/Admin/Dashboard";
import AdminOrders from "./pages/Admin/Orders";
import ProtectedRoute from "./components/ProtectedRoute";
import { CartProvider } from "./context/CartContext";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Toast from "./components/Toast";
import OrderSuccessPage from "./pages/OrderSuccessPage";
import AdminProducts from "./pages/Admin/Products";
import { useState } from "react";

function AppContent() {
  const [toast, setToast] = useState("");
  const { user, role, loading } = useAuth();

  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        {/* Dynamic Home Route */}
        <Route 
          path="/" 
          element={
            loading || (user && role === null) ? null :
            role === 'admin' ? 
            <Navigate to="/admin" replace /> : 
            <Home setToast={setToast} />
          } 
        />
        
        <Route path="/cart" element={<Cart setToast={setToast} />} />
        <Route path="/login" element={<Login setToast={setToast} />} />
        <Route path="/signup" element={<Signup setToast={setToast} />} />
        <Route path="/orders" element={<Orders setToast={setToast} />} />
        <Route path="/order-success" element={<OrderSuccessPage />} />
        
        {/* Admin Routes */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminDashboard setToast={setToast} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/orders"
          element={
            <ProtectedRoute>
              <AdminOrders setToast={setToast} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/products"
          element={
            <ProtectedRoute>
              <AdminProducts setToast={setToast} />
            </ProtectedRoute>
          }
        />
      </Routes>
      <Toast message={toast} />
    </BrowserRouter>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <AppContent />
      </CartProvider>
    </AuthProvider>
  );
}
