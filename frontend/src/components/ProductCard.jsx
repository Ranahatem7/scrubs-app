import { useState } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { theme } from "../theme";
import { formatPrice } from "../data/products";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";

const SIZES = ["S", "M", "L", "XL"];

const s = {
  card: { position: "relative" },

  media: {
    display: "block",
    aspectRatio: "3 / 4",
    overflow: "hidden",
    background: theme.surfaceMuted,
    border: `1px solid ${theme.hairlineOnLight}`,
    borderRadius: theme.radius,
    textDecoration: "none",
  },
  img: { width: "100%", height: "100%", objectFit: "cover" },
  swatch: (tone) => ({
    display: "block",
    width: "100%",
    height: "100%",
    background: `repeating-linear-gradient(45deg, rgba(34,37,42,0.035) 0 1px, transparent 1px 7px), linear-gradient(150deg, ${tone}, ${theme.surfaceMuted} 78%)`,
  }),

  body: { padding: "12px 2px 0" },
  nameLink: { textDecoration: "none" },
  name: {
    margin: 0,
    fontFamily: theme.fontDisplay,
    fontSize: 19,
    fontWeight: 500,
    letterSpacing: "0.01em",
    color: theme.textOnLight,
  },
  fit: { margin: "2px 0 0", fontSize: 10, letterSpacing: "0.16em", textTransform: "uppercase", color: theme.textOnLightMuted },
  price: { margin: "8px 0 0", fontSize: 12, letterSpacing: "0.08em", color: theme.accent, fontWeight: 600 },

  colorRow: { display: "flex", gap: 5, marginTop: 10 },
  colorDot: (hex, active) => ({
    width: 16, height: 16, borderRadius: "50%", background: hex,
    border: active ? `2px solid ${theme.accent}` : "2px solid transparent",
    outline: active ? `1px solid ${theme.accent}` : "none",
    outlineOffset: 1, cursor: "pointer", transition: "border-color 0.15s",
  }),

  sizeRow: { display: "flex", gap: 5, marginTop: 8, flexWrap: "wrap" },
  sizePill: (active) => ({
    padding: "3px 9px", fontSize: 10, letterSpacing: "0.12em", textTransform: "uppercase",
    border: `1px solid ${active ? theme.accent : theme.lightGray}`,
    borderRadius: 4,
    background: active ? theme.accent : theme.surfaceLight,
    color: active ? theme.textOnDark : theme.textOnLight,
    cursor: "pointer", transition: "border-color 0.15s, color 0.15s, background 0.15s",
  }),

  addBtn: (added) => ({
    marginTop: 10, width: "100%", padding: "9px 0",
    border: `1px solid ${added ? theme.accent : theme.lightGray}`,
    borderRadius: 6,
    background: added ? "rgba(15, 91, 70, 0.1)" : theme.surfaceLight,
    color: added ? theme.accent : theme.textOnLight,
    fontSize: 10, letterSpacing: "0.16em", textTransform: "uppercase",
    cursor: "pointer", fontFamily: theme.fontBody,
    transition: "border-color 0.2s, color 0.2s, background 0.2s",
  }),
};

export default function ProductCard({ product }) {
  const { addItem } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const firstColor = product.colors?.[0] ?? null;
  const [selectedColor, setSelectedColor] = useState(firstColor);
  const [selectedSize, setSelectedSize] = useState(null);
  const [added, setAdded] = useState(false);

  const sizes = product.sizes ?? SIZES;
  const productUrl = `/product/${product.slug ?? product._id}`;

  const handleAdd = (e) => {
    e.stopPropagation();
    if (!selectedSize) return;
    addItem(product, selectedSize, selectedColor?.name ?? selectedColor ?? "");
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  };

  const image = product.images?.[0];

  return (
    <article style={s.card}>
      {/* Clicking image goes to product page */}
      <Link to={productUrl} style={s.media}>
        {image ? (
          <img src={image} alt={product.name} loading="lazy" style={s.img} />
        ) : (
          <span style={s.swatch(product.tone ?? "#3a3f45")} aria-hidden="true" />
        )}
      </Link>

      <div style={s.body}>
        <Link to={productUrl} style={s.nameLink}>
          <h3 style={s.name}>{product.name}</h3>
        </Link>
        <p style={s.fit}>{product.fit}</p>
        <p style={s.price}>{formatPrice(product.price)}</p>

        {product.colors?.length > 0 && (
          <div style={s.colorRow}>
            {product.colors.map((c) => {
              const hex = typeof c === "string" ? c : c.hex;
              const name = typeof c === "string" ? c : c.name;
              const isActive = selectedColor === c || selectedColor?.name === name;
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