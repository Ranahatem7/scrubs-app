import { useEffect, useState } from "react";
import { useAdmin } from "../../context/AdminContext";
import { theme, display } from "../../theme";
import ImageUploader from "../../components/ImageUploader";
 
export default function AdminSettings() {
  const { adminToken } = useAdmin();
 
  const [creds, setCreds] = useState({ email: "", currentPassword: "", newPassword: "" });
  const [credsSaving, setCredsSaving] = useState(false);
  const [credsMsg, setCredsMsg] = useState(null);
 
  const [site, setSite] = useState({ heroImage: "", heroImage2: "", heroImage3: "", heroTitle: "", heroSub: "" });
  const [siteSaving, setSiteSaving] = useState(false);
  const [siteMsg, setSiteMsg] = useState(null);
 
  const getHeaders = () => ({
    "Content-Type": "application/json",
    Authorization: `Bearer ${adminToken}`,
  });
 
  useEffect(() => {
    if (!adminToken) return;
   fetch(`${import.meta.env.VITE_API_URL}/admin/settings/public`)
      .then((r) => r.json())
      .then((data) => setSite({
        heroImage:  data.heroImage  || "",
        heroImage2: data.heroImage2 || "",
        heroImage3: data.heroImage3 || "",
        heroTitle:  data.heroTitle  || "",
        heroSub:    data.heroSub    || "",
      }))
      .catch(() => {});
  }, [adminToken]);
 
  const handleCredsSave = async (e) => {
    e.preventDefault();
    setCredsSaving(true);
    setCredsMsg(null);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/admin/credentials`, {
        method: "PUT",
        headers: getHeaders(),
        body: JSON.stringify(creds),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed");
      setCredsMsg({ ok: true, text: "Credentials updated." });
      setCreds({ email: "", currentPassword: "", newPassword: "" });
    } catch (err) {
      setCredsMsg({ ok: false, text: err.message });
    } finally {
      setCredsSaving(false);
    }
  };
 
  const handleSiteSave = async (e) => {
    e.preventDefault();
    setSiteSaving(true);
    setSiteMsg(null);
    try {
    const res = await fetch(`${import.meta.env.VITE_API_URL}/admin/settings`, {
        method: "PUT",
        headers: getHeaders(),
        body: JSON.stringify(site),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed");
      setSiteMsg({ ok: true, text: "Site settings saved." });
    } catch (err) {
      setSiteMsg({ ok: false, text: err.message });
    } finally {
      setSiteSaving(false);
    }
  };
 
  const s = {
    title: { ...display, fontSize: 28, margin: "0 0 32px", color: theme.textOnLight },
    card: {
      background: theme.surfaceLight, border: `1px solid ${theme.hairlineOnLight}`,
      borderRadius: theme.radius, padding: 28, marginBottom: 24, maxWidth: 520,
    },
    cardTitle: {
      fontSize: 13, fontWeight: 600, color: theme.textOnLight,
      margin: "0 0 20px", letterSpacing: "0.04em",
    },
    field: { display: "flex", flexDirection: "column", gap: 5, marginBottom: 14 },
    fieldLabel: {
      fontSize: 10, letterSpacing: "0.18em", textTransform: "uppercase",
      color: theme.textOnLightMuted,
    },
    input: {
      padding: "9px 12px", background: theme.surfaceLight,
      border: `1px solid ${theme.hairlineOnLight}`, borderRadius: theme.radius,
      color: theme.textOnLight, fontSize: 13, fontFamily: theme.fontBody, outline: "none",
    },
    saveBtn: {
      padding: "10px 24px", background: theme.accent, border: "none",
      borderRadius: theme.radius, color: theme.textOnDark, fontSize: 11,
      fontWeight: 600, letterSpacing: "0.14em", textTransform: "uppercase",
      cursor: "pointer", fontFamily: theme.fontBody, marginTop: 6,
    },
    msg: (ok) => ({
      fontSize: 12, marginTop: 10,
      color: ok ? theme.accent : "#b43c3c",
      padding: "8px 12px",
      background: ok ? "rgba(15,91,70,0.07)" : "rgba(180,60,60,0.07)",
      borderRadius: theme.radius,
      border: `1px solid ${ok ? "rgba(15,91,70,0.2)" : "rgba(180,60,60,0.2)"}`,
    }),
  };
 
  const updCreds = (k, v) => setCreds((f) => ({ ...f, [k]: v }));
  const updSite = (k, v) => setSite((f) => ({ ...f, [k]: v }));
 
  return (
    <div>
      <h1 style={s.title}>Settings</h1>
 
      <div style={s.card}>
        <p style={s.cardTitle}>Site Appearance</p>
        <form onSubmit={handleSiteSave}>
          <div style={s.field}>
            <label style={s.fieldLabel}>Hero Image — Left (main)</label>
            <ImageUploader
              value={site.heroImage}
              onChange={(url) => updSite("heroImage", url)}
            />
          </div>
          <div style={s.field}>
            <label style={s.fieldLabel}>Hero Image — Right Top</label>
            <ImageUploader
              value={site.heroImage2}
              onChange={(url) => updSite("heroImage2", url)}
            />
          </div>
          <div style={s.field}>
            <label style={s.fieldLabel}>Hero Image — Right Bottom</label>
            <ImageUploader
              value={site.heroImage3}
              onChange={(url) => updSite("heroImage3", url)}
            />
          </div>
          <div style={s.field}>
            <label style={s.fieldLabel}>Hero Title</label>
            <input
              style={s.input} value={site.heroTitle}
              onChange={(e) => updSite("heroTitle", e.target.value)}
              placeholder="Scrubs for the long shift"
            />
          </div>
          <div style={s.field}>
            <label style={s.fieldLabel}>Hero Subtitle</label>
            <input
              style={s.input} value={site.heroSub}
              onChange={(e) => updSite("heroSub", e.target.value)}
              placeholder="Engineered fabric, tailored cut..."
            />
          </div>
          <button type="submit" style={s.saveBtn} disabled={siteSaving}>
            {siteSaving ? "Saving..." : "Save appearance"}
          </button>
          {siteMsg && <p style={s.msg(siteMsg.ok)}>{siteMsg.text}</p>}
        </form>
      </div>
 
      <div style={s.card}>
        <p style={s.cardTitle}>Admin Credentials</p>
        <form onSubmit={handleCredsSave}>
          <div style={s.field}>
            <label style={s.fieldLabel}>New Email (leave blank to keep current)</label>
            <input
              style={s.input} type="email" value={creds.email}
              onChange={(e) => updCreds("email", e.target.value)}
              placeholder="admin@medtrack.com"
            />
          </div>
          <div style={s.field}>
            <label style={s.fieldLabel}>Current Password (required)</label>
            <input
              style={s.input} type="password" value={creds.currentPassword}
              onChange={(e) => updCreds("currentPassword", e.target.value)}
              required
            />
          </div>
          <div style={s.field}>
            <label style={s.fieldLabel}>New Password (leave blank to keep current)</label>
            <input
              style={s.input} type="password" value={creds.newPassword}
              onChange={(e) => updCreds("newPassword", e.target.value)}
              placeholder="........"
            />
          </div>
          <button type="submit" style={s.saveBtn} disabled={credsSaving}>
            {credsSaving ? "Saving..." : "Save credentials"}
          </button>
          {credsMsg && <p style={s.msg(credsMsg.ok)}>{credsMsg.text}</p>}
        </form>
      </div>
    </div>
  );
}