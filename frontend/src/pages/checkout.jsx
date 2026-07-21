import { useState } from "react";
import { useNavigate } from "react-router-dom";
import PulseDivider from "../components/PulseDivider";
import useIsDesktop from "../hooks/useIsDesktop";
import { theme, label, display, btnSolid, btnGhost, metalText } from "../theme";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { createOrder } from "../services/orders";

const PAYMENT_METHODS = [
  {
    id: "cod",
    title: "Cash on Delivery",
    note: "Pay when your order arrives",
    icon: "💵",
  },
  {
    id: "vodafone",
    title: "Vodafone Cash",
    note: "Send to our Vodafone Cash wallet",
    icon: "📱",
  },
  {
    id: "instapay",
    title: "Instapay",
    note: "Transfer via Instapay",
    icon: "⚡",
  },
];

export default function Checkout() {
  const isDesktop = useIsDesktop(700);
  const navigate = useNavigate();
  const { user } = useAuth();
  const { items, totalItems, totalPrice, clearCart } = useCart();

  const [form, setForm] = useState({
    name: user?.name ?? "",
    phone: "",
    email: user?.email ?? "",
    street: "",
    city: "",
    governorate: "",
  });

  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const update = (field, value) => {
    setForm((f) => ({ ...f, [field]: value }));
    setErrors((e) => ({ ...e, [field]: undefined, form: undefined }));
  };

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = "Required";
    if (!form.phone.trim()) e.phone = "Required";
   else if (!/^\d{10,13}$/.test(form.phone.replace(/[\s\-\+]/g, "")))
      e.phone = "Enter a valid Egyptian phone number";
    if (!form.email.trim()) e.email = "Required";
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = "Enter a valid email";
    if (!form.street.trim()) e.street = "Required";
    if (!form.city.trim()) e.city = "Required";
    if (!form.governorate.trim()) e.governorate = "Required";
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
      const order = await createOrder({
        items: items.map((i) => ({
          product: i.id,
          size: i.size,
          color: i.color,
          quantity: i.quantity,
        })),
        shipping: form,
        paymentMethod,
      });
      clearCart();
      navigate("/payment", { state: { form, paymentMethod, order } });
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

    // ── Page header ───────────────────────────────────────────────────────
    pageHead: {
      padding: `48px ${theme.pad}px 32px`,
      borderBottom: `1px solid ${theme.hairline}`,
    },
    pageTitle: { ...display, margin: "8px 0 0", fontSize: isDesktop ? 40 : 30 },

    // ── Layout ────────────────────────────────────────────────────────────
    layout: {
      display: "grid",
      gridTemplateColumns: isDesktop ? "1fr 380px" : "1fr",
      gap: 32,
      maxWidth: 1080,
      margin: "0 auto",
      padding: `40px ${theme.pad}px 0`,
      alignItems: "start",
    },

    // ── Form card ─────────────────────────────────────────────────────────
    card: {
      background: theme.ink2,
      border: `1px solid ${theme.hairline}`,
      borderRadius: theme.radius,
      padding: isDesktop ? 36 : 24,
    },
    cardTitle: {
      margin: "0 0 24px",
      fontSize: 11,
      fontWeight: 500,
      letterSpacing: "0.26em",
      textTransform: "uppercase",
      color: theme.bronze,
    },

    // ── Field ─────────────────────────────────────────────────────────────
    fieldGroup: { display: "flex", flexDirection: "column", gap: 16 },
    row: {
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      gap: 12,
    },
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
      border: `1px solid ${hasError ? "#c0524a" : "rgba(255,255,255,0.1)"}`,
      borderRadius: 8,
      color: "#fff",
      fontSize: 14,
      fontFamily: theme.fontBody,
      outline: "none",
      transition: "border-color 0.18s",
    }),
    fieldError: {
      fontSize: 11,
      color: "#c0524a",
      letterSpacing: "0.06em",
    },

    divider: {
      margin: "28px 0",
      height: 1,
      background: theme.hairline,
    },

    // ── Payment method pills ───────────────────────────────────────────────
    methodList: { display: "flex", flexDirection: "column", gap: 10 },
    methodPill: (active) => ({
      display: "flex",
      alignItems: "center",
      gap: 14,
      padding: "14px 16px",
      border: `1px solid ${active ? theme.bronze : "rgba(255,255,255,0.1)"}`,
      borderRadius: 10,
      background: active ? "rgba(192,142,90,0.10)" : "transparent",
      cursor: "pointer",
      transition: "border-color 0.18s, background 0.18s",
    }),
    methodIcon: { fontSize: 20, lineHeight: 1 },
    methodInfo: { flex: 1 },
    methodTitle: {
      fontSize: 14,
      color: "#fff",
      fontFamily: theme.fontBody,
    },
    methodNote: {
      fontSize: 11,
      color: theme.muted,
      marginTop: 2,
    },
    methodRadio: (active) => ({
      width: 16,
      height: 16,
      borderRadius: "50%",
      border: `2px solid ${active ? theme.bronze : "rgba(255,255,255,0.25)"}`,
      background: active ? theme.bronze : "transparent",
      flexShrink: 0,
      transition: "background 0.18s, border-color 0.18s",
    }),

    // ── Order summary (desktop sidebar) ───────────────────────────────────
    summary: {
      background: theme.ink2,
      border: `1px solid ${theme.hairline}`,
      borderRadius: theme.radius,
      padding: isDesktop ? 28 : 24,
      position: isDesktop ? "sticky" : "static",
      top: theme.barH + 20,
    },
    summaryTitle: {
      margin: "0 0 20px",
      fontSize: 11,
      fontWeight: 500,
      letterSpacing: "0.26em",
      textTransform: "uppercase",
      color: theme.bronze,
    },
    summaryRow: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 12,
      fontSize: 13,
      color: theme.silver,
    },
    summaryTotal: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      paddingTop: 16,
      marginTop: 8,
      borderTop: `1px solid ${theme.hairline}`,
      fontSize: 15,
      color: "#fff",
      fontFamily: theme.fontDisplay,
    },
    totalAmount: { ...metalText, fontSize: 18 },

    submitBtn: {
      ...btnSolid,
      width: "100%",
      marginTop: 20,
      padding: "14px 0",
      fontSize: 13,
      letterSpacing: "0.14em",
      justifyContent: "center",
      opacity: submitting ? 0.6 : 1,
      cursor: submitting ? "default" : "pointer",
    },

    formError: {
      padding: "12px 14px",
      marginBottom: 20,
      background: "rgba(192,82,74,0.1)",
      border: "1px solid rgba(192,82,74,0.35)",
      borderRadius: 8,
      color: "#e0847c",
      fontSize: 13,
    },

    empty: {
      padding: `80px ${theme.pad}px`,
      textAlign: "center",
    },
    emptyTitle: { ...display, fontSize: 26, margin: "0 0 12px" },
    emptyText: { fontSize: 14, color: theme.silver, margin: "0 0 28px" },

    backLink: {
      ...btnGhost,
      display: "inline-flex",
      marginTop: 14,
      width: "100%",
      justifyContent: "center",
      fontSize: 12,
    },

    // ── Footer ────────────────────────────────────────────────────────────
    footer: {
      padding: `44px ${theme.pad}px 32px`,
      borderTop: `1px solid ${theme.hairline}`,
      background: theme.ink2,
      marginTop: 80,
    },
    footBrand: { display: "flex", flexDirection: "column", gap: 6, marginBottom: 34 },
    footMt: { ...metalText, fontFamily: theme.fontDisplay, fontSize: 26, fontWeight: 600, lineHeight: 1 },
    footCols: { display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 28, marginBottom: 32 },
    footCol: { display: "flex", flexDirection: "column", gap: 9 },
    footHead: {
      margin: "0 0 4px", fontSize: 10, fontWeight: 500,
      letterSpacing: "0.28em", textTransform: "uppercase", color: theme.bronze,
    },
    footLink: { fontSize: 13, color: theme.silver },
    footContact: {
      display: "flex", flexDirection: "column", gap: 6,
      paddingTop: 24, borderTop: "1px solid rgba(255, 255, 255, 0.06)",
    },
    footText: { margin: 0, fontSize: 13, color: theme.silver },
    legal: { margin: "28px 0 0", fontSize: 10, letterSpacing: "0.18em", textTransform: "uppercase", color: theme.muted },
  };

  if (items.length === 0) {
    return (
      <main style={s.page}>
        <div style={s.pageHead}>
          <span style={label}>Almost there</span>
          <h1 style={s.pageTitle}>Checkout</h1>
        </div>
        <PulseDivider />
        <div style={s.empty}>
          <h2 style={s.emptyTitle}>Your cart is empty</h2>
          <p style={s.emptyText}>Add some scrubs before checking out.</p>
          <a href="/men" style={{ ...btnSolid, paddingInline: 32 }}>Shop men</a>
          {"  "}
          <a href="/women" style={{ ...btnGhost, paddingInline: 32, marginLeft: 10 }}>Shop women</a>
        </div>
      </main>
    );
  }

  return (
    <main style={s.page}>
      {/* Page header */}
      <div style={s.pageHead}>
        <span style={label}>Almost there</span>
        <h1 style={s.pageTitle}>Checkout</h1>
      </div>

      <PulseDivider />

      <form onSubmit={handleSubmit} noValidate>
        <div style={s.layout}>

          {/* ── Left: form ── */}
          <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>

            {errors.form && <p style={s.formError}>{errors.form}</p>}

            {/* Contact */}
            <div style={s.card}>
              <p style={s.cardTitle}>Contact information</p>
              <div style={s.fieldGroup}>
                <div style={s.field}>
                  <label style={s.fieldLabel}>Full name</label>
                  <input
                    style={s.input(!!errors.name)}
                    value={form.name}
                    onChange={(e) => update("name", e.target.value)}
                    placeholder="Rasha ElHady"
                  />
                  {errors.name && <span style={s.fieldError}>{errors.name}</span>}
                </div>

                <div style={s.row}>
                  <div style={s.field}>
                    <label style={s.fieldLabel}>Phone</label>
                    <input
                      style={s.input(!!errors.phone)}
                      value={form.phone}
                      onChange={(e) => update("phone", e.target.value)}
                      placeholder="01xxxxxxxxx"
                      type="tel"
                    />
                    {errors.phone && <span style={s.fieldError}>{errors.phone}</span>}
                  </div>
                  <div style={s.field}>
                    <label style={s.fieldLabel}>Email</label>
                    <input
                      style={s.input(!!errors.email)}
                      value={form.email}
                      onChange={(e) => update("email", e.target.value)}
                      placeholder="you@email.com"
                      type="email"
                    />
                    {errors.email && <span style={s.fieldError}>{errors.email}</span>}
                  </div>
                </div>
              </div>
            </div>

            {/* Delivery address */}
            <div style={s.card}>
              <p style={s.cardTitle}>Delivery address</p>
              <div style={s.fieldGroup}>
                <div style={s.field}>
                  <label style={s.fieldLabel}>Street address</label>
                  <input
                    style={s.input(!!errors.street)}
                    value={form.street}
                    onChange={(e) => update("street", e.target.value)}
                    placeholder="Building, street name"
                  />
                  {errors.street && <span style={s.fieldError}>{errors.street}</span>}
                </div>

                <div style={s.row}>
                  <div style={s.field}>
                    <label style={s.fieldLabel}>City / Area</label>
                    <input
                      style={s.input(!!errors.city)}
                      value={form.city}
                      onChange={(e) => update("city", e.target.value)}
                      placeholder="New Cairo"
                    />
                    {errors.city && <span style={s.fieldError}>{errors.city}</span>}
                  </div>
                  <div style={s.field}>
                    <label style={s.fieldLabel}>Governorate</label>
                    <input
                      style={s.input(!!errors.governorate)}
                      value={form.governorate}
                      onChange={(e) => update("governorate", e.target.value)}
                      placeholder="Cairo"
                    />
                    {errors.governorate && <span style={s.fieldError}>{errors.governorate}</span>}
                  </div>
                </div>
              </div>
            </div>

            {/* Payment method */}
            <div style={s.card}>
              <p style={s.cardTitle}>Payment method</p>
              <div style={s.methodList}>
                {PAYMENT_METHODS.map((m) => (
                  <div
                    key={m.id}
                    style={s.methodPill(paymentMethod === m.id)}
                    onClick={() => setPaymentMethod(m.id)}
                    role="radio"
                    aria-checked={paymentMethod === m.id}
                    tabIndex={0}
                    onKeyDown={(e) => e.key === "Enter" && setPaymentMethod(m.id)}
                  >
                    <span style={s.methodIcon}>{m.icon}</span>
                    <span style={s.methodInfo}>
                      <span style={s.methodTitle}>{m.title}</span>
                      <span style={{ display: "block", ...s.methodNote }}>{m.note}</span>
                    </span>
                    <span style={s.methodRadio(paymentMethod === m.id)} />
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* ── Right: order summary ── */}
          <div style={s.summary}>
            <p style={s.summaryTitle}>Order summary</p>

            <div style={s.summaryRow}>
              <span>Subtotal ({totalItems} items)</span>
              <span>EGP {totalPrice.toLocaleString()}</span>
            </div>
            <div style={s.summaryRow}>
              <span>Shipping</span>
              <span>Calculated at checkout</span>
            </div>

            <div style={s.summaryTotal}>
              <span>Total</span>
              <span style={s.totalAmount}>EGP {totalPrice.toLocaleString()}</span>
            </div>

            <button type="submit" style={s.submitBtn} disabled={submitting}>
              {submitting ? "Placing order…" : "Place order"}
            </button>
            <a href="/men" style={s.backLink}>← Continue shopping</a>
          </div>

        </div>
      </form>

      {/* Footer */}
      <footer style={s.footer}>
        <div style={s.footBrand}>
          <span style={s.footMt}>MT</span>
          <span style={label}>Built for more</span>
        </div>
        <div style={s.footCols}>
          <div style={s.footCol}>
            <h3 style={s.footHead}>Shop</h3>
            <a href="/men" style={s.footLink}>Men</a>
            <a href="/women" style={s.footLink}>Women</a>
            <a href="#lab-coats" style={s.footLink}>Lab coats</a>
          </div>
          <div style={s.footCol}>
            <h3 style={s.footHead}>Help</h3>
            <a href="#sizing" style={s.footLink}>Size guide</a>
            <a href="#fabric" style={s.footLink}>Our fabric</a>
            <a href="#returns" style={s.footLink}>Returns</a>
          </div>
        </div>
        <div style={s.footContact}>
          <p style={s.footText}>New Cairo, Cairo</p>
          <a href="mailto:hello@medtrack.com" style={s.footLink}>hello@medtrack.com</a>
        </div>
        <p style={s.legal}>© 2026 MedTrack</p>
      </footer>
    </main>
  );
}