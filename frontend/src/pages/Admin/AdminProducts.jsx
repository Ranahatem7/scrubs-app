import { useEffect, useState } from "react";
import { useAdmin } from "../../context/AdminContext";
import { theme, display } from "../../theme";
import ImageUploader from "../../components/ImageUploader";
import useIsDesktop from "../../hooks/useIsDesktop";

export default function AdminProducts() {
  const { adminToken } = useAdmin();
  const isDesktop = useIsDesktop(700);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({});
  const [editId, setEditId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState("");

  const getHeaders = () => ({
    "Content-Type": "application/json",
    Authorization: `Bearer ${adminToken}`,
  });

  const load = () => {
    if (!adminToken) return;
    setLoading(true);
    const headers = getHeaders();
    Promise.all([
      fetch(`${import.meta.env.VITE_API_URL}/admin/products`, { headers }).then((r) => r.json()),
      fetch(`${import.meta.env.VITE_API_URL}/admin/categories`, { headers }).then((r) => r.json()),
    ]).then(([prods, cats]) => {
      setProducts(Array.isArray(prods) ? prods : []);
      setCategories(Array.isArray(cats) ? cats : []);
    }).finally(() => setLoading(false));
  };

  const emptyForm = (cats) => ({
    name: "", description: "", price: "", category: cats[0]?.slug || "", gender: "unisex",
    fit: "", sizes: "S,M,L,XL", images: "", stock: "50", colors: "",
  });

  useEffect(() => { if (adminToken) load(); }, [adminToken]);

  const openAdd = () => { setForm(emptyForm(categories)); setEditId(null); setShowForm(true); };
  const openEdit = (p) => {
    setForm({
      name: p.name, description: p.description || "", price: p.price, category: p.category,
      gender: p.gender, fit: p.fit, sizes: (p.sizes || []).join(","),
      images: (p.images || []).join(","), stock: p.stock,
      colors: (p.colors || []).map((c) => typeof c === "string" ? c : `${c.name}:${c.hex}`).join(","),
    });
    setEditId(p._id);
    setShowForm(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    const body = {
      ...form,
      price: Number(form.price),
      stock: Number(form.stock),
      sizes: form.sizes.split(",").map((s) => s.trim()).filter(Boolean),
      images: form.images.split(",").map((s) => s.trim()).filter(Boolean),
      colors: form.colors.split(",").map((s) => s.trim()).filter(Boolean).map((c) => {
        const [name, hex] = c.split(":").map((x) => x.trim());
        return hex ? { name, hex } : { name: c, hex: c };
      }),
    };
    const url = editId
      ? `${import.meta.env.VITE_API_URL}/admin/products/${editId}`
      : `${import.meta.env.VITE_API_URL}/admin/products`;
    await fetch(url, { method: editId ? "PUT" : "POST", headers: getHeaders(), body: JSON.stringify(body) });
    setSaving(false);
    setShowForm(false);
    load();
  };

  const handleDelete = async (id, name) => {
    if (!confirm(`Delete "${name}"?`)) return;
    await fetch(`${import.meta.env.VITE_API_URL}/admin/products/${id}`, { method: "DELETE", headers: getHeaders() });
    load();
  };

  const filtered = products.filter((p) =>
    p.name?.toLowerCase().includes(search.toLowerCase())
  );

  const s = {
    topRow: { display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 },
    title: { ...display, fontSize: 28, margin: 0, color: theme.textOnLight },
    addBtn: {
      padding: "10px 20px", background: theme.accent, border: "none",
      borderRadius: theme.radius, color: theme.textOnDark, fontSize: 11,
      fontWeight: 600, letterSpacing: "0.14em", textTransform: "uppercase",
      cursor: "pointer", fontFamily: theme.fontBody,
    },
    searchInput: {
      padding: "9px 14px", background: theme.surfaceLight,
      border: `1px solid ${theme.hairlineOnLight}`, borderRadius: theme.radius,
      color: theme.textOnLight, fontSize: 13, fontFamily: theme.fontBody,
      outline: "none", width: 240, marginBottom: 20,
    },
    table: {
      width: "100%", background: theme.surfaceLight,
      border: `1px solid ${theme.hairlineOnLight}`,
      borderRadius: theme.radius, overflow: "hidden", borderCollapse: "collapse",
    },
    th: {
      padding: "12px 16px", fontSize: 10, letterSpacing: "0.18em",
      textTransform: "uppercase", color: theme.textOnLightMuted, textAlign: "left",
      borderBottom: `1px solid ${theme.hairlineOnLight}`, background: theme.surfaceMuted,
    },
    td: {
      padding: "13px 16px", fontSize: 13, color: theme.textOnLight,
      borderBottom: `1px solid ${theme.hairlineOnLight}`,
    },
    img: { width: 44, height: 52, objectFit: "cover", borderRadius: 4, background: theme.surfaceMuted },
    editBtn: {
      padding: "5px 12px", fontSize: 11, borderRadius: theme.radius, cursor: "pointer",
      border: `1px solid ${theme.hairlineOnLight}`, background: "transparent",
      color: theme.textOnLightMuted, fontFamily: theme.fontBody, marginLeft: 6,
    },
    deleteBtn: {
      padding: "5px 12px", fontSize: 11, borderRadius: theme.radius, cursor: "pointer",
      border: `1px solid rgba(180,60,60,0.3)`, background: "transparent",
      color: "#b43c3c", fontFamily: theme.fontBody, marginLeft: 6,
    },
    overlay: {
      position: "fixed", inset: 0, background: "rgba(11,31,24,0.5)",
      display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100, padding: 24,
    },
    modal: {
      background: theme.surfaceLight, border: `1px solid ${theme.hairlineOnLight}`,
      borderRadius: theme.radius, padding: isDesktop ? 32 : 20, width: "100%",
      maxWidth: isDesktop ? 520 : "100%",
      maxHeight: "90vh", overflowY: "auto",
    },
    modalTitle: { ...display, fontSize: 22, margin: "0 0 24px", color: theme.textOnLight },
    field: { display: "flex", flexDirection: "column", gap: 5, marginBottom: 14 },
    fieldLabel: { fontSize: 10, letterSpacing: "0.18em", textTransform: "uppercase", color: theme.textOnLightMuted },
    input: {
      padding: "9px 12px", background: theme.surfaceLight,
      border: `1px solid ${theme.hairlineOnLight}`, borderRadius: theme.radius,
      color: theme.textOnLight, fontSize: 13, fontFamily: theme.fontBody, outline: "none",
    },
    select: {
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

  const upd = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  return (
    <div>
      <div style={s.topRow}>
        <h1 style={s.title}>Products</h1>
        <button style={s.addBtn} onClick={openAdd}>+ Add product</button>
      </div>

      <input
        style={s.searchInput}
        placeholder="Search products…"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <div style={{ overflowX: "auto" }}>
        <table style={s.table}>
          <thead>
            <tr>
              <th style={s.th}>Photo</th>
              <th style={s.th}>Name</th>
              <th style={s.th}>Category</th>
              <th style={s.th}>Gender</th>
              <th style={s.th}>Price</th>
              <th style={s.th}>Stock</th>
              <th style={s.th}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td style={s.td} colSpan={7}>Loading…</td></tr>
            ) : filtered.length === 0 ? (
              <tr><td style={s.td} colSpan={7}>No products found.</td></tr>
            ) : filtered.map((p) => (
              <tr key={p._id}>
                <td style={s.td}>{p.images?.[0] ? <img src={p.images[0]} alt={p.name} style={s.img} /> : <div style={s.img} />}</td>
                <td style={{ ...s.td, fontWeight: 600 }}>{p.name}</td>
                <td style={s.td}>{p.category}</td>
                <td style={s.td}>{p.gender}</td>
                <td style={{ ...s.td, color: theme.accent, fontWeight: 600 }}>LE {p.price?.toLocaleString()}</td>
                <td style={s.td}>{p.stock}</td>
                <td style={s.td}>
                  <button style={s.editBtn} onClick={() => openEdit(p)}>Edit</button>
                  <button style={s.deleteBtn} onClick={() => handleDelete(p._id, p.name)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showForm && (
        <div style={s.overlay} onClick={(e) => e.target === e.currentTarget && setShowForm(false)}>
          <div style={s.modal}>
            <h2 style={s.modalTitle}>{editId ? "Edit product" : "Add product"}</h2>
            <form onSubmit={handleSave}>
              <div style={s.field}>
                <label style={s.fieldLabel}>Name</label>
                <input style={s.input} value={form.name} onChange={(e) => upd("name", e.target.value)} required />
              </div>
              <div style={s.field}>
                <label style={s.fieldLabel}>Description</label>
                <textarea
                  style={{ ...s.input, resize: "vertical", minHeight: 90 }}
                  value={form.description}
                  onChange={(e) => upd("description", e.target.value)}
                  placeholder="Describe the product — fabric, fit, features…"
                />
              </div>
              <div style={s.row2}>
                <div style={s.field}>
                  <label style={s.fieldLabel}>Price (LE)</label>
                  <input style={s.input} type="number" value={form.price} onChange={(e) => upd("price", e.target.value)} required />
                </div>
                <div style={s.field}>
                  <label style={s.fieldLabel}>Stock</label>
                  <input style={s.input} type="number" value={form.stock} onChange={(e) => upd("stock", e.target.value)} />
                </div>
              </div>
              <div style={s.row2}>
                <div style={s.field}>
                  <label style={s.fieldLabel}>Category</label>
                  <select style={s.select} value={form.category} onChange={(e) => upd("category", e.target.value)}>
                    {categories.map((c) => (
                      <option key={c._id} value={c.slug}>{c.name}</option>
                    ))}
                    {categories.length === 0 && <option value="">No categories yet</option>}
                  </select>
                </div>
                <div style={s.field}>
                  <label style={s.fieldLabel}>Gender</label>
                  <select style={s.select} value={form.gender} onChange={(e) => upd("gender", e.target.value)}>
                    <option value="unisex">Unisex</option>
                    <option value="men">Men</option>
                    <option value="women">Women</option>
                  </select>
                </div>
              </div>
              <div style={s.field}>
                <label style={s.fieldLabel}>Fit (e.g. MEN · SLIM)</label>
                <input style={s.input} value={form.fit} onChange={(e) => upd("fit", e.target.value)} />
              </div>
              <div style={s.field}>
                <label style={s.fieldLabel}>Sizes (comma separated)</label>
                <input style={s.input} value={form.sizes} onChange={(e) => upd("sizes", e.target.value)} placeholder="S,M,L,XL" />
              </div>
              <div style={s.field}>
                <label style={s.fieldLabel}>Colors (Name:Hex, comma separated)</label>
                <input
                  style={s.input}
                  value={form.colors}
                  onChange={(e) => upd("colors", e.target.value)}
                  placeholder="Black:#1a1a1a, Navy:#1a3a5c, Olive:#556b2f"
                />
                <span style={s.hint}>Format: Color Name:#hexcode — separate multiple with commas</span>
              </div>
              <div style={s.field}>
                <label style={s.fieldLabel}>Images (upload or paste URLs)</label>
                <ImageUploader
                  value={form.images}
                  onChange={(urls) => upd("images", urls)}
                  multiple
                />
              </div>
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