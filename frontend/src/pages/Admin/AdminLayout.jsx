import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAdmin } from "../../context/AdminContext";
import useIsDesktop from "../../hooks/useIsDesktop";
import { theme } from "../../theme";

const NAV = [
  { path: "/admin", label: "Dashboard", icon: "▦" },
  { path: "/admin/products", label: "Products", icon: "◈" },
  { path: "/admin/orders", label: "Orders", icon: "◎" },
  { path: "/admin/users", label: "Users", icon: "◯" },
  { path: "/admin/categories", label: "Categories", icon: "◧" },
  { path: "/admin/settings", label: "Settings", icon: "⚙" },
];

export default function AdminLayout({ children }) {
  const { logout } = useAdmin();
  const navigate = useNavigate();
  const location = useLocation();
  const isDesktop = useIsDesktop(768);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const currentNav = NAV.find((n) =>
    n.path === "/admin"
      ? location.pathname === "/admin"
      : location.pathname.startsWith(n.path)
  );

  const handleNav = (path) => {
    navigate(path);
    setDrawerOpen(false);
  };

  const s = {
    shell: { display: "flex", minHeight: "100vh", background: theme.surfaceLight },

    // Desktop sidebar
    sidebar: {
      width: 220,
      flexShrink: 0,
      background: theme.surfaceDark,
      display: "flex",
      flexDirection: "column",
      padding: "28px 0",
      position: "sticky",
      top: 0,
      height: "100vh",
    },

    // Mobile overlay behind drawer
    overlay: {
      position: "fixed",
      inset: 0,
      background: "rgba(0,0,0,0.5)",
      zIndex: 200,
    },

    // Mobile slide-in drawer
    drawer: {
      position: "fixed",
      top: 0,
      left: 0,
      width: 220,
      height: "100vh",
      background: theme.surfaceDark,
      display: "flex",
      flexDirection: "column",
      padding: "28px 0",
      zIndex: 201,
      transition: "transform 0.25s ease",
      transform: drawerOpen ? "translateX(0)" : "translateX(-100%)",
    },

    brand: {
      padding: "0 24px 28px",
      borderBottom: `1px solid ${theme.hairlineOnDark}`,
      marginBottom: 16,
    },
    brandMt: {
      fontFamily: theme.fontDisplay,
      fontSize: 22,
      fontWeight: 700,
      color: theme.textOnDark,
    },
    brandSub: {
      display: "block",
      fontSize: 9,
      letterSpacing: "0.28em",
      textTransform: "uppercase",
      color: theme.textOnDarkMuted,
      marginTop: 4,
    },

    nav: { flex: 1, display: "flex", flexDirection: "column", gap: 2, padding: "0 12px" },
    navItem: (active) => ({
      display: "flex",
      alignItems: "center",
      gap: 10,
      padding: "10px 12px",
      borderRadius: theme.radius,
      background: active ? theme.accent : "transparent",
      color: active ? theme.textOnDark : theme.textOnDarkMuted,
      border: "none",
      fontSize: 13,
      cursor: "pointer",
      fontFamily: theme.fontBody,
      transition: "background 0.15s, color 0.15s",
      textAlign: "left",
    }),
    navIcon: { fontSize: 14, width: 18, textAlign: "center" },

    logoutBtn: {
      margin: "16px 12px 0",
      padding: "10px 12px",
      borderRadius: theme.radius,
      border: `1px solid ${theme.hairlineOnDark}`,
      background: "transparent",
      color: theme.textOnDarkMuted,
      fontSize: 12,
      cursor: "pointer",
      fontFamily: theme.fontBody,
      textAlign: "left",
    },

    main: { flex: 1, overflow: "auto", minWidth: 0 },
    topBar: {
      padding: isDesktop ? "18px 32px" : "14px 16px",
      borderBottom: `1px solid ${theme.hairlineOnLight}`,
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      background: theme.surfaceLight,
      gap: 12,
    },
    topLeft: { display: "flex", alignItems: "center", gap: 10 },
    hamburger: {
      background: "none",
      border: "none",
      cursor: "pointer",
      fontSize: 20,
      color: theme.textOnLight,
      padding: 0,
      lineHeight: 1,
      fontFamily: theme.fontBody,
    },
    topTitle: {
      fontSize: 11,
      letterSpacing: "0.18em",
      textTransform: "uppercase",
      color: theme.textOnLightMuted,
    },
    viewSite: {
      fontSize: 12,
      color: theme.accent,
      textDecoration: "none",
      fontFamily: theme.fontBody,
      whiteSpace: "nowrap",
    },
    content: { padding: isDesktop ? 32 : 16 },
  };

  const SidebarContent = () => (
    <>
      <div style={s.brand}>
        <span style={s.brandMt}>MT</span>
        <span style={s.brandSub}>Admin panel</span>
      </div>
      <nav style={s.nav}>
        {NAV.map((item) => {
          const active = item.path === "/admin"
            ? location.pathname === "/admin"
            : location.pathname.startsWith(item.path);
          return (
            <button key={item.path} style={s.navItem(active)} onClick={() => handleNav(item.path)}>
              <span style={s.navIcon}>{item.icon}</span>
              {item.label}
            </button>
          );
        })}
      </nav>
      <button style={s.logoutBtn} onClick={logout}>← Sign out</button>
    </>
  );

  return (
    <div style={s.shell}>
      {/* Desktop: inline sidebar */}
      {isDesktop && (
        <aside style={s.sidebar}>
          <SidebarContent />
        </aside>
      )}

      {/* Mobile: slide-in drawer */}
      {!isDesktop && (
        <>
          {drawerOpen && (
            <div style={s.overlay} onClick={() => setDrawerOpen(false)} />
          )}
          <div style={s.drawer}>
            <SidebarContent />
          </div>
        </>
      )}

      {/* Main content */}
      <main style={s.main}>
        <div style={s.topBar}>
          <div style={s.topLeft}>
            {!isDesktop && (
              <button style={s.hamburger} onClick={() => setDrawerOpen(!drawerOpen)}>☰</button>
            )}
            <span style={s.topTitle}>MedTrack / {currentNav?.label ?? "Admin"}</span>
          </div>
          <a href="/" style={s.viewSite}>↗ View site</a>
        </div>
        <div style={s.content}>{children}</div>
      </main>
    </div>
  );
}