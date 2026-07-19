import { theme } from "../theme";
import { formatPrice } from "../data/products";

const s = {
  media: {
    display: "block",
    aspectRatio: "3 / 4",
    overflow: "hidden",
    background: theme.ink2,
    border: "1px solid rgba(255, 255, 255, 0.05)",
    borderRadius: theme.radius,
  },
  img: { width: "100%", height: "100%", objectFit: "cover" },
  // Fabric-swatch placeholder until real photography is dropped in
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
};

export default function ProductCard({ product }) {
  return (
    <article>
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
      </div>
    </article>
  );
}