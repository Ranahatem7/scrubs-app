import { useEffect, useState } from "react";
import { useAdmin } from "../../context/AdminContext";
import { theme, display } from "../../theme";

const STATUSES = ["pending", "processing", "shipped", "delivered", "cancelled"];

const STATUS_COLORS = {
  pending:    { bg: "rgba(34,37,42,0.06)", color: theme.textOnLightMuted },
  processing: { bg: "rgba(15,91,70,0.07)", color: theme.accent },
  shipped:    { bg: "rgba(15,91,70,0.12)", color: theme.forestDeep },
  delivered:  { bg: "rgba(15,91,70,0.18)", color: theme.forestDeep },
  cancelled:  { bg: "rgba(180,60,60,0.08)", color: "#b43c3c" },
};

export default function AdminOrders() {
  const { adminToken } = useAdmin();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(null);
  const [filter, setFilter] = useState("all");

  const headers = { "Content-Type": "application/json", Authorization: `Bearer ${adminToken}` };

  const load = () => {
    setLoading(true);
    fetch("/api/admin/orders", { headers })
      .then((r) => r.json())
      .then(setOrders)
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const updateStatus = async (id, status) => {
    await fetch(`/api/admin/orders/${id}`, {
      method: "PUT", headers, body: JSON.stringify({ status }),
    });
    setOrders((prev) => prev.map((o) => o._id === id ? { ...o, status } : o));
  };

  const filtered = filter === "all" ? orders : orders.filter((o) => o.status === filter);

  const s = {
    title: { ...display, fontSize: 28, margin: "0 0 24px", color: theme.textOnLight },
    pills: { display: "flex", gap: 8, marginBottom: 20, flexWrap: "wrap" },
    pill: (active) => ({
      padding: "6px 14px", fontSize: 10, letterSpacing: "0.14em", textTransform: "uppercase",
      borderRadius: 999, cursor: "pointer",
      background: active ? theme.accent : "transparent",
      color: active ? theme.textOnDark : theme.textOnLightMuted,
      border: `1px solid ${active ? theme.accent : theme.hairlineOnLight}`,
      fontFamily: theme.fontBody,
    }),
    table: {
      width: "100%", background: theme.surfaceLight, border: `1px solid ${theme.hairlineOnLight}`,
      borderRadius: theme.radius, overflow: "hidden", borderCollapse: "collapse",
    },
    th: {
      padding: "12px 16px", fontSize: 10, letterSpacing: "0.18em",
      textTransform: "uppercase", color: theme.textOnLightMuted, textAlign: "left",
      borderBottom: `1px solid ${theme.hairlineOnLight}`, background: theme.surfaceMuted,
    },
    td: {
      padding: "13px 16px", fontSize: 13, color: theme.textOnLight,
      borderBottom: `1px solid ${theme.hairlineOnLight}`, verticalAlign: "top",
    },
    badge: (status) => ({
      display: "inline-block", padding: "3px 10px", borderRadius: 999,
      fontSize: 10, letterSpacing: "0.1em", textTransform: "uppercase",
      background: (STATUS_COLORS[status] || STATUS_COLORS.pending).bg,
      color: (STATUS_COLORS[status] || STATUS_COLORS.pending).color,
    }),
    select: {
      padding: "5px 8px", fontSize: 11, border: `1px solid ${theme.hairlineOnLight}`,
      borderRadius: theme.radius, background: theme.surfaceLight, color: theme.textOnLight,
      fontFamily: theme.fontBody, cursor: "pointer", outline: "none",
    },
    expandBtn: {
      padding: "4px 10px", fontSize: 11, border: `1px solid ${theme.hairlineOnLight}`,
      borderRadius: theme.radius, background: "transparent", color: theme.textOnLightMuted,
      cursor: "pointer", fontFamily: theme.fontBody,
    },
    expandCell: {
      padding: "14px 16px", background: theme.surfaceMuted,
      fontSize: 12, color: theme.textOnLightMuted,
      borderBottom: `1px solid ${theme.hairlineOnLight}`,
    },
    itemLine: { display: "flex", justifyContent: "space-between", marginBottom: 4 },
  };

  return (
    <div>
      <h1 style={s.title}>Orders</h1>

      <div style={s.pills}>
        {["all", ...STATUSES].map((f) => (
          <button key={f} style={s.pill(filter === f)} onClick={() => setFilter(f)}>
            {f}
          </button>
        ))}
      </div>

      <table style={s.table}>
        <thead>
          <tr>
            <th style={s.th}>Customer</th>
            <th style={s.th}>Phone</th>
            <th style={s.th}>Address</th>
            <th style={s.th}>Payment</th>
            <th style={s.th}>Total</th>
            <th style={s.th}>Status</th>
            <th style={s.th}>Date</th>
            <th style={s.th}>Items</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr><td style={s.td} colSpan={8}>Loading…</td></tr>
          ) : filtered.length === 0 ? (
            <tr><td style={s.td} colSpan={8}>No orders found.</td></tr>
          ) : filtered.map((order) => (
            <>
              <tr key={order._id}>
                <td style={{ ...s.td }}>
                  <div style={{ fontWeight: 600 }}>{order.name}</div>
                  <div style={{ fontSize: 11, color: theme.textOnLightMuted, marginTop: 2 }}>{order.email}</div>
                </td>
                <td style={s.td}>{order.phone}</td>
                <td style={s.td}>{order.street}, {order.city}, {order.governorate}</td>
                <td style={s.td}>{order.paymentMethod}</td>
                <td style={{ ...s.td, color: theme.accent, fontWeight: 600 }}>
                  LE {order.total?.toLocaleString()}
                </td>
                <td style={s.td}>
                  <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                    <span style={s.badge(order.status)}>{order.status}</span>
                    <select
                      style={s.select}
                      value={order.status}
                      onChange={(e) => updateStatus(order._id, e.target.value)}
                    >
                      {STATUSES.map((st) => <option key={st} value={st}>{st}</option>)}
                    </select>
                  </div>
                </td>
                <td style={{ ...s.td, color: theme.textOnLightMuted }}>
                  {new Date(order.createdAt).toLocaleDateString("en-EG")}
                </td>
                <td style={s.td}>
                  <button
                    style={s.expandBtn}
                    onClick={() => setExpanded(expanded === order._id ? null : order._id)}
                  >
                    {expanded === order._id ? "Hide" : `View (${order.items?.length ?? 0})`}
                  </button>
                </td>
              </tr>
              {expanded === order._id && (
                <tr key={`${order._id}-items`}>
                  <td colSpan={8} style={{ padding: 0 }}>
                    <div style={s.expandCell}>
                      {order.items?.map((item, i) => (
                        <div key={i} style={s.itemLine}>
                          <span>{item.name} — {item.size}{item.color ? ` / ${item.color}` : ""} × {item.quantity ?? item.qty}</span>
                          <span style={{ color: theme.accent }}>LE {(item.price * (item.quantity ?? item.qty)).toLocaleString()}</span>
                        </div>
                      ))}
                    </div>
                  </td>
                </tr>
              )}
            </>
          ))}
        </tbody>
      </table>
    </div>
  );
}