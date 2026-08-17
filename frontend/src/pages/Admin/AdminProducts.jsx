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
    fit: "", sizes: "S,M,L,XL", images: "", stock: { S: 0, M: 0, L: 0, XL: 0 }, colors: "", featured: false,
  });

  useEffect(() => { if (adminToken) load(); }, [adminToken]);

  const openAdd = () => { setForm(emptyForm(categories)); setEditId(null); setShowForm(true); };

  const openEdit = (p) => {
    const sizeList = p.sizes || [];
    let stockObj = {};
    if (typeof p.stock === "number") {
      // backward compat: spread old single number across all sizes
      sizeList.forEach((s) => { stockObj[s] = p.stock; });
    } else if (p.stock && typeof p.stock === "object") {
      stockObj = { ...p.stock };
    }
    setForm({
      name: p.name, description: p.description || "", price: p.price,
      category: p.category, gender: p.gender, fit: p.fit,
      sizes: sizeList.join(","), images: (p.images || []).join(","),
      stock: stockObj,
      colors: (p.colors || []).map((c) => typeof c === "string" ? c : `${c.name}:${c.hex}`).join(","),
      featured: p.featured ?? false,
    });
    setEditId(p._id);
    setShowForm(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    const sizeList = form.sizes.split(",").map((s) => s.trim()).filter(Boolean);
    // Build stock object with only the current sizes
    const stockObj = {};
    sizeList.forEach((s) => { stockObj[s] = Number(form.stock[s] ?? 0); });

    const body = {
      ...form,
      price: Number(form.price),
      featured: form.featured ?? false,
      stock: stockObj,
      sizes: sizeList,
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

  // Helper: total stock across all sizes
  const totalStock = (stock) => {
    if (!stock || typeof stock === "number") return stock ?? 0;
    return Object.values(stock).reduce((a, b) => a + Number(b), 0);
  };

  const upd = (k, v) => {
    if (k === "sizes") {
      // When sizes change, preserve existing stock values and add new sizes with 0
      const newSizes = v.split(",").map((s) => s.trim()).filter(Boolean);
      const newStock = {};
      newSizes.forEach((s) => { newStock[s] = form.stock?.[s] ?? 0; });
      setForm((f) => ({ ...f, sizes: v, stock: newStock }));
    } else {
      setForm((f) => ({ ...f, [k]: v }));
    }
  };

  const updStock = (size, val) => {
    setForm((f) => ({ ...f, stock: { ...f.stock, [size]: val } }));
  };

  const sizeList = (form.sizes || "").split(",").map((s) => s.trim()).filter(Boolean);

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
    stockGrid: { display: "flex", gap: 10, flexWrap: "wrap", marginTop: 4 },
    stockItem: { display: "flex", flexDirection: "column", gap: 4, alignItems: "center" },
    stockInput: {
      padding: "9px 0", background: theme.surfaceLight,
      border: `1px solid ${theme.hairlineOnLight}`, borderRadius: theme.radius,
      color: theme.textOnLight, fontSize: 13, fontFamily: theme.fontBody,
      outline: "none", width: 64, textAlign: "center",
    },
    stockLabel: {
      fontSize: 10, letterSpacing: "0.16em", textTransform: "uppercase",
      color: theme.accent, fontWeight: 600,
    },
  };

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
              <th style={s.th}>Stock (total)</th>
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
                <td style={s.td}>
                  {typeof p.stock === "object" && p.stock !== null
                    ? Object.entries(p.stock).map(([sz, qty]) => `${sz}:${qty}`).join(" · ")
                    : p.stock}
                </td>
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
              <div style={s.field}>
                <label style={s.fieldLabel}>Price (LE)</label>
                <input style={s.input} type="number" value={form.price} onChange={(e) => upd("price", e.target.value)} required />
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

              {/* Per-size stock */}
              {sizeList.length > 0 && (
                <div style={s.field}>
                  <label style={s.fieldLabel}>Stock per size</label>
                  <div style={s.stockGrid}>
                    {sizeList.map((size) => (
                      <div key={size} style={s.stockItem}>
                        <span style={s.stockLabel}>{size}</span>
                        <input
                          style={s.stockInput}
                          type="number"
                          min="0"
                          value={form.stock?.[size] ?? 0}
                          onChange={(e) => updStock(size, e.target.value)}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

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
              {/* Featured toggle */}
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14, padding: "12px 14px", background: form.featured ? "rgba(15,91,70,0.08)" : theme.surfaceMuted, borderRadius: theme.radius, border: `1px solid ${form.featured ? "rgba(15,91,70,0.3)" : theme.hairlineOnLight}`, cursor: "pointer" }} onClick={() => upd("featured", !form.featured)}>
                <div style={{ width: 36, height: 20, borderRadius: 10, background: form.featured ? theme.accent : theme.hairlineOnLight, position: "relative", transition: "background 0.2s", flexShrink: 0 }}>
                  <div style={{ position: "absolute", top: 2, left: form.featured ? 18 : 2, width: 16, height: 16, borderRadius: "50%", background: "#fff", transition: "left 0.2s" }} />
                </div>
                <div>
                  <span style={{ fontSize: 12, fontWeight: 600, color: form.featured ? theme.accent : theme.textOnLight }}>Featured on homepage</span>
                  <p style={{ fontSize: 11, color: theme.textOnLightMuted, margin: "2px 0 0" }}>Shows in "This season" section (max 4)</p>
                </div>
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