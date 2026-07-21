import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import PulseDivider from "../components/PulseDivider";
import { theme, label, display, btnSolid, metalText } from "../theme";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const update = (field, value) => {
    setForm((f) => ({ ...f, [field]: value }));
    setErrors((e) => ({ ...e, [field]: undefined, form: undefined }));
  };

  const validate = () => {
    const e = {};
    if (!form.email.trim()) e.email = "Required";
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = "Enter a valid email";
    if (!form.password) e.password = "Required";
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }

    setSubmitting(true);
    try {
      await login(form.email, form.password);
      const dest = location.state?.from?.pathname ?? "/profile";
      navigate(dest, { replace: true });
    } catch (err) {
      setErrors({ form: err.message });
    } finally {
      setSubmitting(false);
    }
  };

  const s = {
    page: {
      minHeight: "100vh",
      background: `radial-gradient(65% 40% at 50% 0%, ${theme.bronzeGlow}, transparent 70%), ${theme.ink}`,
      paddingBottom: 80,
    },
    pageHead: {
      padding: `48px ${theme.pad}px 32px`,
      borderBottom: `1px solid ${theme.hairline}`,
    },
    pageTitle: { ...display, margin: "8px 0 0", fontSize: 34 },

    layout: {
      maxWidth: 420,
      margin: "0 auto",
      padding: `40px ${theme.pad}px 0`,
    },

    card: {
      position: "relative",
      overflow: "hidden",
      background: theme.ink2,
      border: `1px solid ${theme.hairline}`,
      borderRadius: theme.radius,
      padding: 24,
      boxShadow: `0 24px 60px -20px ${theme.bronzeGlow}`,
    },
    cardAccent: {
      height: 3,
      margin: "-24px -24px 24px",
      background: `linear-gradient(90deg, ${theme.bronzeDeep}, ${theme.bronze}, ${theme.silver})`,
    },
    cardBrand: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      gap: 4,
      marginBottom: 22,
    },
    cardBrandMt: {
      ...metalText,
      fontFamily: theme.fontDisplay,
      fontSize: 32,
      fontWeight: 600,
      lineHeight: 1,
    },

    formError: {
      padding: "12px 14px",
      marginBottom: 16,
      background: "rgba(192,82,74,0.1)",
      border: "1px solid rgba(192,82,74,0.35)",
      borderRadius: 8,
      color: "#e0847c",
      fontSize: 13,
    },

    fieldGroup: { display: "flex", flexDirection: "column", gap: 16 },
    field: { display: "flex", flexDirection: "column", gap: 6 },
    fieldLabel: {
      fontSize: 10,
      letterSpacing: "0.2em",
      textTransform: "uppercase",
      color: theme.silver,
    },
    input: (hasError) => ({
      padding: "11px 14px",
      background: "rgba(255,255,255,0.04)",
      border: `1px solid ${hasError ? "#c0524a" : "rgba(192,142,90,0.2)"}`,
      borderRadius: 8,
      color: "#fff",
      fontSize: 14,
      fontFamily: theme.fontBody,
      outline: "none",
      transition: "border-color 0.18s, box-shadow 0.18s",
      width: "100%",
    }),
    fieldError: {
      fontSize: 11,
      color: "#c0524a",
      letterSpacing: "0.06em",
    },

    submitBtn: {
      ...btnSolid,
      width: "100%",
      marginTop: 6,
      padding: "14px 0",
      justifyContent: "center",
      fontSize: 13,
      letterSpacing: "0.14em",
      opacity: submitting ? 0.6 : 1,
      cursor: submitting ? "default" : "pointer",
      boxShadow: submitting ? "none" : `0 10px 28px ${theme.bronzeGlow}`,
    },

    switchRow: {
      textAlign: "center",
      marginTop: 22,
      fontSize: 13,
      color: theme.muted,
    },
    switchLink: { color: theme.bronze },
  };

  return (
    <main style={s.page}>
      <div style={s.pageHead}>
        <span style={label}>Welcome back</span>
        <h1 style={s.pageTitle}>Log in</h1>
      </div>

      <PulseDivider />

      <div style={s.layout}>
        <div style={s.card}>
          <div style={s.cardAccent} aria-hidden="true" />
          <div style={s.cardBrand}>
            <span style={s.cardBrandMt}>MT</span>
            <span style={label}>Built for more</span>
          </div>

          {errors.form && <p style={s.formError}>{errors.form}</p>}

          <form onSubmit={handleSubmit} noValidate>
            <div style={s.fieldGroup}>
              <div style={s.field}>
                <label style={s.fieldLabel}>Email</label>
                <input
                  style={s.input(!!errors.email)}
                  value={form.email}
                  onChange={(e) => update("email", e.target.value)}
                  placeholder="you@email.com"
                  type="email"
                  autoComplete="email"
                />
                {errors.email && <span style={s.fieldError}>{errors.email}</span>}
              </div>

              <div style={s.field}>
                <label style={s.fieldLabel}>Password</label>
                <input
                  style={s.input(!!errors.password)}
                  value={form.password}
                  onChange={(e) => update("password", e.target.value)}
                  placeholder="••••••••"
                  type="password"
                  autoComplete="current-password"
                />
                {errors.password && <span style={s.fieldError}>{errors.password}</span>}
              </div>
            </div>

            <button type="submit" style={s.submitBtn} disabled={submitting}>
              {submitting ? "Signing in…" : "Log in"}
            </button>
          </form>
        </div>

        <p style={s.switchRow}>
          New to MedTrack?{" "}
          <Link to="/signup" style={s.switchLink}>Create an account</Link>
        </p>
      </div>
    </main>
  );
}
