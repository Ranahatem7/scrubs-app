import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import PulseDivider from "../components/PulseDivider";
import useIsDesktop from "../hooks/useIsDesktop";
import { theme, label, display, btnGhost, btnSolid, strongText } from "../theme";
import { useAuth } from "../context/AuthContext";
import { getMyOrders } from "../services/orders";
import LoadingPage from "../components/LoadingPage";

// Text/border/bg tuned for legibility on the white order cards
const STATUS_STYLES = {
  pending: { color: theme.accent, border: "rgba(15,91,70,0.4)", bg: "rgba(15,91,70,0.12)" },
  confirmed: { color: "#2f6b5c", border: "rgba(47,107,92,0.35)", bg: "rgba(47,107,92,0.1)" },
  shipped: { color: "#2f5f7a", border: "rgba(47,95,122,0.35)", bg: "rgba(47,95,122,0.1)" },
  delivered: { color: "#3d7a3f", border: "rgba(61,122,63,0.35)", bg: "rgba(61,122,63,0.1)" },
  cancelled: { color: "#a23b34", border: "rgba(162,59,52,0.35)", bg: "rgba(162,59,52,0.1)" },
};

export default function Profile() {
  const isDesktop = useIsDesktop(700);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [ordersError, setOrdersError] = useState(null);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let cancelled = false;
    setOrdersLoading(true);
    setOrdersError(null);

    getMyOrders()
      .then((data) => {
        if (!cancelled) setOrders(data);
      })
      .catch((err) => {
        if (!cancelled) setOrdersError(err.message);
      })
      .finally(() => {
        if (!cancelled) setOrdersLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [reloadKey]);

  if (ordersLoading) return <LoadingPage />;

  const handleSignOut = () => {
    logout();
    navigate("/");
  };

  const initial = user?.name?.trim()?.[0]?.toUpperCase() ?? "?";
  const memberSince = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString(undefined, { month: "long", year: "numeric" })
    : null;

  const s = {
    page: { minHeight: "100vh", background: theme.surfaceLight, paddingBottom: 80 },
    pageHead: {
      padding: `48px ${theme.pad}px 32px`,
      borderBottom: `1px solid ${theme.hairlineOnLight}`,
    },
    pageTitle: { ...display, margin: "8px 0 0", fontSize: isDesktop ? 40 : 32, color: theme.textOnLight },

    layout: {
      display: "grid",
      gridTemplateColumns: isDesktop ? "1fr 320px" : "1fr",
      gap: 24,
      maxWidth: 1080,
      margin: "0 auto",
      padding: `40px ${theme.pad}px 0`,
      alignItems: "start",
    },

    // ── Account sidebar ─────────────────────────────────────────────────────
    account: {
      background: theme.surfaceLight,
      border: `1px solid ${theme.hairlineOnLight}`,
      borderRadius: theme.radius,
      boxShadow: "0 1px 3px rgba(34, 37, 42, 0.06)",
      padding: 24,
      position: isDesktop ? "sticky" : "static",
      top: theme.barH + 20,
      order: isDesktop ? 2 : -1,
    },
    avatarRow: { display: "flex", alignItems: "center", gap: 14 },
    avatar: {
      width: 52,
      height: 52,
      borderRadius: "50%",
      background: theme.accent,
      display: "grid",
      placeItems: "center",
      fontFamily: theme.fontDisplay,
      fontSize: 22,
      fontWeight: 700,
      color: theme.textOnDark,
      flexShrink: 0,
    },
    accountName: { ...strongText("light"), fontFamily: theme.fontDisplay, fontSize: 19, margin: 0, lineHeight: 1.25 },
    accountEmail: {
      fontSize: 12,
      color: theme.textOnLightMuted,
      margin: "3px 0 0",
      wordBreak: "break-word",
    },
    memberSince: {
      fontSize: 11,
      color: theme.textOnLightMuted,
      letterSpacing: "0.06em",
      paddingTop: 16,
      marginTop: 16,
      borderTop: `1px solid ${theme.hairlineOnLight}`,
    },
    signOutBtn: { ...btnGhost("light"), width: "100%", justifyContent: "center", marginTop: 18 },

    // ── Orders (main column) ─────────────────────────────────────────────────
    ordersCol: { order: isDesktop ? 1 : 0 },
    sectionHead: {
      display: "flex",
      alignItems: "baseline",
      justifyContent: "space-between",
      marginBottom: 16,
    },
    sectionTitle: {
      fontSize: 11,
      fontWeight: 500,
      letterSpacing: "0.26em",
      textTransform: "uppercase",
      color: theme.accent,
      margin: 0,
    },
    orderCountNote: { fontSize: 12, color: theme.textOnLightMuted },

    stateBlock: {
      padding: "48px 24px",
      textAlign: "center",
      background: theme.surfaceLight,
      border: `1px solid ${theme.hairlineOnLight}`,
      borderRadius: theme.radius,
      boxShadow: "0 1px 3px rgba(34, 37, 42, 0.06)",
    },
    stateText: { fontSize: 13, color: theme.textOnLightMuted, margin: "0 0 16px" },
    errorText: { fontSize: 13, color: "#a23b34", margin: "0 0 16px" },
    retryBtn: { ...btnGhost("light"), display: "inline-flex" },
    emptyCta: { ...btnSolid, display: "inline-flex", paddingInline: 28, marginTop: 4 },

    orderList: { display: "flex", flexDirection: "column", gap: 12 },
    orderCard: {
      display: "flex",
      gap: 14,
      padding: 16,
      background: theme.surfaceLight,
      border: `1px solid ${theme.hairlineOnLight}`,
      borderRadius: theme.radius,
      boxShadow: "0 1px 3px rgba(34, 37, 42, 0.06)",
    },
    orderThumb: {
      width: 56,
      height: 68,
      objectFit: "cover",
      borderRadius: 6,
      flexShrink: 0,
      background: theme.surfaceMuted,
    },
    orderBody: { flex: 1, minWidth: 0 },
    orderHead: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 10 },
    orderRefDate: { minWidth: 0 },
    orderRef: { fontSize: 11, color: theme.textOnLight, letterSpacing: "0.04em", fontFamily: theme.fontBody },
    orderDate: { fontSize: 11, color: theme.textOnLightMuted, marginTop: 2 },
    statusPill: (status) => ({
      flexShrink: 0,
      fontSize: 9,
      fontWeight: 500,
      letterSpacing: "0.12em",
      textTransform: "uppercase",
      padding: "4px 10px",
      borderRadius: 999,
      whiteSpace: "nowrap",
      border: `1px solid ${STATUS_STYLES[status]?.border ?? theme.hairlineOnLight}`,
      color: STATUS_STYLES[status]?.color ?? theme.textOnLightMuted,
      background: STATUS_STYLES[status]?.bg ?? "transparent",
    }),
    orderItemsText: {
      fontSize: 13,
      color: theme.textOnLightMuted,
      margin: "8px 0 0",
      overflow: "hidden",
      textOverflow: "ellipsis",
      whiteSpace: "nowrap",
    },
    orderFoot: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginTop: 10,
      paddingTop: 10,
      borderTop: `1px solid ${theme.hairlineOnLight}`,
    },
    orderCount: { fontSize: 11, color: theme.textOnLightMuted },
    orderTotal: { color: theme.accent, fontWeight: 700, fontSize: 16, fontFamily: theme.fontDisplay },
  };

  return (
    <main style={s.page}>
      <div style={s.pageHead}>
        <span style={label("light")}>Account</span>
        <h1 style={s.pageTitle}>My profile</h1>
      </div>

      <PulseDivider />

      <div style={s.layout}>
        {/* ── Account sidebar ── */}
        <div style={s.account}>
          <div style={s.avatarRow}>
            <span style={s.avatar}>{initial}</span>
            <div>
              <p style={s.accountName}>{user?.name}</p>
              <p style={s.accountEmail}>{user?.email}</p>
            </div>
          </div>

          {memberSince && <p style={s.memberSince}>Member since {memberSince}</p>}

          <button style={s.signOutBtn} onClick={handleSignOut}>Sign out</button>
        </div>

        {/* ── Orders ── */}
        <div style={s.ordersCol}>
          <div style={s.sectionHead}>
            <p style={s.sectionTitle}>Orders</p>
            {!ordersError && orders.length > 0 && (
              <span style={s.orderCountNote}>
                {orders.length} {orders.length === 1 ? "order" : "orders"}
              </span>
            )}
          </div>

          {ordersError && (
            <div style={s.stateBlock}>
              <p style={s.errorText}>{ordersError}</p>
              <button style={s.retryBtn} onClick={() => setReloadKey((k) => k + 1)}>
                Try again
              </button>
            </div>
          )}

          {!ordersError && orders.length === 0 && (
            <div style={s.stateBlock}>
              <p style={s.stateText}>You haven&rsquo;t placed any orders yet.</p>
              <a href="/men" style={s.emptyCta}>Start shopping</a>
            </div>
          )}

          {!ordersError && orders.length > 0 && (
            <div style={s.orderList}>
              {orders.map((order) => {
                const itemCount = order.items.reduce((sum, i) => sum + i.quantity, 0);
                return (
                  <div key={order._id} style={s.orderCard}>
                    {order.items[0]?.image && (
                      <img src={order.items[0].image} alt="" style={s.orderThumb} />
                    )}
                    <div style={s.orderBody}>
                      <div style={s.orderHead}>
                        <div style={s.orderRefDate}>
                          <p style={s.orderRef}>Order #{order._id.slice(-6).toUpperCase()}</p>
                          <p style={s.orderDate}>
                            {new Date(order.createdAt).toLocaleDateString(undefined, {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            })}
                          </p>
                        </div>
                        <span style={s.statusPill(order.status)}>{order.status}</span>
                      </div>

                      <p style={s.orderItemsText}>
                        {order.items.map((i) => i.name).join(", ")}
                      </p>

                      <div style={s.orderFoot}>
                        <span style={s.orderCount}>{itemCount} {itemCount === 1 ? "item" : "items"}</span>
                        <span style={s.orderTotal}>EGP {order.total.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}