import { useEffect, useState } from "react";
import { useAdmin } from "../../context/AdminContext";
import { theme, display } from "../../theme";

export default function AdminUsers() {
  const { adminToken } = useAdmin();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const getHeaders = () => ({
    "Content-Type": "application/json",
    Authorization: `Bearer ${adminToken}`,
  });

  const load = () => {
    fetch(`${import.meta.env.VITE_API_URL}/admin/users`, { headers: getHeaders() })
      .then((r) => r.json())
      .then((data) => setUsers(Array.isArray(data) ? data : []))
      .finally(() => setLoading(false));
  };

  useEffect(() => { if (adminToken) load(); }, [adminToken]);

  const toggleAdmin = async (user) => {
    const isAdmin = user.role === "admin";
    const action = isAdmin ? "remove admin" : "make admin";
    if (!confirm(`${isAdmin ? "Remove admin from" : "Make admin"}: ${user.email}?`)) return;
    const res = await fetch(`${import.meta.env.VITE_API_URL}/admin/users/${user._id}/role`, {
      method: "PUT",
      headers: getHeaders(),
      body: JSON.stringify({ role: isAdmin ? "customer" : "admin" }),
    });
    if (res.ok) {
      setUsers((prev) =>
        prev.map((u) => u._id === user._id ? { ...u, role: isAdmin ? "customer" : "admin" } : u)
      );
    }
  };

  const deleteUser = async (user) => {
    if (!confirm(`Delete user "${user.name}" (${user.email})? This cannot be undone.`)) return;
    const res = await fetch(`${import.meta.env.VITE_API_URL}/admin/users/${user._id}`, {
      method: "DELETE",
      headers: getHeaders(),
    });
    if (res.ok) setUsers((prev) => prev.filter((u) => u._id !== user._id));
  };

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
    roleBadge: (isAdmin) => ({
      display: "inline-block", padding: "3px 10px", borderRadius: 999,
      fontSize: 10, letterSpacing: "0.1em", textTransform: "uppercase",
      background: isAdmin ? "rgba(15,91,70,0.12)" : "rgba(34,37,42,0.06)",
      color: isAdmin ? theme.accent : theme.textOnLightMuted,
    }),
    adminBtn: (isAdmin) => ({
      padding: "5px 12px", fontSize: 11, borderRadius: theme.radius, cursor: "pointer",
      border: `1px solid ${isAdmin ? "rgba(180,60,60,0.3)" : "rgba(15,91,70,0.3)"}`,
      background: "transparent",
      color: isAdmin ? "#b43c3c" : theme.accent,
      fontFamily: theme.fontBody, marginRight: 6,
    }),
    deleteBtn: {
      padding: "5px 12px", fontSize: 11, borderRadius: theme.radius, cursor: "pointer",
      border: `1px solid rgba(180,60,60,0.3)`, background: "transparent",
      color: "#b43c3c", fontFamily: theme.fontBody,
    },
  };

  return (
    <div>
      <div style={s.topRow}>
        <h1 style={s.title}>Users</h1>
        <span style={s.count}>{filtered.length} registered accounts.</span>
      </div>

      <input
        style={s.searchInput}
        placeholder="Search by name or email…"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <div style={{ overflowX: "auto" }}>
        <table style={s.table}>
          <thead>
            <tr>
              <th style={s.th}></th>
              <th style={s.th}>Name</th>
              <th style={s.th}>Email</th>
              <th style={s.th}>Joined</th>
              <th style={s.th}>Orders</th>
              <th style={s.th}>Role</th>
              <th style={s.th}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td style={s.td} colSpan={7}>Loading…</td></tr>
            ) : filtered.length === 0 ? (
              <tr><td style={s.td} colSpan={7}>No users found.</td></tr>
            ) : filtered.map((user) => {
              const isAdmin = user.role === "admin";
              return (
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
                  <td style={s.td}>
                    <span style={s.roleBadge(isAdmin)}>{isAdmin ? "Admin" : "Customer"}</span>
                  </td>
                  <td style={s.td}>
                    <button style={s.adminBtn(isAdmin)} onClick={() => toggleAdmin(user)}>
                      {isAdmin ? "Remove admin" : "Make admin"}
                    </button>
                    <button style={s.deleteBtn} onClick={() => deleteUser(user)}>
                      Delete
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}