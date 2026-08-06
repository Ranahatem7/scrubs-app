import { useNavigate } from "react-router-dom";
import { useRef, useState } from "react";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { theme, strongText } from "../theme";

const s = {
  header: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    height: theme.barH,
    zIndex: 70,
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "0 12px",
    background: "#092a1f",
    color: theme.textOnDark,
    borderBottom: `1px solid ${theme.hairlineOnDark}`,
    overflow: "hidden",
  },
  btn: {
    width: 42,
    height: 42,
    display: "grid",
    placeItems: "center",
    position: "relative",
    cursor: "pointer",
    background: "none",
    border: "none",
    color: "inherit",
    padding: 0,
  },
  burger: { display: "block", width: 20 },
  bar: { display: "block", height: 1, background: theme.textOnDark, margin: "5px 0" },
  barShort: { display: "block", height: 1, width: 13, background: theme.accent, margin: "5px 0" },
  icon: { width: 21, height: 21 },
  navRight: { display: "flex", alignItems: "center" },
  wordmark: { display: "flex", flexDirection: "column", alignItems: "center", gap: 1, lineHeight: 1, textDecoration: "none" },
  mt: { ...strongText("dark"), fontFamily: theme.fontDisplay, fontSize: 17, fontWeight: 700, letterSpacing: "0.04em" },
  name: { fontSize: 8, letterSpacing: "0.42em", textIndent: "0.42em", color: theme.textOnDarkMuted },
  count: {
    position: "absolute",
    top: 6,
    right: 5,
    minWidth: 15,
    height: 15,
    padding: "0 4px",
    borderRadius: 8,
    background: theme.accent,
    color: theme.textOnDark,
    fontSize: 9,
    fontWeight: 600,
    display: "grid",
    placeItems: "center",
  },
  searchOverlay: {
    position: "absolute",
    inset: 0,
    background: "#092a1f",
    display: "flex",
    alignItems: "center",
    padding: "0 12px",
    gap: 8,
    zIndex: 10,
  },
  searchInput: {
    flex: 1,
    background: "none",
    border: "none",
    borderBottom: `1px solid ${theme.textOnDarkMuted}`,
    color: theme.textOnDark,
    fontSize: 15,
    padding: "6px 4px",
    fontFamily: theme.fontBody,
    outline: "none",
    letterSpacing: "0.04em",
  },
  closeBtn: {
    background: "none",
    border: "none",
    color: theme.textOnDarkMuted,
    cursor: "pointer",
    fontSize: 20,
    lineHeight: 1,
    padding: "0 4px",
  },
};

export default function Header({ onOpenMenu }) {
  const { totalItems } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [showSearch, setShowSearch] = useState(false);
  const [query, setQuery] = useState("");
  const inputRef = useRef();

  const openSearch = () => {
    setShowSearch(true);
    setQuery("");
    setTimeout(() => inputRef.current?.focus(), 50);
  };

  const closeSearch = () => {
    setShowSearch(false);
    setQuery("");
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    closeSearch();
    navigate(`/products?q=${encodeURIComponent(query.trim())}`);
  };

  return (
    <header style={s.header}>
      {/* Search overlay */}
      {showSearch && (
        <div style={s.searchOverlay}>
          <form onSubmit={handleSearch} style={{ flex: 1, display: "flex", alignItems: "center", gap: 8 }}>
            <svg style={{ ...s.icon, color: theme.textOnDarkMuted, flexShrink: 0 }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3">
              <circle cx="11" cy="11" r="7" />
              <path d="M16.5 16.5 21 21" />
            </svg>
            <input
              ref={inputRef}
              style={s.searchInput}
              placeholder="Search products…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </form>
          <button style={s.closeBtn} onClick={closeSearch} aria-label="Close search">✕</button>
        </div>
      )}

      {/* Left — burger */}
      <button style={s.btn} onClick={onOpenMenu} aria-label="Open menu">
        <span style={s.burger}>
          <i style={s.bar} />
          <i style={s.barShort} />
          <i style={s.bar} />
        </span>
      </button>

      {/* Centre — logo */}
      <a href="/" style={s.wordmark}>
        <img src="/logo.png" alt="MedTrack" style={{ height: 80, width: "auto", display: "block" }} />
      </a>

      {/* Right — search, profile, cart */}
      <div style={s.navRight}>
        <button style={s.btn} onClick={openSearch} aria-label="Search">
          <svg style={s.icon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3">
            <circle cx="11" cy="11" r="7" />
            <path d="M16.5 16.5 21 21" />
          </svg>
        </button>

        <button
          style={s.btn}
          onClick={() => navigate(user ? "/profile" : "/login")}
          aria-label="Account"
        >
          <svg style={s.icon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3">
            <circle cx="12" cy="8.2" r="3.2" />
            <path d="M5 20c0-3.6 3.1-6.2 7-6.2s7 2.6 7 6.2" />
          </svg>
        </button>

        <button style={s.btn} onClick={() => navigate("/cart")} aria-label="Open cart">
          <svg style={s.icon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3">
            <path d="M6 8h12l-1 12H7L6 8Z" />
            <path d="M9.5 8V6.5a2.5 2.5 0 0 1 5 0V8" />
          </svg>
          {totalItems > 0 && <span style={s.count}>{totalItems}</span>}
        </button>
      </div>
    </header>
  );
}