import { useNavigate, useLocation } from "react-router-dom";
import { useAdmin } from "../../context/AdminContext";
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

  const s = {
    shell: { display: "flex", minHeight: "100vh", background: theme.surfaceLight },

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

    main: { flex: 1, overflow: "auto" },
    topBar: {
      padding: "18px 32px",
      borderBottom: `1px solid ${theme.hairlineOnLight}`,
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      background: theme.surfaceLight,
    },
    topTitle: {
      fontSize: 12,
      letterSpacing: "0.18em",
      textTransform: "uppercase",
      color: theme.textOnLightMuted,
    },
    viewSite: {
      fontSize: 12,
      color: theme.accent,
      textDecoration: "none",
      fontFamily: theme.fontBody,
    },
    content: { padding: 32 },
  };

  const currentNav = NAV.find((n) =>
    n.path === "/admin"
      ? location.pathname === "/admin"
      : location.pathname.startsWith(n.path)
  );

  return (
    <div style={s.shell}>
      {/* Sidebar */}
      <aside style={s.sidebar}>
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
              <button key={item.path} style={s.navItem(active)} onClick={() => navigate(item.path)}>
                <span style={s.navIcon}>{item.icon}</span>
                {item.label}
              </button>
            );
          })}
        </nav>

       <button style={s.logoutBtn} onClick={logout}>
          ← Sign out
        </button>
      </aside>

      {/* Main */}
      <main style={s.main}>
        <div style={s.topBar}>
          <span style={s.topTitle}>MedTrack / {currentNav?.label ?? "Admin"}</span>
          <a href="/" style={s.viewSite}>↗ View site</a>
        </div>
        <div style={s.content}>{children}</div>
      </main>
    </div>
  );
}