import { useNavigate } from "react-router-dom";
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
    zIndex: 60,
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "0 12px",
    background: "rgba(11, 31, 24, 0.72)",
    backdropFilter: "blur(14px)",
    WebkitBackdropFilter: "blur(14px)",
    borderBottom: `1px solid ${theme.hairline}`,
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
  bar: { display: "block", height: 1, background: theme.white, margin: "5px 0" },
  barShort: { display: "block", height: 1, width: 13, background: theme.forest, margin: "5px 0" },
  icon: { width: 21, height: 21 },
  navRight: { display: "flex", alignItems: "center" },
  wordmark: { display: "flex", flexDirection: "column", alignItems: "center", gap: 1, lineHeight: 1, textDecoration: "none" },
  // TODO: swap for the real MT/ECG logo asset once provided — text treatment is a placeholder
  mt: { ...strongText, fontFamily: theme.fontDisplay, fontSize: 17, fontWeight: 700, letterSpacing: "0.04em" },
  name: { fontSize: 8, letterSpacing: "0.42em", textIndent: "0.42em", color: theme.muted },
  count: {
    position: "absolute",
    top: 6,
    right: 5,
    minWidth: 15,
    height: 15,
    padding: "0 4px",
    borderRadius: 8,
    background: theme.forest,
    color: theme.white,
    fontSize: 9,
    fontWeight: 600,
    display: "grid",
    placeItems: "center",
  },
};

export default function Header({ onOpenMenu }) {
  const { totalItems } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <header style={s.header}>
      <button style={s.btn} onClick={onOpenMenu} aria-label="Open menu">
        <span style={s.burger}>
          <i style={s.bar} />
          <i style={s.barShort} />
          <i style={s.bar} />
        </span>
      </button>

      <a href="/" style={s.wordmark}>
        <span style={s.mt}>MT</span>
        <span style={s.name}>MEDTRACK</span>
      </a>

      <div style={s.navRight}>
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