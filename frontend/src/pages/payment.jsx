import { useLocation, useNavigate } from "react-router-dom";
import PulseDivider from "../components/PulseDivider";
import useIsDesktop from "../hooks/useIsDesktop";
import { theme, label, display, btnSolid, btnGhost, strongText } from "../theme";

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
  vodafone: {
    icon: "📱",
    title: "Vodafone Cash",
    instruction: "Complete your payment by sending the total amount to our Vodafone Cash number below.",
    steps: [
      "Open the Vodafone Cash app or dial *9#.",
      'Select "Send Money" and enter the number below.',
      "Send the exact total amount and use your name as the reference.",
      "Send a screenshot of the transfer to hello@medtrack.com to confirm.",
    ],
    accountLabel: "Vodafone Cash number",
    accountNumber: "010 XXXX XXXX", // ← replace with your real number
  },
  instapay: {
    icon: "⚡",
    title: "Instapay",
    instruction: "Complete your payment via Instapay using the details below.",
    steps: [
      "Open your bank app and go to Instapay.",
      "Enter our Instapay username or phone number below.",
      "Transfer the exact total amount.",
      "Send a screenshot of the transfer to hello@medtrack.com to confirm.",
    ],
    accountLabel: "Instapay username",
    accountNumber: "medtrack@instapay", // ← replace with your real username
  },
};

export default function Payment() {
  const isDesktop = useIsDesktop(700);
  const location = useLocation();
  const navigate = useNavigate();

  // Data passed from checkout page
  const { form, paymentMethod } = location.state ?? {};

  // If someone lands here directly without checkout data, redirect
  if (!form || !paymentMethod) {
    return (
      <main style={{ minHeight: "100vh", background: theme.ink, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 20 }}>
        <p style={{ color: theme.lightGray, fontSize: 14 }}>No order found.</p>
        <a href="/checkout" style={{ ...btnSolid, paddingInline: 28 }}>Go to checkout</a>
      </main>
    );
  }

  const method = METHOD_DETAILS[paymentMethod];

  const s = {
    page: { minHeight: "100vh", background: theme.ink, paddingBottom: 80 },

    // ── Page header ───────────────────────────────────────────────────────
    pageHead: {
      padding: `48px ${theme.pad}px 32px`,
      borderBottom: `1px solid ${theme.hairline}`,
    },
    pageTitle: { ...display, margin: "8px 0 0", fontSize: isDesktop ? 40 : 30 },

    // ── Layout ────────────────────────────────────────────────────────────
    layout: {
      display: "grid",
      gridTemplateColumns: isDesktop ? "1fr 360px" : "1fr",
      gap: 28,
      maxWidth: 1080,
      margin: "0 auto",
      padding: `40px ${theme.pad}px 0`,
      alignItems: "start",
    },

    // ── Card ──────────────────────────────────────────────────────────────
    card: {
      background: theme.ink2,
      border: `1px solid ${theme.hairline}`,
      borderRadius: theme.radius,
      padding: isDesktop ? 36 : 24,
      marginBottom: 20,
    },
    cardTitle: {
      margin: "0 0 20px",
      fontSize: 11,
      fontWeight: 500,
      letterSpacing: "0.26em",
      textTransform: "uppercase",
      color: theme.lightGray,
    },

    // ── Success banner ────────────────────────────────────────────────────
    successBanner: {
      display: "flex",
      alignItems: "center",
      gap: 14,
      padding: "18px 20px",
      background: "rgba(15,91,70,0.20)",
      border: `1px solid rgba(15,91,70,0.45)`,
      borderRadius: 10,
      marginBottom: 20,
    },
    successIcon: { fontSize: 26 },
    successText: { fontSize: 14, color: "#fff", lineHeight: 1.5 },
    successSub: { fontSize: 12, color: theme.lightGray, marginTop: 3 },

    // ── Payment instruction ───────────────────────────────────────────────
    methodHeader: {
      display: "flex",
      alignItems: "center",
      gap: 12,
      marginBottom: 16,
    },
    methodIcon: { fontSize: 28 },
    methodTitle: { ...display, fontSize: 20, margin: 0 },
    instruction: { fontSize: 14, color: theme.lightGray, lineHeight: 1.7, marginBottom: 24 },

    // Account number highlight
    accountBox: {
      padding: "14px 18px",
      background: "rgba(15,91,70,0.16)",
      border: `1px solid rgba(15,91,70,0.40)`,
      borderRadius: 8,
      marginBottom: 24,
    },
    accountLabel: { fontSize: 10, letterSpacing: "0.22em", textTransform: "uppercase", color: theme.lightGray, marginBottom: 6 },
    accountNumber: { ...strongText, fontFamily: theme.fontDisplay, fontSize: 22 },

    // Steps
    stepList: { display: "flex", flexDirection: "column", gap: 12 },
    step: { display: "flex", gap: 12, alignItems: "flex-start" },
    stepNum: {
      flexShrink: 0,
      width: 24,
      height: 24,
      borderRadius: "50%",
      border: `1px solid ${theme.forest}`,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontSize: 11,
      color: theme.white,
      marginTop: 1,
    },
    stepText: { fontSize: 13, color: theme.lightGray, lineHeight: 1.6 },

    // ── Order details sidebar ─────────────────────────────────────────────
    sidebar: {
      display: "flex",
      flexDirection: "column",
      gap: 20,
      position: isDesktop ? "sticky" : "static",
      top: theme.barH + 20,
    },
    sideCard: {
      background: theme.ink2,
      border: `1px solid ${theme.hairline}`,
      borderRadius: theme.radius,
      padding: 24,
    },
    sideTitle: {
      margin: "0 0 16px",
      fontSize: 11,
      fontWeight: 500,
      letterSpacing: "0.26em",
      textTransform: "uppercase",
      color: theme.lightGray,
    },
    detailRow: {
      display: "flex",
      justifyContent: "space-between",
      marginBottom: 10,
      fontSize: 13,
    },
    detailKey: { color: theme.muted },
    detailVal: { color: "#fff", textAlign: "right", maxWidth: "60%" },

    // ── Actions ───────────────────────────────────────────────────────────
    actions: { display: "flex", flexDirection: "column", gap: 10, marginTop: 4 },
    continueBtn: { ...btnSolid, justifyContent: "center", padding: "13px 0" },
    backBtn: { ...btnGhost, justifyContent: "center", padding: "13px 0", fontSize: 12 },

    // ── Footer ────────────────────────────────────────────────────────────
    footer: {
      padding: `44px ${theme.pad}px 32px`,
      background: theme.white,
      marginTop: 80,
    },
    footBrand: { display: "flex", flexDirection: "column", gap: 6, marginBottom: 34 },
    // TODO: swap for the real MT/ECG logo asset once provided — text treatment is a placeholder
    footMt: { fontFamily: theme.fontDisplay, fontSize: 26, fontWeight: 700, lineHeight: 1, color: theme.forest },
    footTagline: {
      fontSize: 10, fontWeight: 500, letterSpacing: "0.32em",
      textTransform: "uppercase", color: "rgba(11, 31, 24, 0.55)",
    },
    footCols: { display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 28, marginBottom: 32 },
    footCol: { display: "flex", flexDirection: "column", gap: 9 },
    footHead: {
      margin: "0 0 4px", fontSize: 10, fontWeight: 500,
      letterSpacing: "0.28em", textTransform: "uppercase", color: theme.forest,
    },
    footLink: { fontSize: 13, color: theme.ink2 },
    footContact: {
      display: "flex", flexDirection: "column", gap: 6,
      paddingTop: 24, borderTop: "1px solid rgba(11, 31, 24, 0.1)",
    },
    footText: { margin: 0, fontSize: 13, color: theme.ink2 },
    legal: { margin: "28px 0 0", fontSize: 10, letterSpacing: "0.18em", textTransform: "uppercase", color: "rgba(11, 31, 24, 0.5)" },
  };

  return (
    <main style={s.page}>
      {/* Page header */}
      <div style={s.pageHead}>
        <span style={label}>Order received</span>
        <h1 style={s.pageTitle}>Payment details</h1>
      </div>

      <PulseDivider />

      <div style={s.layout}>

        {/* ── Left: payment instructions ── */}
        <div>
          {/* Success banner */}
          <div style={s.successBanner}>
            <span style={s.successIcon}>✓</span>
            <div>
              <p style={{ ...s.successText, margin: 0 }}>Your order has been placed successfully.</p>
              <p style={{ ...s.successSub, margin: 0 }}>
                A confirmation will be sent to <strong>{form.email}</strong>
              </p>
            </div>
          </div>

          {/* Payment method card */}
          <div style={s.card}>
            <div style={s.methodHeader}>
              <span style={s.methodIcon}>{method.icon}</span>
              <h2 style={s.methodTitle}>{method.title}</h2>
            </div>

            <p style={s.instruction}>{method.instruction}</p>

            {/* Account number (for Vodafone / Instapay) */}
            {method.accountNumber && (
              <div style={s.accountBox}>
                <p style={{ ...s.accountLabel, margin: "0 0 6px" }}>{method.accountLabel}</p>
                <p style={{ ...s.accountNumber, margin: 0 }}>{method.accountNumber}</p>
              </div>
            )}

            {/* Steps */}
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

        {/* ── Right: order summary sidebar ── */}
        <div style={s.sidebar}>
          {/* Delivery details */}
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

          {/* Actions */}
          <div style={s.sideCard}>
            <p style={s.sideTitle}>What&rsquo;s next?</p>
            <div style={s.actions}>
              <a href="/" style={s.continueBtn}>Back to home</a>
              <a href="/men" style={s.backBtn}>Continue shopping</a>
            </div>
          </div>
        </div>

      </div>

      {/* Footer */}
      <footer style={s.footer}>
        <div style={s.footBrand}>
          <span style={s.footMt}>MT</span>
          <span style={s.footTagline}>Medical Wear</span>
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