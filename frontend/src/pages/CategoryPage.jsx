import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import ProductCard from "../components/ProductCard";
import useCategories from "../hooks/useCategories";
import useIsDesktop from "../hooks/useIsDesktop";
import LoadingPage from "../components/LoadingPage";
import { theme, label, display, btnGhost } from "../theme";
import Footer from "../components/Footer";

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

      <Footer />
    </div>
  );
}