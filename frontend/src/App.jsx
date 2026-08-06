//import { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";
import { AdminProvider } from "./context/AdminContext";
import AdminRoute from "./components/AdminRoute";
import AdminLayout from "./pages/Admin/AdminLayout";
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
import ProductPage from "./pages/ProductPage";
import CategoryPage from "./pages/CategoryPage";
import Contact from "./pages/Contact";
import AllProducts from "./pages/AllProducts";

// Admin pages
import AdminLogin from "./pages/Admin/AdminLogin";
import AdminDashboard from "./pages/Admin/AdminDashboard";
import AdminProducts from "./pages/Admin/AdminProducts";
import AdminOrders from "./pages/Admin/AdminOrders";
import AdminUsers from "./pages/Admin/AdminUsers";
import AdminSettings from "./pages/Admin/AdminSettings";
import AdminCategories from "./pages/Admin/AdminCategories";

import { theme } from "./theme";

function AdminPage({ children }) {
  return (
    <AdminRoute redirectTo="/">
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
              <Route path="/Admin/login" element={<AdminLogin />} />
              <Route path="/Admin" element={<AdminPage><AdminDashboard /></AdminPage>} />
              <Route path="/Admin/products" element={<AdminPage><AdminProducts /></AdminPage>} />
              <Route path="/Admin/orders" element={<AdminPage><AdminOrders /></AdminPage>} />
              <Route path="/Admin/users" element={<AdminPage><AdminUsers /></AdminPage>} />
              <Route path="/Admin/categories" element={<AdminPage><AdminCategories /></AdminPage>} />
              <Route path="/Admin/settings" element={<AdminPage><AdminSettings /></AdminPage>} />

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
                    <Route path="/product/:slug" element={<ProductPage />} />
                    <Route path="/category/:slug" element={<CategoryPage />} />
                    <Route path="/contact" element={<Contact />} />
                    <Route path="/products" element={<AllProducts />} />
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