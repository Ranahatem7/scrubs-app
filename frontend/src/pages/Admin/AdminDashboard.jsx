import { useEffect, useState } from "react";
import { useAdmin } from "../../context/AdminContext";
import { theme, display } from "../../theme";

export default function AdminDashboard() {
  const { adminToken } = useAdmin();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/stats", {
      headers: { Authorization: `Bearer ${adminToken}` },
    })
      .then((r) => r.json())
      .then(setStats)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [adminToken]);

  const s = {
    title: { ...display, fontSize: 28, margin: "0 0 28px", color: theme.textOnLight },
    grid: { display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 36 },

    statCard: {
      background: theme.surfaceLight,
      border: `1px solid ${theme.hairlineOnLight}`,
      borderRadius: theme.radius,
      padding: "24px 20px",
    },
    statLabel: {
      fontSize: 10,
      letterSpacing: "0.22em",
      textTransform: "uppercase",
      color: theme.textOnLightMuted,
      margin: 0,
    },
    statValue: {
      fontFamily: theme.fontDisplay,
      fontWeight: 700,
      fontSize: 34,
      color: theme.accent,
      display: "block",
      marginTop: 8,
    },
    statSub: { fontSize: 11, color: theme.textOnLightMuted, marginTop: 4, marginBottom: 0 },

    sectionTitle: {
      fontSize: 10,
      letterSpacing: "0.22em",
      textTransform: "uppercase",
      color: theme.accent,
      marginBottom: 14,
    },

    table: {
      width: "100%",
      background: theme.surfaceLight,
      border: `1px solid ${theme.hairlineOnLight}`,
      borderRadius: theme.radius,
      overflow: "hidden",
      borderCollapse: "collapse",
    },
    th: {
      padding: "12px 16px",
      fontSize: 10,
      letterSpacing: "0.18em",
      textTransform: "uppercase",
      color: theme.textOnLightMuted,
      textAlign: "left",
      borderBottom: `1px solid ${theme.hairlineOnLight}`,
      background: theme.surfaceMuted,
    },
    td: {
      padding: "13px 16px",
      fontSize: 13,
      color: theme.textOnLight,
      borderBottom: `1px solid ${theme.hairlineOnLight}`,
    },
    badge: (status) => ({
      display: "inline-block",
      padding: "3px 10px",
      borderRadius: 999,
      fontSize: 10,
      letterSpacing: "0.1em",
      textTransform: "uppercase",
      background: status === "delivered"
        ? "rgba(15,91,70,0.12)"
        : status === "processing"
        ? "rgba(15,91,70,0.06)"
        : "rgba(34,37,42,0.06)",
      color: status === "delivered"
        ? theme.accent
        : status === "processing"
        ? theme.accentDeep
        : theme.textOnLightMuted,
    }),
  };

  return (
    <div>
      <h1 style={s.title}>Dashboard</h1>

      <div style={s.grid}>
        {[
          { label: "Total orders", value: loading ? "—" : stats?.totalOrders ?? 0, sub: "All time" },
          { label: "Revenue", value: loading ? "—" : `LE ${(stats?.revenue ?? 0).toLocaleString()}`, sub: "All time" },
          { label: "Products", value: loading ? "—" : stats?.totalProducts ?? 0, sub: "In catalogue" },
          { label: "Users", value: loading ? "—" : stats?.totalUsers ?? 0, sub: "Registered" },
        ].map((card) => (
          <div key={card.label} style={s.statCard}>
            <p style={s.statLabel}>{card.label}</p>
            <span style={s.statValue}>{card.value}</span>
            <p style={s.statSub}>{card.sub}</p>
          </div>
        ))}
      </div>

      <p style={s.sectionTitle}>Recent orders</p>
      <table style={s.table}>
        <thead>
          <tr>
            <th style={s.th}>Customer</th>
            <th style={s.th}>Items</th>
            <th style={s.th}>Total</th>
            <th style={s.th}>Status</th>
            <th style={s.th}>Date</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr><td style={s.td} colSpan={5}>Loading…</td></tr>
          ) : stats?.recentOrders?.length > 0 ? (
            stats.recentOrders.map((order) => (
              <tr key={order._id}>
                <td style={s.td}>{order.name}</td>
                <td style={s.td}>{order.items?.length ?? 0}</td>
                <td style={{ ...s.td, color: theme.accent, fontWeight: 600 }}>LE {order.total?.toLocaleString()}</td>
                <td style={s.td}><span style={s.badge(order.status)}>{order.status}</span></td>
                <td style={{ ...s.td, color: theme.textOnLightMuted }}>{new Date(order.createdAt).toLocaleDateString("en-EG")}</td>
              </tr>
            ))
          ) : (
            <tr><td style={s.td} colSpan={5}>No orders yet.</td></tr>
          )}
        </tbody>
      </table>
    </div>
  );
}