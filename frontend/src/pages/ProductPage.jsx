import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { theme, display } from "../theme";
import { useCart } from "../context/CartContext";
import useIsDesktop from "../hooks/useIsDesktop";
import LoadingPage from "../components/LoadingPage";
import Footer from "../components/Footer";

export default function ProductPage() {
  const { slug } = useParams();
  const { addItem } = useCart();
  const navigate = useNavigate();
  const isDesktop = useIsDesktop(700);

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeImg, setActiveImg] = useState(0);
  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedColor, setSelectedColor] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const [showSizeGuide, setShowSizeGuide] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetch(`${import.meta.env.VITE_API_URL}/products/${slug}`)
      .then((r) => r.json())
      .then((data) => {
        setProduct(data);
        setSelectedColor(data.colors?.[0] ?? null);
      })
      .catch(() => setProduct(null))
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) return <LoadingPage />;

  if (!product) {
    return (
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "80px 24px", textAlign: "center" }}>
        <p style={{ color: theme.textOnLightMuted }}>Product not found.</p>
        <button style={{ background: "none", border: "none", cursor: "pointer", color: theme.textOnLightMuted, fontFamily: theme.fontBody }} onClick={() => navigate(-1)}>← Go back</button>
      </div>
    );
  }

  const images = product.images?.length ? product.images : [];
  const sizes = product.sizes?.length ? product.sizes : ["S", "M", "L", "XL"];

  const sizeStock = selectedSize && product.stock && typeof product.stock === "object"
    ? (product.stock[selectedSize] ?? 0)
    : typeof product.stock === "number" ? product.stock : null;

  const isOutOfStock = sizeStock !== null && sizeStock === 0;

  const handleAdd = () => {
    if (!selectedSize || isOutOfStock) return;
    for (let i = 0; i < quantity; i++) {
      addItem(product, selectedSize, selectedColor?.name ?? selectedColor ?? "");
    }
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  };

  const prevImg = () => setActiveImg((i) => (i === 0 ? images.length - 1 : i - 1));
  const nextImg = () => setActiveImg((i) => (i === images.length - 1 ? 0 : i + 1));

  const s = {
    page: { maxWidth: 1100, margin: "0 auto", padding: isDesktop ? "40px 24px 80px" : "20px 16px 60px" },
    back: {
      display: "inline-flex", alignItems: "center", gap: 6,
      fontSize: 12, letterSpacing: "0.12em", textTransform: "uppercase",
      color: theme.textOnLightMuted, cursor: "pointer", background: "none",
      border: "none", fontFamily: theme.fontBody, padding: 0, marginBottom: 24,
    },
    grid: {
      display: "grid",
      gridTemplateColumns: isDesktop ? "1fr 1fr" : "1fr",
      gap: isDesktop ? 56 : 28,
      alignItems: "start",
    },
    gallery: { display: "flex", flexDirection: "column", gap: 10 },
    mainImgWrap: {
      position: "relative", width: "100%", aspectRatio: "3/4",
      borderRadius: theme.radius, border: `1px solid ${theme.hairlineOnLight}`,
      background: theme.surfaceMuted, overflow: "hidden",
    },
    mainImg: { width: "100%", height: "100%", objectFit: "cover", display: "block" },
    arrowBtn: (side) => ({
      position: "absolute", top: "50%", [side]: 10, transform: "translateY(-50%)",
      width: 36, height: 36, borderRadius: "50%", background: "rgba(9,42,31,0.72)",
      border: "none", color: "#fff", fontSize: 16, cursor: "pointer",
      display: "flex", alignItems: "center", justifyContent: "center",
      zIndex: 2, backdropFilter: "blur(4px)", transition: "background 0.15s",
    }),
    thumbRow: { display: "flex", gap: 8, flexWrap: "wrap" },
    thumb: (active) => ({
      width: 64, height: 76, objectFit: "cover", borderRadius: 6,
      border: `2px solid ${active ? theme.accent : theme.hairlineOnLight}`,
      cursor: "pointer", background: theme.surfaceMuted,
    }),
    info: { display: "flex", flexDirection: "column", gap: 0 },
    category: { fontSize: 10, letterSpacing: "0.22em", textTransform: "uppercase", color: theme.accent, marginBottom: 8 },
    name: { ...display, fontSize: isDesktop ? 32 : 26, margin: "0 0 4px", color: theme.textOnLight },
    fit: { fontSize: 11, letterSpacing: "0.16em", textTransform: "uppercase", color: theme.textOnLightMuted, margin: "0 0 16px" },
    price: { fontSize: 24, fontWeight: 700, color: theme.accent, margin: "0 0 24px" },
    divider: { border: "none", borderTop: `1px solid ${theme.hairlineOnLight}`, margin: "20px 0" },
    label: { fontSize: 10, letterSpacing: "0.18em", textTransform: "uppercase", color: theme.textOnLightMuted, marginBottom: 10, display: "block" },
    colorRow: { display: "flex", gap: 8, marginBottom: 20 },
    colorDot: (hex, active) => ({
      width: 22, height: 22, borderRadius: "50%", background: hex,
      border: active ? `2px solid ${theme.accent}` : "2px solid transparent",
      outline: active ? `1px solid ${theme.accent}` : "none",
      outlineOffset: 2, cursor: "pointer",
    }),
    sizeRow: { display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 6 },
    sizePill: (active, outOfStock) => ({
      padding: "8px 16px", fontSize: 12, letterSpacing: "0.1em",
      textTransform: "uppercase", cursor: outOfStock ? "not-allowed" : "pointer",
      fontFamily: theme.fontBody,
      border: `1px solid ${active ? theme.accent : theme.hairlineOnLight}`,
      borderRadius: theme.radius,
      background: active ? theme.accent : theme.surfaceLight,
      color: active ? theme.textOnDark : outOfStock ? theme.textOnLightMuted : theme.textOnLight,
      opacity: outOfStock ? 0.4 : 1,
      textDecoration: outOfStock ? "line-through" : "none",
      transition: "all 0.15s",
    }),
    sizeGuideBtn: {
      background: "none", border: "none", padding: 0, cursor: "pointer",
      fontSize: 11, color: theme.accent, textDecoration: "underline",
      fontFamily: theme.fontBody, marginBottom: 20,
    },
    qtySection: { marginBottom: 20 },
    qtyRow: { display: "flex", alignItems: "center", gap: 0, marginTop: 8 },
    qtyBtn: {
      width: 36, height: 36, border: `1px solid ${theme.hairlineOnLight}`,
      background: "transparent", color: theme.textOnLight, fontSize: 18,
      cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
      borderRadius: 6, fontFamily: theme.fontBody,
    },
    qtyNum: {
      width: 48, textAlign: "center", fontSize: 15, color: theme.textOnLight,
      fontFamily: theme.fontBody, border: `1px solid ${theme.hairlineOnLight}`,
      borderLeft: "none", borderRight: "none",
      height: 36, display: "flex", alignItems: "center", justifyContent: "center",
    },
    addBtn: {
      width: "100%", padding: "14px 0",
      background: isOutOfStock ? theme.textOnLightMuted : theme.accent,
      border: "none", borderRadius: theme.radius,
      color: theme.textOnDark, fontSize: 11, fontWeight: 700,
      letterSpacing: "0.18em", textTransform: "uppercase",
      cursor: selectedSize && !isOutOfStock ? "pointer" : "default",
      fontFamily: theme.fontBody, opacity: !selectedSize ? 0.5 : 1, transition: "opacity 0.2s",
    },
    desc: { fontSize: 14, lineHeight: 1.7, color: theme.textOnLight },
  };

  return (
    <>
      <div style={s.page}>
        <button style={s.back} onClick={() => navigate(-1)}>← Back</button>

        <div style={s.grid}>
          {/* Gallery */}
          <div style={s.gallery}>
            {images.length > 0 ? (
              <>
                <div style={s.mainImgWrap}>
                  <img src={images[activeImg]} alt={product.name} style={s.mainImg} />
                  {images.length > 1 && (
                    <>
                      <button style={s.arrowBtn("left")} onClick={prevImg} aria-label="Previous image">‹</button>
                      <button style={s.arrowBtn("right")} onClick={nextImg} aria-label="Next image">›</button>
                    </>
                  )}
                </div>
                {images.length > 1 && (
                  <div style={s.thumbRow}>
                    {images.map((img, i) => (
                      <img key={i} src={img} alt="" style={s.thumb(i === activeImg)} onClick={() => setActiveImg(i)} />
                    ))}
                  </div>
                )}
              </>
            ) : (
              <div style={{ ...s.mainImgWrap, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <span style={{ color: theme.textOnLightMuted, fontSize: 13 }}>No image</span>
              </div>
            )}
          </div>

          {/* Info */}
          <div style={s.info}>
            {product.category && <p style={s.category}>{product.category}</p>}
            <h1 style={s.name}>{product.name}</h1>
            {product.fit && <p style={s.fit}>{product.fit}</p>}
            <p style={s.price}>LE {product.price?.toLocaleString()}</p>

            <hr style={s.divider} />

            {product.colors?.length > 0 && (
              <>
                <span style={s.label}>Color — {selectedColor?.name ?? selectedColor}</span>
                <div style={s.colorRow}>
                  {product.colors.map((c) => {
                    const hex = typeof c === "string" ? c : c.hex;
                    const name = typeof c === "string" ? c : c.name;
                    const isActive = selectedColor === c || selectedColor?.name === name;
                    return <button key={name} style={s.colorDot(hex, isActive)} onClick={() => setSelectedColor(c)} title={name} />;
                  })}
                </div>
              </>
            )}

            <span style={s.label}>Size</span>
            <div style={s.sizeRow}>
              {sizes.map((sz) => {
                const szStock = product.stock && typeof product.stock === "object"
                  ? (product.stock[sz] ?? 0)
                  : typeof product.stock === "number" ? product.stock : null;
                const szOutOfStock = szStock !== null && szStock === 0;
                return (
                  <button key={sz} style={s.sizePill(selectedSize === sz, szOutOfStock)}
                    onClick={() => { if (!szOutOfStock) { setSelectedSize(sz); setQuantity(1); } }}
                    title={szOutOfStock ? "Out of stock" : undefined}>
                    {sz}
                  </button>
                );
              })}
            </div>
            <button style={s.sizeGuideBtn} onClick={() => setShowSizeGuide(!showSizeGuide)}>
              {showSizeGuide ? "Hide size guide" : "Size guide"}
            </button>

            {showSizeGuide && (
              <img src="/size-chart.png" alt="MedTrack Size Chart" style={{ width: "100%", borderRadius: 8, marginBottom: 16 }} />
            )}

            <hr style={s.divider} />

            {product.description && (
              <>
                <span style={s.label}>Description</span>
                <p style={{ ...s.desc, marginTop: 0 }}>{product.description}</p>
                <hr style={s.divider} />
              </>
            )}

            <div style={s.qtySection}>
              <span style={s.label}>Quantity</span>
              <div style={s.qtyRow}>
                <button style={s.qtyBtn} onClick={() => setQuantity((q) => Math.max(1, q - 1))} aria-label="Decrease quantity">−</button>
                <span style={s.qtyNum}>{quantity}</span>
                <button style={s.qtyBtn} onClick={() => setQuantity((q) => sizeStock !== null ? Math.min(sizeStock, q + 1) : q + 1)} aria-label="Increase quantity">+</button>
              </div>
            </div>

            <button style={s.addBtn} onClick={handleAdd} disabled={!selectedSize || isOutOfStock}>
              {added ? "Added to cart ✓" : isOutOfStock ? "Out of stock" : !selectedSize ? "Select a size" : `Add ${quantity > 1 ? `${quantity} ` : ""}to cart`}
            </button>

            {selectedSize && sizeStock !== null && (
              <p style={{ fontSize: 11, color: isOutOfStock ? "#c0524a" : theme.textOnLightMuted, marginTop: 10 }}>
                {isOutOfStock ? "Out of stock for this size" : `${sizeStock} in stock`}
              </p>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}