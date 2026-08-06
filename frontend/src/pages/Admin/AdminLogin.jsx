import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAdmin } from "../../context/AdminContext";
import { theme, display } from "../../theme";

export default function AdminLogin() {
  const { login } = useAdmin();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Invalid credentials");
      login(data.token);
      navigate("/admin");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const s = {
    page: {
      minHeight: "100vh",
      background: theme.surfaceDark,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: 24,
    },
    card: {
      width: "100%",
      maxWidth: 380,
      background: "rgba(255,255,255,0.06)",
      border: `1px solid ${theme.hairlineOnDark}`,
      borderRadius: theme.radius,
      padding: 40,
    },
    logo: {
      fontFamily: theme.fontDisplay,
      fontSize: 28,
      fontWeight: 700,
      color: theme.textOnDark,
      display: "block",
      marginBottom: 4,
    },
    sub: {
      fontSize: 10,
      letterSpacing: "0.28em",
      textTransform: "uppercase",
      color: theme.textOnDarkMuted,
      display: "block",
      marginBottom: 32,
    },
    title: { ...display, fontSize: 24, margin: "0 0 24px", color: theme.textOnDark },
    field: { display: "flex", flexDirection: "column", gap: 6, marginBottom: 16 },
    fieldLabel: {
      fontSize: 10,
      letterSpacing: "0.2em",
      textTransform: "uppercase",
      color: theme.textOnDarkMuted,
    },
    input: {
      padding: "11px 14px",
      background: "rgba(255,255,255,0.06)",
      border: `1px solid ${theme.hairlineOnDark}`,
      borderRadius: theme.radius,
      color: theme.textOnDark,
      fontSize: 14,
      fontFamily: theme.fontBody,
      outline: "none",
    },
    error: { fontSize: 12, color: "#e07070", marginBottom: 14 },
    btn: {
      width: "100%",
      padding: "12px 0",
      background: theme.accent,
      border: "none",
      borderRadius: theme.radius,
      color: theme.textOnDark,
      fontSize: 11,
      fontWeight: 600,
      letterSpacing: "0.18em",
      textTransform: "uppercase",
      cursor: "pointer",
      fontFamily: theme.fontBody,
    },
  };

  return (
    <div style={s.page}>
      <div style={s.card}>
        <span style={s.logo}>MT</span>
        <span style={s.sub}>Admin panel</span>
        <h1 style={s.title}>Sign in</h1>
        <form onSubmit={handleSubmit}>
          <div style={s.field}>
            <label style={s.fieldLabel}>Email</label>
            <input
              type="email"
              style={s.input}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@medtrack.com"
              autoFocus
            />
          </div>
          <div style={s.field}>
            <label style={s.fieldLabel}>Password</label>
            <input
              type="password"
              style={s.input}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter admin password"
            />
          </div>
          {error && <p style={s.error}>{error}</p>}
          <button type="submit" style={s.btn} disabled={loading}>
            {loading ? "Signing in…" : "Sign in"}
          </button>
        </form>
      </div>
    </div>
  );
}