import { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";
import { AdminProvider } from "./context/AdminContext";
import AdminRoute from "./components/AdminRoute";
import AdminLayout from "./pages/admin/AdminLayout";
import GlobalStyles from "./GlobalStyles";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";

// Shop pages
import Home from "./pages/Home";
import Men from "./pages/men";
import Women from "./pages/women";
import Cart from "./pages/cart";
import Checkout from "./pages/checkout";
import Payment from "./pages/payment";
import Profile from "./pages/Profile";
import Login from "./pages/Login";
import Signup from "./pages/Signup";

// Admin pages
import AdminLogin from "./pages/admin/AdminLogin";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminProducts from "./pages/admin/AdminProducts";
import AdminOrders from "./pages/admin/AdminOrders";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminSettings from "./pages/admin/AdminSettings";
import AdminCategories from "./pages/admin/AdminCategories";

import { theme } from "./theme";

function AdminPage({ children }) {
  return (
    <AdminRoute>
      <AdminLayout>{children}</AdminLayout>
    </AdminRoute>
  );
}

export default function App() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <BrowserRouter>
      <AdminProvider>
        <AuthProvider>
          <CartProvider>
            <Routes>

              {/* ── Admin routes (no shop header) ── */}
              <Route path="/admin/login" element={<AdminLogin />} />
              <Route path="/admin" element={<AdminPage><AdminDashboard /></AdminPage>} />
              <Route path="/admin/products" element={<AdminPage><AdminProducts /></AdminPage>} />
              <Route path="/admin/orders" element={<AdminPage><AdminOrders /></AdminPage>} />
              <Route path="/admin/users" element={<AdminPage><AdminUsers /></AdminPage>} />
              <Route path="/admin/categories" element={<AdminPage><AdminCategories /></AdminPage>} />
              <Route path="/admin/settings" element={<AdminPage><AdminSettings /></AdminPage>} />

              {/* ── Shop routes (with header + sidebar) ── */}
              <Route path="*" element={
                <div style={{ paddingTop: theme.barH }}>
                  <GlobalStyles />
                  <Header onOpenMenu={() => setMenuOpen(true)} />
                  <Sidebar open={menuOpen} onClose={() => setMenuOpen(false)} />
                  <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/men" element={<Men />} />
                    <Route path="/women" element={<Women />} />
                    <Route path="/cart" element={<Cart />} />
                    <Route path="/checkout" element={<Checkout />} />
                    <Route path="/payment" element={<Payment />} />
                    <Route path="/profile" element={<Profile />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/signup" element={<Signup />} />
                    <Route path="/register" element={<Signup />} />
                  </Routes>
                </div>
              } />

            </Routes>
          </CartProvider>
        </AuthProvider>
      </AdminProvider>
    </BrowserRouter>
  );
}