import { useState } from "react";
import { useNavigate } from "react-router-dom";
import PulseDivider from "../components/PulseDivider";
import useIsDesktop from "../hooks/useIsDesktop";
import { theme, label, display, btnSolid, btnGhost } from "../theme";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { createOrder } from "../services/orders";
import Footer from "../components/Footer";

const PAYMENT_METHODS = [
  { id: "cod", title: "Cash on Delivery", note: "Pay when your order arrives", icon: "💵" },
  { id: "instapay", title: "Instapay", note: "Transfer via Instapay", icon: "⚡" },
];

const GOVERNORATES = [
  "6th of October","Al Sharqia","Alexandria","Aswan","Asyut","Beheira","Beni Suef",
  "Cairo","Dakahlia","Damietta","Faiyum","Gharbia","Giza","Helwan","Ismailia",
  "Kafr el-Sheikh","Luxor","Matrouh","Minya","Monufia","New Valley","North Sinai",
  "Port Said","Qalyubia","Qena","Red Sea","Sohag","South Sinai","Suez",
];

const LOW_SHIPPING = ["Cairo", "Giza"];
const HIGH_SHIPPING = ["Aswan", "Luxor", "North Sinai", "South Sinai"];
const MID_SHIPPING = ["Faiyum", "Beni Suef", "Minya", "Asyut", "Sohag"];

function getShipping(gov) {
  if (!gov) return null;
  if (LOW_SHIPPING.includes(gov)) return 75;
  if (HIGH_SHIPPING.includes(gov)) return 145;
  if (MID_SHIPPING.includes(gov)) return 100;
  return 85;
}

export default function Checkout() {
  const isDesktop = useIsDesktop(700);
  const navigate = useNavigate();
  const { user } = useAuth();
  const { items, totalItems, totalPrice, clearCart } = useCart();

  const [form, setForm] = useState({
    name: user?.name ?? "", phone: "", email: user?.email ?? "",
    street: "", city: "", governorate: "",
  });
  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const shippingFee = getShipping(form.governorate);
  const grandTotal = shippingFee !== null ? totalPrice + shippingFee : totalPrice;

  const update = (field, value) => {
    setForm((f) => ({ ...f, [field]: value }));
    setErrors((e) => ({ ...e, [field]: undefined, form: undefined }));
  };

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = "Required";
    if (!form.phone.trim()) e.phone = "Required";
    else if (!/^\d{10,13}$/.test(form.phone.replace(/[\s\-\+]/g, ""))) e.phone = "Enter a valid Egyptian phone number";
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
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    setSubmitting(true);
    try {
      const order = await createOrder({
        items: items.map((i) => ({ product: i.id, size: i.size, color: i.color, quantity: i.quantity })),
        shipping: form, paymentMethod, shippingFee: shippingFee ?? 85,
      });
      clearCart();
      navigate("/payment", { state: { form, paymentMethod, order, shippingFee: shippingFee ?? 85 } });
    } catch (err) {
      setErrors({ form: err.message });
    } finally {
      setSubmitting(false);
    }
  };

  const s = {
    page: { minHeight: "100vh", background: theme.surfaceLight },
    pageHead: { padding: `48px ${theme.pad}px 32px`, borderBottom: `1px solid ${theme.hairlineOnLight}` },
    pageTitle: { ...display, margin: "8px 0 0", fontSize: isDesktop ? 40 : 30, color: theme.textOnLight },
    layout: {
      display: "grid", gridTemplateColumns: isDesktop ? "1fr 380px" : "1fr",
      gap: 24, maxWidth: 1080, margin: "0 auto", padding: `32px ${theme.pad}px 40px`, alignItems: "start",
    },
    card: {
      background: theme.surfaceLight, border: `1px solid ${theme.hairlineOnLight}`,
      borderRadius: theme.radius, boxShadow: "0 1px 3px rgba(34,37,42,0.06)", padding: isDesktop ? 36 : 20,
    },
    cardTitle: { margin: "0 0 24px", fontSize: 11, fontWeight: 500, letterSpacing: "0.26em", textTransform: "uppercase", color: theme.accent },
    fieldGroup: { display: "flex", flexDirection: "column", gap: 16 },
    row: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 },
    field: { display: "flex", flexDirection: "column", gap: 6 },
    fieldLabel: { fontSize: 10, letterSpacing: "0.2em", textTransform: "uppercase", color: theme.textOnLightMuted },
    input: (hasError) => ({
      padding: "11px 14px", background: theme.surfaceMuted,
      border: `1px solid ${hasError ? "#c0524a" : theme.lightGray}`,
      borderRadius: 8, color: theme.textOnLight, fontSize: 14,
      fontFamily: theme.fontBody, outline: "none", width: "100%", boxSizing: "border-box",
    }),
    select: (hasError) => ({
      padding: "11px 14px", background: theme.surfaceMuted,
      border: `1px solid ${hasError ? "#c0524a" : theme.lightGray}`,
      borderRadius: 8, color: theme.textOnLight, fontSize: 14,
      fontFamily: theme.fontBody, outline: "none", width: "100%", boxSizing: "border-box",
      cursor: "pointer", appearance: "none",
      backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%23888' stroke-width='1.5' fill='none' stroke-linecap='round'/%3E%3C/svg%3E")`,
      backgroundRepeat: "no-repeat", backgroundPosition: "right 14px center", paddingRight: 36,
    }),
    fieldError: { fontSize: 11, color: "#c0524a", letterSpacing: "0.06em" },
    methodList: { display: "flex", flexDirection: "column", gap: 10 },
    methodPill: (active) => ({
      display: "flex", alignItems: "center", gap: 14, padding: "14px 16px",
      border: `1px solid ${active ? theme.accent : theme.lightGray}`,
      borderRadius: 10, background: active ? "rgba(15,91,70,0.08)" : "transparent", cursor: "pointer",
    }),
    methodIcon: { fontSize: 20, lineHeight: 1 },
    methodInfo: { flex: 1 },
    methodTitle: { fontSize: 14, color: theme.textOnLight, fontFamily: theme.fontBody },
    methodNote: { fontSize: 11, color: theme.textOnLightMuted, marginTop: 2 },
    methodRadio: (active) => ({
      width: 16, height: 16, borderRadius: "50%",
      border: `2px solid ${active ? theme.accent : theme.lightGray}`,
      background: active ? theme.accent : "transparent", flexShrink: 0,
    }),
    summary: {
      background: theme.surfaceLight, border: `1px solid ${theme.hairlineOnLight}`,
      borderRadius: theme.radius, boxShadow: "0 1px 3px rgba(34,37,42,0.06)",
      padding: isDesktop ? 28 : 20, position: isDesktop ? "sticky" : "static", top: theme.barH + 20,
    },
    summaryTitle: { margin: "0 0 20px", fontSize: 11, fontWeight: 500, letterSpacing: "0.26em", textTransform: "uppercase", color: theme.accent },
    summaryRow: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12, fontSize: 13, color: theme.textOnLightMuted },
    summaryTotal: {
      display: "flex", justifyContent: "space-between", alignItems: "center",
      paddingTop: 16, marginTop: 8, borderTop: `1px solid ${theme.hairlineOnLight}`,
      fontSize: 15, color: theme.textOnLight, fontFamily: theme.fontDisplay,
    },
    totalAmount: { color: theme.accent, fontWeight: 700, fontSize: 18 },
    submitBtn: {
      ...btnSolid, width: "100%", marginTop: 20, padding: "14px 0",
      fontSize: 13, letterSpacing: "0.14em", justifyContent: "center",
      opacity: submitting ? 0.6 : 1, cursor: submitting ? "default" : "pointer",
    },
    formError: {
      padding: "12px 14px", marginBottom: 20,
      background: "rgba(192,82,74,0.1)", border: "1px solid rgba(192,82,74,0.35)",
      borderRadius: 8, color: "#a23b34", fontSize: 13,
    },
    empty: { padding: `80px ${theme.pad}px`, textAlign: "center" },
    emptyTitle: { ...display, fontSize: 26, margin: "0 0 12px", color: theme.textOnLight },
    emptyText: { fontSize: 14, color: theme.textOnLightMuted, margin: "0 0 28px" },
    backLink: { ...btnGhost("light"), display: "inline-flex", marginTop: 14, width: "100%", justifyContent: "center", fontSize: 12 },
  };

  const OrderSummary = () => (
    <div style={s.summary}>
      <p style={s.summaryTitle}>Order summary</p>
      <div style={s.summaryRow}>
        <span>Subtotal ({totalItems} items)</span>
        <span>EGP {totalPrice.toLocaleString()}</span>
      </div>
      <div style={s.summaryRow}>
        <span>Shipping</span>
        <span>{shippingFee !== null ? `EGP ${shippingFee}` : "Select governorate"}</span>
      </div>
      <div style={s.summaryTotal}>
        <span>Total</span>
        <span style={s.totalAmount}>EGP {grandTotal.toLocaleString()}</span>
      </div>
      {isDesktop && (
        <>
          <button type="submit" style={s.submitBtn} disabled={submitting}>
            {submitting ? "Placing order…" : "Place order"}
          </button>
          <a href="/men" style={s.backLink}>← Continue shopping</a>
        </>
      )}
    </div>
  );

  if (items.length === 0) {
    return (
      <main style={s.page}>
        <div style={s.pageHead}>
          <span style={label("light")}>Almost there</span>
          <h1 style={s.pageTitle}>Checkout</h1>
        </div>
        <PulseDivider />
        <div style={s.empty}>
          <h2 style={s.emptyTitle}>Your cart is empty</h2>
          <p style={s.emptyText}>Add some scrubs before checking out.</p>
          <a href="/men" style={{ ...btnSolid, paddingInline: 32 }}>Shop men</a>
          {"  "}
          <a href="/women" style={{ ...btnGhost("light"), paddingInline: 32, marginLeft: 10 }}>Shop women</a>
        </div>
        <Footer />
      </main>
    );
  }

  return (
    <main style={s.page}>
      <div style={s.pageHead}>
        <span style={label("light")}>Almost there</span>
        <h1 style={s.pageTitle}>Checkout</h1>
      </div>
      <PulseDivider />
      <form onSubmit={handleSubmit} noValidate>
        <div style={s.layout}>
          {!isDesktop && <OrderSummary />}
          <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
            {errors.form && <p style={s.formError}>{errors.form}</p>}
            <div style={s.card}>
              <p style={s.cardTitle}>Contact information</p>
              <div style={s.fieldGroup}>
                <div style={s.field}>
                  <label style={s.fieldLabel}>Full name</label>
                  <input style={s.input(!!errors.name)} value={form.name} onChange={(e) => update("name", e.target.value)} placeholder="Name" />
                  {errors.name && <span style={s.fieldError}>{errors.name}</span>}
                </div>
                <div style={s.row}>
                  <div style={s.field}>
                    <label style={s.fieldLabel}>Phone</label>
                    <input style={s.input(!!errors.phone)} value={form.phone} onChange={(e) => update("phone", e.target.value)} placeholder="01xxxxxxxxx" type="tel" />
                    {errors.phone && <span style={s.fieldError}>{errors.phone}</span>}
                  </div>
                  <div style={s.field}>
                    <label style={s.fieldLabel}>Email</label>
                    <input style={s.input(!!errors.email)} value={form.email} onChange={(e) => update("email", e.target.value)} placeholder="you@email.com" type="email" />
                    {errors.email && <span style={s.fieldError}>{errors.email}</span>}
                  </div>
                </div>
              </div>
            </div>
            <div style={s.card}>
              <p style={s.cardTitle}>Delivery address</p>
              <div style={s.fieldGroup}>
                <div style={s.field}>
                  <label style={s.fieldLabel}>Street address</label>
                  <input style={s.input(!!errors.street)} value={form.street} onChange={(e) => update("street", e.target.value)} placeholder="Building, street name" />
                  {errors.street && <span style={s.fieldError}>{errors.street}</span>}
                </div>
                <div style={s.row}>
                  <div style={s.field}>
                    <label style={s.fieldLabel}>City / Area</label>
                    <input style={s.input(!!errors.city)} value={form.city} onChange={(e) => update("city", e.target.value)} placeholder="New Cairo" />
                    {errors.city && <span style={s.fieldError}>{errors.city}</span>}
                  </div>
                  <div style={s.field}>
                    <label style={s.fieldLabel}>Governorate</label>
                    <select style={s.select(!!errors.governorate)} value={form.governorate} onChange={(e) => update("governorate", e.target.value)}>
                      <option value="">Select governorate…</option>
                      {GOVERNORATES.map((g) => <option key={g} value={g}>{g}</option>)}
                    </select>
                    {errors.governorate && <span style={s.fieldError}>{errors.governorate}</span>}
                  </div>
                </div>
              </div>
            </div>
            <div style={s.card}>
              <p style={s.cardTitle}>Payment method</p>
              <div style={s.methodList}>
                {PAYMENT_METHODS.map((m) => (
                  <div key={m.id} style={s.methodPill(paymentMethod === m.id)} onClick={() => setPaymentMethod(m.id)}
                    role="radio" aria-checked={paymentMethod === m.id} tabIndex={0}
                    onKeyDown={(e) => e.key === "Enter" && setPaymentMethod(m.id)}>
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
            {!isDesktop && (
              <button type="submit" style={s.submitBtn} disabled={submitting}>
                {submitting ? "Placing order…" : "Place order"}
              </button>
            )}
          </div>
          {isDesktop && <OrderSummary />}
        </div>
      </form>
      <Footer />
    </main>
  );
}