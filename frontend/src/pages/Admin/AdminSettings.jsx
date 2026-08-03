import { useState } from "react";
import { useAdmin } from "../../context/AdminContext";
import { theme, display } from "../../theme";

export default function AdminSettings() {
  const { adminToken } = useAdmin();
  const [form, setForm] = useState({ email: "", currentPassword: "", newPassword: "", confirmPassword: "" });
  const [status, setStatus] = useState(null); // { type: "success"|"error", message }
  const [saving, setSaving] = useState(false);

  const upd = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus(null);

    if (form.newPassword && form.newPassword !== form.confirmPassword) {
      return setStatus({ type: "error", message: "New passwords don't match" });
    }
    if (!form.currentPassword) {
      return setStatus({ type: "error", message: "Current password is required" });
    }

    setSaving(true);
    try {
      const body = { currentPassword: form.currentPassword };
      if (form.email) body.email = form.email;
      if (form.newPassword) body.newPassword = form.newPassword;

      const res = await fetch("/api/admin/credentials", {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${adminToken}` },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setStatus({ type: "success", message: "Credentials updated successfully" });
      setForm({ email: "", currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch (err) {
      setStatus({ type: "error", message: err.message });
    } finally {
      setSaving(false);
    }
  };

  const s = {
    title: { ...display, fontSize: 28, margin: "0 0 8px", color: theme.textOnLight },
    subtitle: { fontSize: 13, color: theme.textOnLightMuted, marginBottom: 32 },
    card: {
      background: theme.surfaceLight, border: `1px solid ${theme.hairlineOnLight}`,
      borderRadius: theme.radius, padding: 32, maxWidth: 480,
    },
    sectionLabel: {
      fontSize: 10, letterSpacing: "0.22em", textTransform: "uppercase",
      color: theme.accent, marginBottom: 16, display: "block",
    },
    divider: { borderTop: `1px solid ${theme.hairlineOnLight}`, margin: "24px 0" },
    field: { display: "flex", flexDirection: "column", gap: 5, marginBottom: 14 },
    fieldLabel: {
      fontSize: 10, letterSpacing: "0.18em", textTransform: "uppercase",
      color: theme.textOnLightMuted,
    },
    input: {
      padding: "10px 12px", background: theme.surfaceLight,
      border: `1px solid ${theme.hairlineOnLight}`, borderRadius: theme.radius,
      color: theme.textOnLight, fontSize: 13, fontFamily: theme.fontBody, outline: "none",
    },
    alert: (type) => ({
      padding: "10px 14px", borderRadius: theme.radius, fontSize: 13, marginBottom: 16,
      background: type === "success" ? "rgba(15,91,70,0.1)" : "rgba(180,60,60,0.08)",
      color: type === "success" ? theme.accent : "#b43c3c",
      border: `1px solid ${type === "success" ? "rgba(15,91,70,0.2)" : "rgba(180,60,60,0.2)"}`,
    }),
    saveBtn: {
      padding: "11px 28px", background: theme.accent, border: "none",
      borderRadius: theme.radius, color: theme.textOnDark, fontSize: 11,
      fontWeight: 600, letterSpacing: "0.14em", textTransform: "uppercase",
      cursor: "pointer", fontFamily: theme.fontBody, marginTop: 8,
    },
  };

  return (
    <div>
      <h1 style={s.title}>Settings</h1>
      <p style={s.subtitle}>Update the admin email and password.</p>

      <div style={s.card}>
        <form onSubmit={handleSubmit}>
          {status && <div style={s.alert(status.type)}>{status.message}</div>}

          <span style={s.sectionLabel}>Change email</span>
          <div style={s.field}>
            <label style={s.fieldLabel}>New email</label>
            <input
              type="email" style={s.input} value={form.email}
              onChange={(e) => upd("email", e.target.value)}
              placeholder="Leave blank to keep current"
            />
          </div>

          <div style={s.divider} />

          <span style={s.sectionLabel}>Change password</span>
          <div style={s.field}>
            <label style={s.fieldLabel}>New password</label>
            <input
              type="password" style={s.input} value={form.newPassword}
              onChange={(e) => upd("newPassword", e.target.value)}
              placeholder="Leave blank to keep current"
            />
          </div>
          <div style={s.field}>
            <label style={s.fieldLabel}>Confirm new password</label>
            <input
              type="password" style={s.input} value={form.confirmPassword}
              onChange={(e) => upd("confirmPassword", e.target.value)}
              placeholder="Repeat new password"
            />
          </div>

          <div style={s.divider} />

          <div style={s.field}>
            <label style={s.fieldLabel}>Current password (required to save)</label>
            <input
              type="password" style={s.input} value={form.currentPassword}
              onChange={(e) => upd("currentPassword", e.target.value)}
              placeholder="Enter your current password"
              required
            />
          </div>

          <button type="submit" style={s.saveBtn} disabled={saving}>
            {saving ? "Saving…" : "Save changes"}
          </button>
        </form>
      </div>
    </div>
  );
}