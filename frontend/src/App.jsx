import { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CartProvider } from "./context/CartContext";
import GlobalStyles from "./GlobalStyles";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import Home from "./pages/Home";
import Men from "./pages/men";
import Women from "./pages/women";
import Cart from "./pages/cart";
import Checkout from "./pages/checkout";
import Payment from "./pages/payment";
import { theme } from "./theme";

export default function App() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <BrowserRouter>
      <CartProvider>
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
          </Routes>
        </div>
      </CartProvider>
    </BrowserRouter>
  );
}