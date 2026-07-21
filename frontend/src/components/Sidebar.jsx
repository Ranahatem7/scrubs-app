import { useEffect } from "react";
import PulseDivider from "./PulseDivider";
import { theme, label, btnGhost, metalText } from "../theme";
import { useAuth } from "../context/AuthContext";

const LINKS = [
  { label: "Home", href: "/" },
  { label: "Men", href: "/men" },
  { label: "Women", href: "/women" },
  { label: "Contact", href: "/#contact" },
];

const s = {
  scrim: (open) => ({
    position: "fixed",
    inset: 0,
    zIndex: 70,
    background: "rgba(5, 5, 6, 0.7)",
    backdropFilter: "blur(3px)",
    opacity: open ? 1 : 0,
    pointerEvents: open ? "auto" : "none",
    transition: "opacity 0.35s ease",
  }),
  panel: (open) => ({
    position: "fixed",
    top: 0,
    bottom: 0,
    left: 0,
    zIndex: 80,
    width: "min(84vw, 340px)",
    display: "flex",
    flexDirection: "column",
    padding: "22px 0 26px",
    background: `linear-gradient(180deg, ${theme.ink2}, ${theme.ink})`,
    borderRight: `1px solid ${theme.hairline}`,
    transform: open ? "translateX(0)" : "translateX(-102%)",
    visibility: open ? "visible" : "hidden",
    transition: "transform 0.42s cubic-bezier(0.22, 1, 0.36, 1), visibility 0.42s",
  }),
  top: {
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "space-between",
    padding: `0 ${theme.pad}px 22px`,
  },
  brand: { display: "flex", flexDirection: "column", gap: 6 },
  mt: { ...metalText, fontFamily: theme.fontDisplay, fontSize: 30, fontWeight: 600, lineHeight: 1 },
  close: { width: 34, height: 34, display: "grid", placeItems: "center", color: theme.muted, cursor: "pointer" },
  closeIcon: { width: 18, height: 18 },
  list: { listStyle: "none", margin: "26px 0 0", padding: 0, flex: 1 },
  item: (open, i) => ({
    opacity: open ? 1 : 0,
    transform: open ? "translateX(0)" : "translateX(-14px)",
    transition: "opacity 0.5s ease, transform 0.5s cubic-bezier(0.22, 1, 0.36, 1)",
    transitionDelay: open ? `${120 + i * 45}ms` : "0ms",
  }),
  link: {
    display: "flex",
    alignItems: "baseline",
    gap: 14,
    padding: `13px ${theme.pad}px`,
    fontFamily: theme.fontDisplay,
    fontSize: 26,
    fontWeight: 300,
    letterSpacing: "0.02em",
  },
  index: { fontFamily: theme.fontBody, fontSize: 9, letterSpacing: "0.16em", color: theme.bronzeDeep },
  foot: { padding: `0 ${theme.pad}px`, display: "flex", flexDirection: "column", gap: 18 },
  account: { ...btnGhost, width: "100%" },
  social: {
    display: "flex",
    gap: 16,
    fontSize: 10,
    letterSpacing: "0.18em",
    textTransform: "uppercase",
    color: theme.muted,
  },
};

export default function Sidebar({ open, onClose }) {
  const { user } = useAuth();

  // Lock background scroll while the drawer is open
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  // Close on Escape
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  return (
    <>
      <div style={s.scrim(open)} onClick={onClose} aria-hidden="true" />

      <nav style={s.panel(open)} aria-label="Main menu" aria-hidden={!open}>
        <div style={s.top}>
          <div style={s.brand}>
            <span style={s.mt}>MT</span>
            <span style={label}>Built for more</span>
          </div>
          <button style={s.close} onClick={onClose} aria-label="Close menu">
            <svg style={s.closeIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>
        </div>

        <PulseDivider />

        <ul style={s.list}>
          {LINKS.map((link, i) => (
            <li key={link.label} style={s.item(open, i)}>
              <a href={link.href} onClick={onClose} style={s.link}>
                <span style={s.index}>{String(i + 1).padStart(2, "0")}</span>
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        <div style={s.foot}>
          <a href={user ? "/profile" : "/login"} style={s.account} onClick={onClose}>
            {user ? "My account" : "Log in"}
          </a>
          <div style={s.social}>
            <a href="#instagram">Instagram</a>
            <a href="#tiktok">TikTok</a>
            <a href="#facebook">Facebook</a>
          </div>
        </div>
      </nav>
    </>
  );
}