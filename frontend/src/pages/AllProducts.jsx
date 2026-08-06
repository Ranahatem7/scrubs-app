import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import ProductCard from "../components/ProductCard";
import Footer from "../components/Footer";
import useIsDesktop from "../hooks/useIsDesktop";
import { theme, label, display, btnGhost } from "../theme";

export default function AllProducts() {
  const isDesktop = useIsDesktop(700);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q") || "";

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/products")
      .then((r) => r.json())
      .then((data) => setProducts(Array.isArray(data) ? data : []))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const filtered = query
    ? products.filter((p) => p.name?.toLowerCase().includes(query.toLowerCase()))
    : products;

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
      marginLeft: isDesktop ? 40 : 16,
      marginTop: 32,
      marginBottom: 8,
    },
  };

  return (
    <div style={s.page}>
      <Link to="/" style={s.back}>← Back</Link>
      <div style={s.hero}>
        <span style={label("light")}>{query ? `Search: "${query}"` : "Catalogue"}</span>
        <h1 style={s.title}>{query ? "Results" : "All Products"}</h1>
        {!loading && (
          <p style={s.count}>{filtered.length} product{filtered.length !== 1 ? "s" : ""}</p>
        )}
      </div>

      {loading && <p style={s.state}>Loading…</p>}
      {!loading && error && <p style={{ ...s.state, color: "#c0524a" }}>{error}</p>}
      {!loading && !error && filtered.length === 0 && (
        <p style={s.state}>{query ? `No products found for "${query}"` : "No products yet — check back soon."}</p>
      )}
      {!loading && !error && filtered.length > 0 && (
        <div style={s.grid}>
          {filtered.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      )}
      <Footer />
    </div>
  );
}