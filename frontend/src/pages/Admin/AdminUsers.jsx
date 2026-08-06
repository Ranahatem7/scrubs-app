import { useEffect, useState } from "react";
import { useAdmin } from "../../context/AdminContext";
import { theme, display } from "../../theme";

export default function AdminUsers() {
  const { adminToken } = useAdmin();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const headers = { Authorization: `Bearer ${adminToken}` };

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/admin/users", { headers })
      .then((r) => r.json())
      .then(setUsers)
      .finally(() => setLoading(false));
  }, []);

  const filtered = users.filter((u) =>
    u.name?.toLowerCase().includes(search.toLowerCase()) ||
    u.email?.toLowerCase().includes(search.toLowerCase())
  );

  const s = {
    topRow: { display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 },
    title: { ...display, fontSize: 28, margin: 0, color: theme.textOnLight },
    count: { fontSize: 13, color: theme.textOnLightMuted },
    searchInput: {
      padding: "9px 14px", background: theme.surfaceLight,
      border: `1px solid ${theme.hairlineOnLight}`, borderRadius: theme.radius,
      color: theme.textOnLight, fontSize: 13, fontFamily: theme.fontBody,
      outline: "none", width: 240, marginBottom: 20,
    },
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
      borderBottom: `1px solid ${theme.hairlineOnLight}`,
    },
    avatar: {
      width: 34, height: 34, borderRadius: "50%",
      background: "rgba(15,91,70,0.12)",
      display: "flex", alignItems: "center", justifyContent: "center",
      fontSize: 13, color: theme.accent, fontFamily: theme.fontDisplay, fontWeight: 600,
    },
  };

  return (
    <div>
      <div style={s.topRow}>
        <h1 style={s.title}>Users</h1>
        <span style={s.count}>{filtered.length} users</span>
      </div>

      <input
        style={s.searchInput}
        placeholder="Search by name or email…"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <table style={s.table}>
        <thead>
          <tr>
            <th style={s.th}></th>
            <th style={s.th}>Name</th>
            <th style={s.th}>Email</th>
            <th style={s.th}>Joined</th>
            <th style={s.th}>Orders</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr><td style={s.td} colSpan={5}>Loading…</td></tr>
          ) : filtered.length === 0 ? (
            <tr><td style={s.td} colSpan={5}>No users found.</td></tr>
          ) : filtered.map((user) => (
            <tr key={user._id}>
              <td style={s.td}>
                <div style={s.avatar}>{user.name?.[0]?.toUpperCase() ?? "?"}</div>
              </td>
              <td style={{ ...s.td, fontWeight: 600 }}>{user.name}</td>
              <td style={{ ...s.td, color: theme.textOnLightMuted }}>{user.email}</td>
              <td style={{ ...s.td, color: theme.textOnLightMuted }}>
                {new Date(user.createdAt).toLocaleDateString("en-EG")}
              </td>
              <td style={{ ...s.td, color: theme.accent, fontWeight: 600 }}>{user.orderCount ?? 0}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}