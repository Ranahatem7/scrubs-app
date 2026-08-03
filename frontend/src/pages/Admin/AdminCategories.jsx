import { useEffect, useState } from "react";
import { useAdmin } from "../../context/AdminContext";
import { theme, display } from "../../theme";

const EMPTY = { name: "", subtitle: "", image: "", slug: "", order: "0" };

export default function AdminCategories() {
  const { adminToken } = useAdmin();
  const [cats, setCats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(EMPTY);
  const [editId, setEditId] = useState(null);
  const [saving, setSaving] = useState(false);

  const headers = { "Content-Type": "application/json", Authorization: `Bearer ${adminToken}` };

  const load = () => {
    setLoading(true);
    fetch("/api/admin/categories", { headers })
      .then((r) => r.json())
      .then(setCats)
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const openAdd = () => { setForm(EMPTY); setEditId(null); setShowForm(true); };
  const openEdit = (c) => {
    setForm({ name: c.name, subtitle: c.subtitle, image: c.image, slug: c.slug, order: c.order });
    setEditId(c._id);
    setShowForm(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    const body = { ...form, order: Number(form.order) };
    const url = editId ? `/api/admin/categories/${editId}` : "/api/admin/categories";
    await fetch(url, { method: editId ? "PUT" : "POST", headers, body: JSON.stringify(body) });
    setSaving(false);
    setShowForm(false);
    load();
  };

  const handleDelete = async (id, name) => {
    if (!confirm(`Delete "${name}"?`)) return;
    await fetch(`/api/admin/categories/${id}`, { method: "DELETE", headers });
    load();
  };

  const upd = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const s = {
    topRow: { display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 },
    title: { ...display, fontSize: 28, margin: 0, color: theme.textOnLight },
    addBtn: {
      padding: "10px 20px", background: theme.accent, border: "none",
      borderRadius: theme.radius, color: theme.textOnDark, fontSize: 11,
      fontWeight: 600, letterSpacing: "0.14em", textTransform: "uppercase",
      cursor: "pointer", fontFamily: theme.fontBody,
    },
    grid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 16 },
    card: {
      background: theme.surfaceLight, border: `1px solid ${theme.hairlineOnLight}`,
      borderRadius: theme.radius, overflow: "hidden",
    },
    cardImg: { width: "100%", height: 140, objectFit: "cover", background: theme.surfaceMuted, display: "block" },
    cardImgPlaceholder: {
      width: "100%", height: 140, background: theme.surfaceMuted,
      display: "flex", alignItems: "center", justifyContent: "center",
      fontSize: 28, color: theme.textOnLightMuted,
    },
    cardBody: { padding: 16 },
    cardName: { fontSize: 15, fontWeight: 700, color: theme.textOnLight, marginBottom: 2 },
    cardSub: { fontSize: 10, letterSpacing: "0.2em", textTransform: "uppercase", color: theme.textOnLightMuted, marginBottom: 4 },
    cardSlug: { fontSize: 11, color: theme.accent, marginBottom: 12 },
    cardActions: { display: "flex", gap: 8 },
    editBtn: {
      flex: 1, padding: "6px 0", fontSize: 11, borderRadius: theme.radius, cursor: "pointer",
      border: `1px solid ${theme.hairlineOnLight}`, background: "transparent",
      color: theme.textOnLightMuted, fontFamily: theme.fontBody,
    },
    deleteBtn: {
      flex: 1, padding: "6px 0", fontSize: 11, borderRadius: theme.radius, cursor: "pointer",
      border: "1px solid rgba(180,60,60,0.3)", background: "transparent",
      color: "#b43c3c", fontFamily: theme.fontBody,
    },

    overlay: {
      position: "fixed", inset: 0, background: "rgba(11,31,24,0.5)",
      display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100, padding: 24,
    },
    modal: {
      background: theme.surfaceLight, border: `1px solid ${theme.hairlineOnLight}`,
      borderRadius: theme.radius, padding: 32, width: "100%", maxWidth: 480,
    },
    modalTitle: { ...display, fontSize: 22, margin: "0 0 24px", color: theme.textOnLight },
    field: { display: "flex", flexDirection: "column", gap: 5, marginBottom: 14 },
    fieldLabel: { fontSize: 10, letterSpacing: "0.18em", textTransform: "uppercase", color: theme.textOnLightMuted },
    input: {
      padding: "9px 12px", background: theme.surfaceLight,
      border: `1px solid ${theme.hairlineOnLight}`, borderRadius: theme.radius,
      color: theme.textOnLight, fontSize: 13, fontFamily: theme.fontBody, outline: "none",
    },
    row2: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 },
    modalActions: { display: "flex", gap: 10, marginTop: 20 },
    saveBtn: {
      flex: 1, padding: "11px 0", background: theme.accent, border: "none",
      borderRadius: theme.radius, color: theme.textOnDark, fontSize: 11,
      fontWeight: 600, letterSpacing: "0.14em", textTransform: "uppercase",
      cursor: "pointer", fontFamily: theme.fontBody,
    },
    cancelBtn: {
      flex: 1, padding: "11px 0", background: "transparent",
      border: `1px solid ${theme.hairlineOnLight}`, borderRadius: theme.radius,
      color: theme.textOnLightMuted, fontSize: 11, cursor: "pointer", fontFamily: theme.fontBody,
    },
    hint: { fontSize: 11, color: theme.textOnLightMuted, marginTop: 4 },
  };

  return (
    <div>
      <div style={s.topRow}>
        <h1 style={s.title}>Categories</h1>
        <button style={s.addBtn} onClick={openAdd}>+ Add category</button>
      </div>

      {loading ? (
        <p style={{ color: theme.textOnLightMuted }}>Loading…</p>
      ) : cats.length === 0 ? (
        <p style={{ color: theme.textOnLightMuted }}>No categories yet. Add one to get started.</p>
      ) : (
        <div style={s.grid}>
          {cats.map((c) => (
            <div key={c._id} style={s.card}>
              {c.image
                ? <img src={c.image} alt={c.name} style={s.cardImg} />
                : <div style={s.cardImgPlaceholder}>🖼</div>
              }
              <div style={s.cardBody}>
                <div style={s.cardName}>{c.name}</div>
                {c.subtitle && <div style={s.cardSub}>{c.subtitle}</div>}
                <div style={s.cardSlug}>/{c.slug}</div>
                <div style={s.cardActions}>
                  <button style={s.editBtn} onClick={() => openEdit(c)}>Edit</button>
                  <button style={s.deleteBtn} onClick={() => handleDelete(c._id, c.name)}>Delete</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {showForm && (
        <div style={s.overlay} onClick={(e) => e.target === e.currentTarget && setShowForm(false)}>
          <div style={s.modal}>
            <h2 style={s.modalTitle}>{editId ? "Edit category" : "Add category"}</h2>
            <form onSubmit={handleSave}>
              <div style={s.field}>
                <label style={s.fieldLabel}>Name</label>
                <input style={s.input} value={form.name} onChange={(e) => upd("name", e.target.value)} placeholder="e.g. Tops" required />
              </div>
              <div style={s.row2}>
                <div style={s.field}>
                  <label style={s.fieldLabel}>Slug</label>
                  <input style={s.input} value={form.slug} onChange={(e) => upd("slug", e.target.value)} placeholder="e.g. tops" required />
                  <span style={s.hint}>Used in URLs and filters</span>
                </div>
                <div style={s.field}>
                  <label style={s.fieldLabel}>Display order</label>
                  <input style={s.input} type="number" value={form.order} onChange={(e) => upd("order", e.target.value)} />
                </div>
              </div>
              <div style={s.field}>
                <label style={s.fieldLabel}>Subtitle (optional)</label>
                <input style={s.input} value={form.subtitle} onChange={(e) => upd("subtitle", e.target.value)} placeholder="e.g. TEN POCKETS" />
              </div>
              <div style={s.field}>
                <label style={s.fieldLabel}>Image URL</label>
                <input style={s.input} value={form.image} onChange={(e) => upd("image", e.target.value)} placeholder="https://..." />
              </div>
              {form.image && (
                <img src={form.image} alt="preview" style={{ width: "100%", height: 120, objectFit: "cover", borderRadius: theme.radius, marginBottom: 14 }} />
              )}
              <div style={s.modalActions}>
                <button type="submit" style={s.saveBtn} disabled={saving}>{saving ? "Saving…" : "Save"}</button>
                <button type="button" style={s.cancelBtn} onClick={() => setShowForm(false)}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}