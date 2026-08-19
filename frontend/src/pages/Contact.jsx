import { useState } from "react";
import useIsDesktop from "../hooks/useIsDesktop";
import Footer from "../components/Footer";
import { theme, label, display, btnSolid } from "../theme";

export default function Contact() {
  const isDesktop = useIsDesktop(700);
  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "" });
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);

  const upd = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSending(true);
    await new Promise((r) => setTimeout(r, 800));
    setSent(true);
    setSending(false);
  };

  const s = {
    page: { background: theme.surfaceLight, minHeight: "70vh" },
    hero: {
      padding: isDesktop ? "64px 80px 48px" : "40px 20px 32px",
      borderBottom: `1px solid ${theme.hairlineOnLight}`,
    },
    heroTitle: { ...display, margin: "8px 0 12px", fontSize: isDesktop ? 48 : 34, color: theme.accent },
    heroSub: { fontSize: 14, color: theme.textOnLightMuted, maxWidth: "44ch", lineHeight: 1.7, margin: 0 },
    body: {
      display: "grid",
      gridTemplateColumns: isDesktop ? "1fr 1fr" : "1fr",
      gap: 0,
      maxWidth: 1100,
      margin: "0 auto",
      padding: isDesktop ? "56px 80px" : "32px 20px",
    },
    formWrap: { paddingRight: isDesktop ? 60 : 0, borderRight: isDesktop ? `1px solid ${theme.hairlineOnLight}` : "none" },
    formTitle: { fontSize: 10, letterSpacing: "0.22em", textTransform: "uppercase", color: theme.accent, marginBottom: 24 },
    field: { display: "flex", flexDirection: "column", gap: 6, marginBottom: 16 },
    fieldLabel: { fontSize: 10, letterSpacing: "0.18em", textTransform: "uppercase", color: theme.textOnLightMuted },
    input: {
      padding: "11px 14px", fontSize: 13,
      border: `1px solid ${theme.hairlineOnLight}`,
      borderRadius: theme.radius,
      background: theme.surfaceLight,
      color: theme.textOnLight,
      fontFamily: theme.fontBody,
      outline: "none",
    },
    textarea: {
      padding: "11px 14px", fontSize: 13,
      border: `1px solid ${theme.hairlineOnLight}`,
      borderRadius: theme.radius,
      background: theme.surfaceLight,
      color: theme.textOnLight,
      fontFamily: theme.fontBody,
      outline: "none",
      resize: "vertical",
      minHeight: 130,
    },
    submitBtn: { ...btnSolid, marginTop: 8, alignSelf: "flex-start" },
    successMsg: {
      marginTop: 20, padding: "14px 18px",
      background: "rgba(15,91,70,0.07)",
      border: `1px solid rgba(15,91,70,0.2)`,
      borderRadius: theme.radius,
      fontSize: 13, color: theme.accent,
    },
    infoWrap: { paddingLeft: isDesktop ? 60 : 0, marginTop: isDesktop ? 0 : 40 },
    infoTitle: { fontSize: 10, letterSpacing: "0.22em", textTransform: "uppercase", color: theme.accent, marginBottom: 24 },
    infoBlock: { marginBottom: 32 },
    infoHead: { fontSize: 11, fontWeight: 600, color: theme.textOnLight, letterSpacing: "0.08em", marginBottom: 8 },
    infoText: { fontSize: 13, color: theme.textOnLightMuted, lineHeight: 1.7, margin: 0 },
    infoLink: { fontSize: 13, color: theme.accent, display: "block", marginTop: 4 },
    social: { display: "flex", gap: 16, marginTop: 8 },
    socialLink: {
      fontSize: 10, letterSpacing: "0.18em", textTransform: "uppercase",
      color: theme.textOnLightMuted, textDecoration: "none",
      padding: "8px 14px",
      border: `1px solid ${theme.hairlineOnLight}`,
      borderRadius: theme.radius,
    },
  };

  return (
    <div style={s.page}>
      <div style={s.hero}>
        <span style={label("light")}>Get in touch</span>
        <h1 style={s.heroTitle}>Contact us</h1>
        <p style={s.heroSub}>Have a question about sizing, an order, or a bulk enquiry? We're here.</p>
      </div>

      <div style={s.body}>
        <div style={s.formWrap}>
          <p style={s.formTitle}>Send a message</p>
          {sent ? (
            <div style={s.successMsg}>Message sent — we'll get back to you within 24 hours.</div>
          ) : (
            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column" }}>
              <div style={s.field}>
                <label style={s.fieldLabel}>Name</label>
                <input style={s.input} required value={form.name} onChange={(e) => upd("name", e.target.value)} placeholder="Your name" />
              </div>
              <div style={s.field}>
                <label style={s.fieldLabel}>Email</label>
                <input style={s.input} type="email" required value={form.email} onChange={(e) => upd("email", e.target.value)} placeholder="your@email.com" />
              </div>
              <div style={s.field}>
                <label style={s.fieldLabel}>Phone (optional)</label>
                <input style={s.input} value={form.phone} onChange={(e) => upd("phone", e.target.value)} placeholder="+20 1XX XXX XXXX" />
              </div>
              <div style={s.field}>
                <label style={s.fieldLabel}>Message</label>
                <textarea style={s.textarea} required value={form.message} onChange={(e) => upd("message", e.target.value)} placeholder="How can we help?" />
              </div>
              <button type="submit" style={s.submitBtn} disabled={sending}>
                {sending ? "Sending…" : "Send message"}
              </button>
            </form>
          )}
        </div>

        <div style={s.infoWrap}>
          <p style={s.infoTitle}>Our details</p>
          <div style={s.infoBlock}>
            <p style={s.infoHead}>Address</p>
            <p style={s.infoText}>New Cairo, Cairo, Egypt</p>
          </div>
          <div style={s.infoBlock}>
            <p style={s.infoHead}>Email</p>
            <a href="mailto:hello@medtrack.com" style={s.infoLink}>hello@medtrack.com</a>
          </div>
          <div style={s.infoBlock}>
            <p style={s.infoHead}>Hours</p>
            <p style={s.infoText}>Sunday – Thursday: 9am – 6pm<br />Friday – Saturday: Closed</p>
          </div>
          <div style={s.infoBlock}>
            <p style={s.infoHead}>Follow us</p>
            <div style={s.social}>
              <a href="https://www.instagram.com/medtrack.wear?igsh=MWppMmp6YmpocXl3MQ==" target="_blank" rel="noopener noreferrer" style={s.socialLink}>Instagram</a>
              <a href="https://www.tiktok.com/@medtrack.wear?_r=1&_t=ZS-9918BfOV5SH" target="_blank" rel="noopener noreferrer" style={s.socialLink}>TikTok</a>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}