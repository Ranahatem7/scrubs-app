import { theme, metalText } from "../theme";

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
    background: "rgba(11, 11, 12, 0.72)",
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
  },
  burger: { display: "block", width: 20 },
  bar: { display: "block", height: 1, background: theme.bone, margin: "5px 0" },
  barShort: { display: "block", height: 1, width: 13, background: theme.bronze, margin: "5px 0" },
  icon: { width: 21, height: 21 },
  wordmark: { display: "flex", flexDirection: "column", alignItems: "center", gap: 1, lineHeight: 1 },
  mt: { ...metalText, fontFamily: theme.fontDisplay, fontSize: 17, fontWeight: 600, letterSpacing: "0.04em" },
  name: { fontSize: 8, letterSpacing: "0.42em", textIndent: "0.42em", color: theme.muted },
  count: {
    position: "absolute",
    top: 6,
    right: 5,
    minWidth: 15,
    height: 15,
    padding: "0 4px",
    borderRadius: 8,
    background: theme.bronze,
    color: theme.ink,
    fontSize: 9,
    fontWeight: 600,
    display: "grid",
    placeItems: "center",
  },
};

export default function Header({ onOpenMenu, cartCount = 0 }) {
  return (
    <header style={s.header}>
      <button style={s.btn} onClick={onOpenMenu} aria-label="Open menu">
        <span style={s.burger}>
          <i style={s.bar} />
          <i style={s.barShort} />
          <i style={s.bar} />
        </span>
      </button>

      <a href="#top" style={s.wordmark}>
        <span style={s.mt}>MT</span>
        <span style={s.name}>MEDTRACK</span>
      </a>

      <button style={s.btn} aria-label="Open cart">
        <svg style={s.icon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3">
          <path d="M6 8h12l-1 12H7L6 8Z" />
          <path d="M9.5 8V6.5a2.5 2.5 0 0 1 5 0V8" />
        </svg>
        {cartCount > 0 && <span style={s.count}>{cartCount}</span>}
      </button>
    </header>
  );
}