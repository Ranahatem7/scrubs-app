import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import ProductCard from "../components/ProductCard";
import useCategories from "../hooks/useCategories";
import useIsDesktop from "../hooks/useIsDesktop";
import LoadingPage from "../components/LoadingPage";
import { theme, label, display, btnGhost } from "../theme";

export default function CategoryPage() {
  const { slug } = useParams();
  const { categories } = useCategories();
  const isDesktop = useIsDesktop(700);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const category = categories.find((c) => c.slug === slug);
  const categoryName = category?.name || slug;

  useEffect(() => {
    if (!categoryName) return;
    setLoading(true);
    setError(null);
    fetch(`${import.meta.env.VITE_API_URL}/products?category=${encodeURIComponent(categoryName)}`)
      .then((r) => r.json())
      .then((data) => setProducts(Array.isArray(data) ? data : []))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [categoryName]);

  if (loading) return <LoadingPage />;

  const s = {
    page: { minHeight: "60vh", background: theme.surfaceLight },
    hero: {
      padding: isDesktop ? "56px 40px 40px" : "36px 20px 28px",
      borderBottom: `1px solid ${theme.hairlineOnLight}`,
    },
    title: { ...display, margin: "8px 0 0", fontSize: isDesktop ? 44 : 32, color: theme.accent },
    count: { fontSize: 12, color: theme.textOnLightMuted, marginTop: 8, letterSpacing: "0.1em" },
    grid: {
      display: "grid",
      gridTemplateColumns: `repeat(${isDesktop ? 4 : 2}, 1fr)`,
      gap: "22px 12px",
      padding: isDesktop ? "40px 40px" : "24px 16px",
    },
    state: {
      padding: "72px 24px",
      textAlign: "center",
      color: theme.textOnLightMuted,
      fontSize: 13,
      letterSpacing: "0.1em",
    },
    back: {
      ...btnGhost("light"),
      display: "inline-flex",
      margin: isDesktop ? "0 0 0 40px" : "0 0 0 16px",
      marginTop: 32,
      marginBottom: 8,
    },
  };

  return (
    <div style={s.page}>
      <Link to="/" style={s.back}>← Back</Link>
      <div style={s.hero}>
        <span style={label("light")}>Collections</span>
        <h1 style={s.title}>{categoryName}</h1>
        <p style={s.count}>{products.length} product{products.length !== 1 ? "s" : ""}</p>
      </div>

      {error && <p style={{ ...s.state, color: "#c0524a" }}>{error}</p>}
      {!error && products.length === 0 && (
        <p style={s.state}>No products in this category yet.</p>
      )}
      {!error && products.length > 0 && (
        <div style={s.grid}>
          {products.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      )}

      <footer style={{ padding: `44px ${theme.pad}px 32px`, background: "#092a1f", marginTop: "auto" }}>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginBottom: 36 }}>
          <img src="/logo.png" alt="MedTrack" style={{ height: 80, width: "auto", display: "block" }} />
          <span style={{ fontSize: 11, letterSpacing: "0.28em", textTransform: "uppercase", color: theme.textOnDarkMuted, marginTop: -25 }}>MedTrack</span>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 28, marginBottom: 32 }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 9 }}>
            <h3 style={{ margin: "0 0 4px", fontSize: 10, fontWeight: 500, letterSpacing: "0.28em", textTransform: "uppercase", color: theme.textOnDark }}>Shop</h3>
            <a href="/men" style={{ fontSize: 13, color: theme.textOnDarkMuted }}>Men</a>
            <a href="/women" style={{ fontSize: 13, color: theme.textOnDarkMuted }}>Women</a>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 9 }}>
            <h3 style={{ margin: "0 0 4px", fontSize: 10, fontWeight: 500, letterSpacing: "0.28em", textTransform: "uppercase", color: theme.textOnDark }}>Help</h3>
            <a href="#sizing" style={{ fontSize: 13, color: theme.textOnDarkMuted }}>Size guide</a>
            <a href="#returns" style={{ fontSize: 13, color: theme.textOnDarkMuted }}>Returns</a>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 6, paddingTop: 24, borderTop: `1px solid ${theme.hairlineOnDark}` }}>
          <p style={{ margin: 0, fontSize: 13, color: theme.textOnDarkMuted }}>New Cairo, Cairo</p>
          <a href="mailto:hello@medtrack.com" style={{ fontSize: 13, color: theme.textOnDarkMuted }}>hello@medtrack.com</a>
        </div>

        <p style={{ margin: "28px 0 0", fontSize: 10, letterSpacing: "0.18em", textTransform: "uppercase", color: theme.textOnDarkMuted }}>© 2026 MedTrack</p>
      </footer>
    </div>
  );
}