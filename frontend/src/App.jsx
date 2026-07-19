import { useState } from "react";
import GlobalStyles from "./GlobalStyles";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import Home from "./pages/Home";
import { theme } from "./theme";

export default function App() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div style={{ paddingTop: theme.barH }}>
      <GlobalStyles />
      <Header onOpenMenu={() => setMenuOpen(true)} cartCount={0} />
      <Sidebar open={menuOpen} onClose={() => setMenuOpen(false)} />
      <Home />
    </div>
  );
}