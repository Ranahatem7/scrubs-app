import { useState } from "react";
import { theme } from "../theme";
import { formatPrice } from "../data/products";
import { useCart } from "../context/CartContext";

const SIZES = ["S", "M", "L", "XL"];

const s = {
  card: { position: "relative" },

  media: {
    display: "block",
    aspectRatio: "3 / 4",
    overflow: "hidden",
    background: theme.ink2,
    border: "1px solid rgba(255, 255, 255, 0.05)",
    borderRadius: theme.radius,
  },
  img: { width: "100%", height: "100%", objectFit: "cover" },
  swatch: (tone) => ({
    display: "block",
    width: "100%",
    height: "100%",
    background: `repeating-linear-gradient(45deg, rgba(255,255,255,0.035) 0 1px, transparent 1px 7px), linear-gradient(150deg, ${tone}, ${theme.ink2} 78%)`,
  }),

  body: { padding: "12px 2px 0" },
  name: { margin: 0, fontFamily: theme.fontDisplay, fontSize: 19, fontWeight: 400, letterSpacing: "0.01em" },
  fit: { margin: "2px 0 0", fontSize: 10, letterSpacing: "0.16em", textTransform: "uppercase", color: theme.muted },
  price: { margin: "8px 0 0", fontSize: 12, letterSpacing: "0.08em", color: theme.bronze },

  // ── Color swatches ───────────────────────────────────────────────────
  colorRow: { display: "flex", gap: 5, marginTop: 10 },
  colorDot: (hex, active) => ({
    width: 16,
    height: 16,
    borderRadius: "50%",
    background: hex,
    border: active ? `2px solid ${theme.bronze}` : "2px solid transparent",
    outline: active ? `1px solid ${theme.bronze}` : "none",
    outlineOffset: 1,
    cursor: "pointer",
    transition: "border-color 0.15s",
  }),

  // ── Size pills ────────────────────────────────────────────────────────
  sizeRow: { display: "flex", gap: 5, marginTop: 8, flexWrap: "wrap" },
  sizePill: (active) => ({
    padding: "3px 9px",
    fontSize: 10,
    letterSpacing: "0.12em",
    textTransform: "uppercase",
    border: `1px solid ${active ? theme.bronze : "rgba(255,255,255,0.12)"}`,
    borderRadius: 4,
    background: active ? "rgba(192,142,90,0.12)" : "transparent",
    color: active ? theme.bronze : theme.muted,
    cursor: "pointer",
    transition: "border-color 0.15s, color 0.15s",
  }),

  // ── Add to cart button ────────────────────────────────────────────────
  addBtn: (added) => ({
    marginTop: 10,
    width: "100%",
    padding: "9px 0",
    border: `1px solid ${added ? theme.bronze : "rgba(255,255,255,0.14)"}`,
    borderRadius: 6,
    background: added ? "rgba(192,142,90,0.14)" : "transparent",
    color: added ? theme.bronze : theme.silver,
    fontSize: 10,
    letterSpacing: "0.16em",
    textTransform: "uppercase",
    cursor: "pointer",
    fontFamily: theme.fontBody,
    transition: "border-color 0.2s, color 0.2s, background 0.2s",
  }),
};

export default function ProductCard({ product }) {
  const { addItem } = useCart();

  // Pick first color/size as default if available
  const firstColor = product.colors?.[0] ?? null;
  const [selectedColor, setSelectedColor] = useState(firstColor);
  const [selectedSize, setSelectedSize] = useState(null);
  const [added, setAdded] = useState(false);

  const sizes = product.sizes ?? SIZES;

  const handleAdd = () => {
    if (!selectedSize) return; // must pick a size
    addItem(product, selectedSize, selectedColor?.name ?? selectedColor ?? "");
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  };

  return (
    <article style={s.card}>
      <a href={`#product-${product.id}`} style={s.media}>
        {product.image ? (
          <img src={product.image} alt={product.name} loading="lazy" style={s.img} />
        ) : (
          <span style={s.swatch(product.tone)} aria-hidden="true" />
        )}
      </a>

      <div style={s.body}>
        <h3 style={s.name}>{product.name}</h3>
        <p style={s.fit}>{product.fit}</p>
        <p style={s.price}>{formatPrice(product.price)}</p>

        {/* Color selector — only shown if product has colors array */}
        {product.colors && product.colors.length > 0 && (
          <div style={s.colorRow}>
            {product.colors.map((c) => {
              const hex = typeof c === "string" ? c : c.hex;
              const name = typeof c === "string" ? c : c.name;
              const isActive = selectedColor === c ||
                (selectedColor?.name && selectedColor.name === name);
              return (
                <button
                  key={name}
                  style={s.colorDot(hex, isActive)}
                  onClick={() => setSelectedColor(c)}
                  title={name}
                  aria-label={`Color: ${name}`}
                />
              );
            })}
          </div>
        )}

        {/* Size selector */}
        <div style={s.sizeRow}>
          {sizes.map((sz) => (
            <button
              key={sz}
              style={s.sizePill(selectedSize === sz)}
              onClick={() => setSelectedSize(sz)}
            >
              {sz}
            </button>
          ))}
        </div>

        {/* Add to cart */}
        <button
          style={s.addBtn(added)}
          onClick={handleAdd}
          disabled={!selectedSize}
          title={!selectedSize ? "Pick a size first" : ""}
        >
          {added ? "Added ✓" : !selectedSize ? "Select a size" : "Add to cart"}
        </button>
      </div>
    </article>
  );
}