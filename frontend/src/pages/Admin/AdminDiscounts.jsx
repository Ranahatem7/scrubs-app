import { useEffect, useState } from "react";
import { useAdmin } from "../../context/AdminContext";
import { theme, display } from "../../theme";

export default function AdminDiscounts() {
  const { adminToken } = useAdmin();
  const [discounts, setDiscounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ code: "", percentage: "" });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${adminToken}`,
  };

  const load = () => {
    setLoading(true);
    fetch(`${import.meta.env.VITE_API_URL}/admin/discounts`, { headers })
      .then((r) => r.json())
      .then((data) => setDiscounts(Array.isArray(data) ? data : []))
      .finally(() => setLoading(false));
  };

  useEffect(() => { if (adminToken) load(); }, [adminToken]);

  const handleCreate = async (e) => {
    e.preventDefault();
    setError(""); setSuccess("");
    if (!form.code.trim() || !form.percentage) return setError("Code and percentage are required.");
    const pct = Number(form.percentage);
    if (isNaN(pct) || pct < 1 || pct > 100) return setError("Percentage must be between 1 and 100.");
    setSaving(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/admin/discounts`, {
        method: "POST", headers,
        body: JSON.stringify({ code: form.code.toUpperCase().trim(), percentage: pct }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to create code");
      setDiscounts((prev) => [data, ...prev]);
      setForm({ code: "", percentage: "" });
      setSuccess(`Code "${data.code}" created.`);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const toggleActive = async (id, current) => {
    const res = await fetch(`${import.meta.env.VITE_API_URL}/admin/discounts/${id}`, {
      method: "PUT", headers,
      body: JSON.stringify({ active: !current }),
    });
    const data = await res.json();
    setDiscounts((prev) => prev.map((d) => d._id === id ? data : d));
  };

  const deleteDiscount = async (id) => {
    if (!confirm("Delete this discount code?")) return;
    await fetch(`${import.meta.env.VITE_API_URL}/admin/discounts/${id}`, {
      method: "DELETE", headers,
    });
    setDiscounts((prev) => prev.filter((d) => d._id !== id));
  };

  const s = {
    title: { ...display, fontSize: 28, margin: "0 0 28px", color: theme.textOnLight },
    card: {
      background: theme.surfaceLight, border: `1px solid ${theme.hairlineOnLight}`,
      borderRadius: theme.radius, padding: 24, marginBottom: 32,
      boxShadow: "0 1px 3px rgba(34,37,42,0.06)",
    },
    cardTitle: {
      fontSize: 11, fontWeight: 500, letterSpacing: "0.22em", textTransform: "uppercase",
      color: theme.accent, margin: "0 0 20px",
    },
    form: { display: "flex", gap: 12, flexWrap: "wrap", alignItems: "flex-end" },
    field: { display: "flex", flexDirection: "column", gap: 6 },
    label: { fontSize: 10, letterSpacing: "0.18em", textTransform: "uppercase", color: theme.textOnLightMuted },
    input: {
      padding: "10px 14px", fontSize: 13, fontFamily: theme.fontBody,
      border: `1px solid ${theme.hairlineOnLight}`, borderRadius: theme.radius,
      background: theme.surfaceMuted, color: theme.textOnLight, outline: "none",
    },
    btn: {
      padding: "10px 20px", fontSize: 11, fontWeight: 600, letterSpacing: "0.14em",
      textTransform: "uppercase", background: theme.accent, color: theme.textOnDark,
      border: "none", borderRadius: theme.radius, cursor: "pointer", fontFamily: theme.fontBody,
    },
    msg: (isError) => ({
      fontSize: 12, padding: "10px 14px", borderRadius: theme.radius, marginBottom: 16,
      background: isError ? "rgba(192,82,74,0.1)" : "rgba(15,91,70,0.08)",
      color: isError ? "#a23b34" : theme.accent,
      border: `1px solid ${isError ? "rgba(192,82,74,0.3)" : "rgba(15,91,70,0.2)"}`,
    }),
    table: {
      width: "100%", borderCollapse: "collapse",
      border: `1px solid ${theme.hairlineOnLight}`, borderRadius: theme.radius, overflow: "hidden",
    },
    th: {
      padding: "11px 16px", fontSize: 10, letterSpacing: "0.18em", textTransform: "uppercase",
      color: theme.textOnLightMuted, textAlign: "left",
      borderBottom: `1px solid ${theme.hairlineOnLight}`, background: theme.surfaceMuted,
    },
    td: {
      padding: "13px 16px", fontSize: 13, color: theme.textOnLight,
      borderBottom: `1px solid ${theme.hairlineOnLight}`,
    },
    badge: (active) => ({
      display: "inline-block", padding: "3px 10px", borderRadius: 999,
      fontSize: 10, letterSpacing: "0.1em", textTransform: "uppercase",
      background: active ? "rgba(15,91,70,0.1)" : "rgba(34,37,42,0.06)",
      color: active ? theme.accent : theme.textOnLightMuted,
    }),
    toggleBtn: {
      padding: "4px 10px", fontSize: 11, border: `1px solid ${theme.hairlineOnLight}`,
      borderRadius: theme.radius, background: "transparent", color: theme.textOnLightMuted,
      cursor: "pointer", fontFamily: theme.fontBody, marginRight: 6,
    },
    deleteBtn: {
      padding: "4px 10px", fontSize: 11, border: `1px solid rgba(180,60,60,0.3)`,
      borderRadius: theme.radius, background: "transparent", color: "#b43c3c",
      cursor: "pointer", fontFamily: theme.fontBody,
    },
  };

  return (
    <div>
      <h1 style={s.title}>Discount Codes</h1>

      {/* Create form */}
      <div style={s.card}>
        <p style={s.cardTitle}>Create new code</p>
        {error && <div style={s.msg(true)}>{error}</div>}
        {success && <div style={s.msg(false)}>{success}</div>}
        <form onSubmit={handleCreate} style={s.form}>
          <div style={s.field}>
            <label style={s.label}>Code</label>
            <input
              style={{ ...s.input, width: 180, textTransform: "uppercase" }}
              placeholder="e.g. SAVE20"
              value={form.code}
              onChange={(e) => setForm((f) => ({ ...f, code: e.target.value }))}
            />
          </div>
          <div style={s.field}>
            <label style={s.label}>Discount %</label>
            <input
              style={{ ...s.input, width: 100 }}
              type="number" min="1" max="100"
              placeholder="20"
              value={form.percentage}
              onChange={(e) => setForm((f) => ({ ...f, percentage: e.target.value }))}
            />
          </div>
          <button type="submit" style={s.btn} disabled={saving}>
            {saving ? "Creating…" : "Create code"}
          </button>
        </form>
      </div>

      {/* Table */}
      {loading ? (
        <p style={{ color: theme.textOnLightMuted, fontSize: 13 }}>Loading…</p>
      ) : discounts.length === 0 ? (
        <p style={{ color: theme.textOnLightMuted, fontSize: 13 }}>No discount codes yet.</p>
      ) : (
        <div style={{ overflowX: "auto" }}>
          <table style={s.table}>
            <thead>
              <tr>
                <th style={s.th}>Code</th>
                <th style={s.th}>Discount</th>
                <th style={s.th}>Used</th>
                <th style={s.th}>Status</th>
                <th style={s.th}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {discounts.map((d) => (
                <tr key={d._id}>
                  <td style={{ ...s.td, fontWeight: 600, letterSpacing: "0.08em" }}>{d.code}</td>
                  <td style={{ ...s.td, color: theme.accent, fontWeight: 600 }}>{d.percentage}% off</td>
                  <td style={{ ...s.td, color: theme.textOnLightMuted }}>{d.usedCount} times</td>
                  <td style={s.td}><span style={s.badge(d.active)}>{d.active ? "Active" : "Inactive"}</span></td>
                  <td style={s.td}>
                    <button style={s.toggleBtn} onClick={() => toggleActive(d._id, d.active)}>
                      {d.active ? "Deactivate" : "Activate"}
                    </button>
                    <button style={s.deleteBtn} onClick={() => deleteDiscount(d._id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}