import { useEffect, useState } from "react";
import { useAdmin } from "../../context/AdminContext";
import { theme, display } from "../../theme";

export default function AdminMessages() {
  const { adminToken } = useAdmin();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(null);

  const headers = { Authorization: `Bearer ${adminToken}` };

  const load = () => {
    setLoading(true);
    fetch(`${import.meta.env.VITE_API_URL}/admin/messages`, { headers })
      .then((r) => r.json())
      .then((data) => setMessages(Array.isArray(data) ? data : []))
      .finally(() => setLoading(false));
  };

  useEffect(() => { if (adminToken) load(); }, [adminToken]);

  const markRead = async (id) => {
    await fetch(`${import.meta.env.VITE_API_URL}/admin/messages/${id}/read`, {
      method: "PUT", headers,
    });
    setMessages((prev) => prev.map((m) => m._id === id ? { ...m, read: true } : m));
  };

  const deleteMsg = async (id) => {
    if (!confirm("Delete this message?")) return;
    await fetch(`${import.meta.env.VITE_API_URL}/admin/messages/${id}`, {
      method: "DELETE", headers,
    });
    setMessages((prev) => prev.filter((m) => m._id !== id));
    if (expanded === id) setExpanded(null);
  };

  const toggleExpand = (id) => {
    setExpanded((prev) => (prev === id ? null : id));
    const msg = messages.find((m) => m._id === id);
    if (msg && !msg.read) markRead(id);
  };

  const unreadCount = messages.filter((m) => !m.read).length;

  const s = {
    title: { ...display, fontSize: 28, margin: "0 0 6px", color: theme.textOnLight },
    subtitle: { fontSize: 13, color: theme.textOnLightMuted, margin: "0 0 28px" },
    badge: {
      display: "inline-block", padding: "2px 10px", borderRadius: 999,
      fontSize: 11, background: theme.accent, color: "#fff",
      marginLeft: 10, verticalAlign: "middle",
    },
    table: {
      width: "100%", borderCollapse: "collapse",
      border: `1px solid ${theme.hairlineOnLight}`,
      borderRadius: theme.radius, overflow: "hidden",
    },
    th: {
      padding: "11px 16px", fontSize: 10, letterSpacing: "0.18em", textTransform: "uppercase",
      color: theme.textOnLightMuted, textAlign: "left",
      borderBottom: `1px solid ${theme.hairlineOnLight}`, background: theme.surfaceMuted,
    },
    td: (unread) => ({
      padding: "13px 16px", fontSize: 13,
      color: unread ? theme.textOnLight : theme.textOnLightMuted,
      borderBottom: `1px solid ${theme.hairlineOnLight}`,
      fontWeight: unread ? 600 : 400,
      cursor: "pointer",
    }),
    expandedRow: {
      padding: "16px 20px",
      background: theme.surfaceMuted,
      borderBottom: `1px solid ${theme.hairlineOnLight}`,
      fontSize: 13, color: theme.textOnLight, lineHeight: 1.7,
    },
    expandedMeta: { fontSize: 11, color: theme.textOnLightMuted, marginBottom: 8 },
    deleteBtn: {
      padding: "4px 10px", fontSize: 11,
      border: "1px solid rgba(180,60,60,0.3)",
      borderRadius: theme.radius, background: "transparent",
      color: "#b43c3c", cursor: "pointer", fontFamily: theme.fontBody,
    },
    unreadDot: {
      display: "inline-block", width: 7, height: 7,
      borderRadius: "50%", background: theme.accent, marginRight: 6,
    },
  };

  const fmt = (dateStr) => new Date(dateStr).toLocaleString("en-EG", {
    day: "numeric", month: "short", year: "numeric",
    hour: "2-digit", minute: "2-digit",
  });

  return (
    <div>
      <h1 style={s.title}>
        Messages
        {unreadCount > 0 && <span style={s.badge}>{unreadCount} new</span>}
      </h1>
      <p style={s.subtitle}>Contact form submissions from your customers.</p>

      {loading ? (
        <p style={{ color: theme.textOnLightMuted, fontSize: 13 }}>Loading…</p>
      ) : messages.length === 0 ? (
        <p style={{ color: theme.textOnLightMuted, fontSize: 13 }}>No messages yet.</p>
      ) : (
        <div style={{ overflowX: "auto" }}>
          <table style={s.table}>
            <thead>
              <tr>
                <th style={s.th}>Name</th>
                <th style={s.th}>Email</th>
                <th style={s.th}>Phone</th>
                <th style={s.th}>Date</th>
                <th style={s.th}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {messages.map((m) => (
                <>
                  <tr key={m._id} onClick={() => toggleExpand(m._id)}>
                    <td style={s.td(!m.read)}>
                      {!m.read && <span style={s.unreadDot} />}
                      {m.name}
                    </td>
                    <td style={s.td(!m.read)}>{m.email}</td>
                    <td style={s.td(false)}>{m.phone || "—"}</td>
                    <td style={s.td(false)}>{fmt(m.createdAt)}</td>
                    <td style={s.td(false)} onClick={(e) => e.stopPropagation()}>
                      <button style={s.deleteBtn} onClick={() => deleteMsg(m._id)}>Delete</button>
                    </td>
                  </tr>
                  {expanded === m._id && (
                    <tr key={`${m._id}-expand`}>
                      <td colSpan={5} style={s.expandedRow}>
                        <p style={s.expandedMeta}>Message from {m.name} · {m.email}{m.phone ? ` · ${m.phone}` : ""}</p>
                        <p style={{ margin: 0, whiteSpace: "pre-wrap" }}>{m.message}</p>
                      </td>
                    </tr>
                  )}
                </>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}