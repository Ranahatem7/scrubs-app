import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import PulseDivider from "../components/PulseDivider";
import useIsDesktop from "../hooks/useIsDesktop";
import { theme, label, display, btnSolid, btnGhost } from "../theme";
import Footer from "../components/Footer";

const METHOD_DETAILS = {
  cod: {
    icon: "💵",
    title: "Cash on Delivery",
    instruction: "Your order is confirmed. Pay the courier when your scrubs arrive at your door.",
    steps: [
      "We'll call you within 24 hours to confirm your order.",
      "Your order will be packed and dispatched within 2–3 business days.",
      "Hand the cash to the courier upon delivery.",
    ],
  },
};

export default function Payment() {
  const isDesktop = useIsDesktop(700);
  const location = useLocation();
  const navigate = useNavigate();

  const { form, paymentMethod, order, shippingFee, discountAmount } = location.state ?? {};

  // Fire Facebook Pixel Purchase event
  useEffect(() => {
    if (!order || typeof window.fbq !== "function") return;
    const value = order.total ?? (order.subtotal - (discountAmount ?? 0) + (shippingFee ?? 0));
    window.fbq("track", "Purchase", {
      value: value,
      currency: "EGP",
      content_type: "product",
      content_ids: order.items?.map((i) => i.product?.toString() ?? i.name) ?? [],
    });
  }, []);

  if (!form || !paymentMethod) {
    return (
      <main style={{ minHeight: "100vh", background: theme.surfaceLight, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 20 }}>
        <p style={{ color: theme.textOnLightMuted, fontSize: 14 }}>No order found.</p>
        <a href="/checkout" style={{ ...btnSolid, paddingInline: 28 }}>Go to checkout</a>
      </main>
    );
  }

  const method = METHOD_DETAILS[paymentMethod];

  const s = {
    page: { minHeight: "100vh", background: theme.surfaceLight, paddingBottom: 80 },
    pageHead: {
      padding: `48px ${theme.pad}px 32px`,
      borderBottom: `1px solid ${theme.hairlineOnLight}`,
    },
    pageTitle: { ...display, margin: "8px 0 0", fontSize: isDesktop ? 40 : 30, color: theme.textOnLight },
    layout: {
      display: "grid",
      gridTemplateColumns: isDesktop ? "1fr 360px" : "1fr",
      gap: 28,
      maxWidth: 1080,
      margin: "0 auto",
      padding: `40px ${theme.pad}px 0`,
      alignItems: "start",
    },
    card: {
      background: theme.surfaceLight,
      border: `1px solid ${theme.hairlineOnLight}`,
      borderRadius: theme.radius,
      boxShadow: "0 1px 3px rgba(34, 37, 42, 0.06)",
      padding: isDesktop ? 36 : 24,
      marginBottom: 20,
    },
    cardTitle: {
      margin: "0 0 20px",
      fontSize: 11,
      fontWeight: 500,
      letterSpacing: "0.26em",
      textTransform: "uppercase",
      color: theme.accent,
    },
    successBanner: {
      display: "flex",
      alignItems: "center",
      gap: 14,
      padding: "18px 20px",
      background: "rgba(15,91,70,0.10)",
      border: `1px solid rgba(15,91,70,0.35)`,
      borderRadius: 10,
      marginBottom: 20,
    },
    successIcon: { fontSize: 26 },
    successText: { fontSize: 14, color: theme.textOnLight, lineHeight: 1.5 },
    successSub: { fontSize: 12, color: theme.textOnLightMuted, marginTop: 3 },
    methodHeader: {
      display: "flex",
      alignItems: "center",
      gap: 12,
      marginBottom: 16,
    },
    methodIcon: { fontSize: 28 },
    methodTitle: { ...display, fontSize: 20, margin: 0, color: theme.textOnLight },
    instruction: { fontSize: 14, color: theme.textOnLightMuted, lineHeight: 1.7, marginBottom: 24 },
    accountBox: {
      padding: "14px 18px",
      background: "rgba(15,91,70,0.08)",
      border: `1px solid rgba(15,91,70,0.30)`,
      borderRadius: 8,
      marginBottom: 24,
    },
    accountLabel: { fontSize: 10, letterSpacing: "0.22em", textTransform: "uppercase", color: theme.textOnLightMuted, marginBottom: 6 },
    accountNumber: { color: theme.accent, fontWeight: 700, fontFamily: theme.fontDisplay, fontSize: 22 },
    stepList: { display: "flex", flexDirection: "column", gap: 12 },
    step: { display: "flex", gap: 12, alignItems: "flex-start" },
    stepNum: {
      flexShrink: 0, width: 24, height: 24, borderRadius: "50%",
      background: theme.accent, display: "flex", alignItems: "center",
      justifyContent: "center", fontSize: 11, color: theme.textOnDark, marginTop: 1,
    },
    stepText: { fontSize: 13, color: theme.textOnLightMuted, lineHeight: 1.6 },
    sidebar: {
      display: "flex", flexDirection: "column", gap: 20,
      position: isDesktop ? "sticky" : "static", top: theme.barH + 20,
    },
    sideCard: {
      background: theme.surfaceLight,
      border: `1px solid ${theme.hairlineOnLight}`,
      borderRadius: theme.radius,
      boxShadow: "0 1px 3px rgba(34, 37, 42, 0.06)",
      padding: 24,
    },
    sideTitle: {
      margin: "0 0 16px", fontSize: 11, fontWeight: 500,
      letterSpacing: "0.26em", textTransform: "uppercase", color: theme.accent,
    },
    detailRow: { display: "flex", justifyContent: "space-between", marginBottom: 10, fontSize: 13 },
    detailKey: { color: theme.textOnLightMuted },
    detailVal: { color: theme.textOnLight, textAlign: "right", maxWidth: "60%" },
    actions: { display: "flex", flexDirection: "column", gap: 10, marginTop: 4 },
    continueBtn: { ...btnSolid, justifyContent: "center", padding: "13px 0" },
    backBtn: { ...btnGhost("light"), justifyContent: "center", padding: "13px 0", fontSize: 12 },
  };

  return (
    <main style={s.page}>
      <div style={s.pageHead}>
        <span style={label("light")}>Order received</span>
        <h1 style={s.pageTitle}>Payment details</h1>
      </div>

      <PulseDivider />

      <div style={s.layout}>
        <div>
          <div style={s.successBanner}>
            <span style={s.successIcon}>✓</span>
            <div>
              <p style={{ ...s.successText, margin: 0 }}>Your order has been placed successfully.</p>
              <p style={{ ...s.successSub, margin: 0 }}>
                A confirmation will be sent to <strong>{form.email}</strong>
              </p>
            </div>
          </div>

          <div style={s.card}>
            <div style={s.methodHeader}>
              <span style={s.methodIcon}>{method.icon}</span>
              <h2 style={s.methodTitle}>{method.title}</h2>
            </div>

            <p style={s.instruction}>{method.instruction}</p>

            {method.accountNumber && (
              <div style={s.accountBox}>
                <p style={{ ...s.accountLabel, margin: "0 0 6px" }}>{method.accountLabel}</p>
                <p style={{ ...s.accountNumber, margin: 0 }}>{method.accountNumber}</p>
              </div>
            )}

            <div style={s.stepList}>
              {method.steps.map((step, i) => (
                <div key={i} style={s.step}>
                  <span style={s.stepNum}>{i + 1}</span>
                  <span style={s.stepText}>{step}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div style={s.sidebar}>
          <div style={s.sideCard}>
            <p style={s.sideTitle}>Delivery details</p>
            <div style={s.detailRow}>
              <span style={s.detailKey}>Name</span>
              <span style={s.detailVal}>{form.name}</span>
            </div>
            <div style={s.detailRow}>
              <span style={s.detailKey}>Phone</span>
              <span style={s.detailVal}>{form.phone}</span>
            </div>
            <div style={s.detailRow}>
              <span style={s.detailKey}>Email</span>
              <span style={s.detailVal}>{form.email}</span>
            </div>
            <div style={s.detailRow}>
              <span style={s.detailKey}>Address</span>
              <span style={s.detailVal}>
                {form.street}, {form.city}, {form.governorate}
              </span>
            </div>
          </div>

          <div style={s.sideCard}>
            <p style={s.sideTitle}>What&rsquo;s next?</p>
            <div style={s.actions}>
              <a href="/" style={s.continueBtn}>Back to home</a>
              <a href="/men" style={s.backBtn}>Continue shopping</a>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}