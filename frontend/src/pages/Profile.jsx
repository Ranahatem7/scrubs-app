import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import PulseDivider from "../components/PulseDivider";
import useIsDesktop from "../hooks/useIsDesktop";
import { theme, label, display, btnGhost, btnSolid, strongText } from "../theme";
import { useAuth } from "../context/AuthContext";
import { getMyOrders } from "../services/orders";

const STATUS_STYLES = {
  pending: { color: theme.white, border: "rgba(15,91,70,0.5)", bg: "rgba(15,91,70,0.25)" },
  confirmed: { color: "#8fb8a8", border: "rgba(143,184,168,0.35)", bg: "rgba(143,184,168,0.08)" },
  shipped: { color: "#8fb0c9", border: "rgba(143,176,201,0.35)", bg: "rgba(143,176,201,0.08)" },
  delivered: { color: "#8fc98f", border: "rgba(143,201,143,0.35)", bg: "rgba(143,201,143,0.08)" },
  cancelled: { color: "#d98a8a", border: "rgba(217,138,138,0.35)", bg: "rgba(217,138,138,0.08)" },
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

  const handleSignOut = () => {
    logout();
    navigate("/");
  };

  const initial = user?.name?.trim()?.[0]?.toUpperCase() ?? "?";
  const memberSince = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString(undefined, { month: "long", year: "numeric" })
    : null;

  const s = {
    page: { minHeight: "100vh", background: theme.ink, paddingBottom: 80 },
    pageHead: {
      padding: `48px ${theme.pad}px 32px`,
      borderBottom: `1px solid ${theme.hairline}`,
    },
    pageTitle: { ...display, margin: "8px 0 0", fontSize: isDesktop ? 40 : 32 },

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
      background: theme.ink2,
      border: `1px solid ${theme.hairline}`,
      borderRadius: theme.radius,
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
      background: theme.forest,
      display: "grid",
      placeItems: "center",
      fontFamily: theme.fontDisplay,
      fontSize: 22,
      fontWeight: 700,
      color: theme.white,
      flexShrink: 0,
    },
    accountName: { ...strongText, fontFamily: theme.fontDisplay, fontSize: 19, margin: 0, lineHeight: 1.25 },
    accountEmail: {
      fontSize: 12,
      color: theme.lightGray,
      margin: "3px 0 0",
      wordBreak: "break-word",
    },
    memberSince: {
      fontSize: 11,
      color: theme.muted,
      letterSpacing: "0.06em",
      paddingTop: 16,
      marginTop: 16,
      borderTop: "1px solid rgba(255,255,255,0.06)",
    },
    signOutBtn: { ...btnGhost, width: "100%", justifyContent: "center", marginTop: 18 },

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
      color: theme.lightGray,
      margin: 0,
    },
    orderCountNote: { fontSize: 12, color: theme.muted },

    stateBlock: {
      padding: "48px 24px",
      textAlign: "center",
      background: theme.ink2,
      border: `1px solid ${theme.hairline}`,
      borderRadius: theme.radius,
    },
    stateText: { fontSize: 13, color: theme.muted, margin: "0 0 16px" },
    errorText: { fontSize: 13, color: "#d98a8a", margin: "0 0 16px" },
    retryBtn: { ...btnGhost, display: "inline-flex" },
    emptyCta: { ...btnSolid, display: "inline-flex", paddingInline: 28, marginTop: 4 },

    orderList: { display: "flex", flexDirection: "column", gap: 12 },
    orderCard: {
      display: "flex",
      gap: 14,
      padding: 16,
      background: theme.ink2,
      border: `1px solid ${theme.hairline}`,
      borderRadius: theme.radius,
    },
    orderThumb: {
      width: 56,
      height: 68,
      objectFit: "cover",
      borderRadius: 6,
      flexShrink: 0,
      background: "rgba(255,255,255,0.04)",
    },
    orderBody: { flex: 1, minWidth: 0 },
    orderHead: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 10 },
    orderRefDate: { minWidth: 0 },
    orderRef: { fontSize: 11, color: theme.lightGray, letterSpacing: "0.04em", fontFamily: theme.fontBody },
    orderDate: { fontSize: 11, color: theme.muted, marginTop: 2 },
    statusPill: (status) => ({
      flexShrink: 0,
      fontSize: 9,
      fontWeight: 500,
      letterSpacing: "0.12em",
      textTransform: "uppercase",
      padding: "4px 10px",
      borderRadius: 999,
      whiteSpace: "nowrap",
      border: `1px solid ${STATUS_STYLES[status]?.border ?? theme.hairline}`,
      color: STATUS_STYLES[status]?.color ?? theme.lightGray,
      background: STATUS_STYLES[status]?.bg ?? "transparent",
    }),
    orderItemsText: {
      fontSize: 13,
      color: theme.lightGray,
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
      borderTop: "1px solid rgba(255,255,255,0.06)",
    },
    orderCount: { fontSize: 11, color: theme.muted },
    orderTotal: { ...strongText, fontSize: 16, fontFamily: theme.fontDisplay },
  };

  return (
    <main style={s.page}>
      <div style={s.pageHead}>
        <span style={label}>Account</span>
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
            {!ordersLoading && !ordersError && orders.length > 0 && (
              <span style={s.orderCountNote}>
                {orders.length} {orders.length === 1 ? "order" : "orders"}
              </span>
            )}
          </div>

          {ordersLoading && <p style={s.stateBlock}>Loading orders…</p>}

          {!ordersLoading && ordersError && (
            <div style={s.stateBlock}>
              <p style={s.errorText}>{ordersError}</p>
              <button style={s.retryBtn} onClick={() => setReloadKey((k) => k + 1)}>
                Try again
              </button>
            </div>
          )}

          {!ordersLoading && !ordersError && orders.length === 0 && (
            <div style={s.stateBlock}>
              <p style={s.stateText}>You haven&rsquo;t placed any orders yet.</p>
              <a href="/men" style={s.emptyCta}>Start shopping</a>
            </div>
          )}

          {!ordersLoading && !ordersError && orders.length > 0 && (
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
