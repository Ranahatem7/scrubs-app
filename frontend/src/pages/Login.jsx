import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useAdmin } from "../context/AdminContext";
import { theme, display } from "../theme";

export default function Login() {
  const { setSession } = useAuth();
  const { login: adminLogin } = useAdmin();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const upd = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const safeJSON = async (res) => {
    const text = await res.text();
    try { return text ? JSON.parse(text) : {}; } catch { return {}; }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const adminRes = await fetch(`${import.meta.env.VITE_API_URL}/admin/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (adminRes.ok) {
        const adminData = await safeJSON(adminRes);
        if (adminData.token) {
          adminLogin(adminData.token);
          navigate("/admin");
          return;
        }
      }

      const res = await fetch(`${import.meta.env.VITE_API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await safeJSON(res);
      if (!res.ok) throw new Error(data.message || "Invalid email or password");
      setSession(data.token, data.user);
      navigate("/");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const s = {
    page: {
      minHeight: "100vh", background: theme.surfaceMuted,
      display: "flex", alignItems: "center", justifyContent: "center", padding: 24,
    },
    card: {
      width: "100%", maxWidth: 420, background: theme.surfaceLight,
      border: `1px solid ${theme.hairlineOnLight}`, borderRadius: theme.radius, padding: 40,
    },
    title: { ...display, fontSize: 26, margin: "0 0 24px", color: theme.textOnLight },
    field: { display: "flex", flexDirection: "column", gap: 5, marginBottom: 16 },
    fieldLabel: {
      fontSize: 10, letterSpacing: "0.18em", textTransform: "uppercase",
      color: theme.textOnLightMuted,
    },
    input: {
      padding: "11px 14px", background: theme.surfaceLight,
      border: `1px solid ${theme.hairlineOnLight}`, borderRadius: theme.radius,
      color: theme.textOnLight, fontSize: 14, fontFamily: theme.fontBody, outline: "none",
    },
    error: {
      fontSize: 12, color: "#b43c3c", marginBottom: 14,
      padding: "8px 12px", background: "rgba(180,60,60,0.07)",
      borderRadius: theme.radius, border: "1px solid rgba(180,60,60,0.15)",
    },
    btn: {
      width: "100%", padding: "12px 0", background: theme.accent, border: "none",
      borderRadius: theme.radius, color: theme.textOnDark, fontSize: 11,
      fontWeight: 600, letterSpacing: "0.18em", textTransform: "uppercase",
      cursor: "pointer", fontFamily: theme.fontBody, marginTop: 4,
    },
    footer: {
      marginTop: 20, textAlign: "center", fontSize: 13, color: theme.textOnLightMuted,
    },
    link: { color: theme.accent, textDecoration: "none", fontWeight: 500 },
  };

  return (
    <div style={s.page}>
      <div style={s.card}>
        <img src="/logo_dark.png" alt="MedTrack" style={{ height: 64, width: "auto", display: "block", marginBottom: 28 }} />
        <h1 style={s.title}>Sign in</h1>
        <form onSubmit={handleSubmit}>
          <div style={s.field}>
            <label style={s.fieldLabel}>Email</label>
            <input
              type="email" style={s.input} value={form.email}
              onChange={(e) => upd("email", e.target.value)}
              placeholder="you@example.com" autoFocus required
            />
          </div>
          <div style={s.field}>
            <label style={s.fieldLabel}>Password</label>
            <input
              type="password" style={s.input} value={form.password}
              onChange={(e) => upd("password", e.target.value)}
              placeholder="Your password" required
            />
          </div>
          {error && <p style={s.error}>{error}</p>}
          <button type="submit" style={s.btn} disabled={loading}>
            {loading ? "Signing in…" : "Sign in"}
          </button>
        </form>
        <p style={s.footer}>
          Don't have an account?{" "}
          <Link to="/register" style={s.link}>Create one</Link>
        </p>
      </div>
    </div>
  );
}