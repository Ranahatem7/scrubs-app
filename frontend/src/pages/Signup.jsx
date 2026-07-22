import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import PulseDivider from "../components/PulseDivider";
import { theme, label, display, btnSolid, strongText } from "../theme";
import { useAuth } from "../context/AuthContext";

export default function Signup() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({ name: "", email: "", password: "", confirmPassword: "" });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const update = (field, value) => {
    setForm((f) => ({ ...f, [field]: value }));
    setErrors((e) => ({ ...e, [field]: undefined, form: undefined }));
  };

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = "Required";
    if (!form.email.trim()) e.email = "Required";
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = "Enter a valid email";
    if (!form.password) e.password = "Required";
    else if (form.password.length < 6) e.password = "Must be at least 6 characters";
    if (form.confirmPassword !== form.password) e.confirmPassword = "Passwords don't match";
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
      await register(form.name, form.email, form.password);
      navigate("/profile", { replace: true });
    } catch (err) {
      setErrors({ form: err.message });
    } finally {
      setSubmitting(false);
    }
  };

  const s = {
    page: {
      minHeight: "100vh",
      background: theme.ink,
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
    },
    cardAccent: {
      height: 2,
      margin: "-24px -24px 24px",
      background: theme.forest,
    },
    cardBrand: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      gap: 4,
      marginBottom: 22,
    },
    // TODO: swap for the real MT/ECG logo asset once provided — text treatment is a placeholder
    cardBrandMt: {
      ...strongText,
      fontFamily: theme.fontDisplay,
      fontSize: 32,
      fontWeight: 700,
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
      color: theme.lightGray,
    },
    input: (hasError) => ({
      padding: "11px 14px",
      background: "rgba(255,255,255,0.04)",
      border: `1px solid ${hasError ? "#c0524a" : "rgba(255,255,255,0.1)"}`,
      borderRadius: 8,
      color: "#fff",
      fontSize: 14,
      fontFamily: theme.fontBody,
      outline: "none",
      transition: "border-color 0.18s",
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
    },

    switchRow: {
      textAlign: "center",
      marginTop: 22,
      fontSize: 13,
      color: theme.muted,
    },
    switchLink: { color: theme.white, textDecoration: "underline" },
  };

  return (
    <main style={s.page}>
      <div style={s.pageHead}>
        <span style={label}>Join MedTrack</span>
        <h1 style={s.pageTitle}>Create account</h1>
      </div>

      <PulseDivider />

      <div style={s.layout}>
        <div style={s.card}>
          <div style={s.cardAccent} aria-hidden="true" />
          <div style={s.cardBrand}>
            <span style={s.cardBrandMt}>MT</span>
            <span style={label}>Medical Wear</span>
          </div>

          {errors.form && <p style={s.formError}>{errors.form}</p>}

          <form onSubmit={handleSubmit} noValidate>
            <div style={s.fieldGroup}>
              <div style={s.field}>
                <label style={s.fieldLabel}>Full name</label>
                <input
                  style={s.input(!!errors.name)}
                  value={form.name}
                  onChange={(e) => update("name", e.target.value)}
                  placeholder="Rasha ElHady"
                  autoComplete="name"
                />
                {errors.name && <span style={s.fieldError}>{errors.name}</span>}
              </div>

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
                  placeholder="At least 6 characters"
                  type="password"
                  autoComplete="new-password"
                />
                {errors.password && <span style={s.fieldError}>{errors.password}</span>}
              </div>

              <div style={s.field}>
                <label style={s.fieldLabel}>Confirm password</label>
                <input
                  style={s.input(!!errors.confirmPassword)}
                  value={form.confirmPassword}
                  onChange={(e) => update("confirmPassword", e.target.value)}
                  placeholder="••••••••"
                  type="password"
                  autoComplete="new-password"
                />
                {errors.confirmPassword && (
                  <span style={s.fieldError}>{errors.confirmPassword}</span>
                )}
              </div>
            </div>

            <button type="submit" style={s.submitBtn} disabled={submitting}>
              {submitting ? "Creating account…" : "Create account"}
            </button>
          </form>
        </div>

        <p style={s.switchRow}>
          Already have an account?{" "}
          <Link to="/login" style={s.switchLink}>Log in</Link>
        </p>
      </div>
    </main>
  );
}
