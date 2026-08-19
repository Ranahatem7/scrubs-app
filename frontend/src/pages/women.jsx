import { useState } from "react";
import PulseDivider from "../components/PulseDivider";
import ProductCard from "../components/ProductCard";
import useIsDesktop from "../hooks/useIsDesktop";
import useProducts from "../hooks/useProducts";
import { theme, label, display, btnGhost } from "../theme";
import LoadingPage from "../components/LoadingPage";
import Footer from "../components/Footer";

const WOMEN_FILTERS = [
  { id: "all", name: "All" },
];

export default function Women() {
  const isDesktop = useIsDesktop(700);
  const [activeFilter, setActiveFilter] = useState("all");
  const { products, loading, error, retry } = useProducts();

  if (loading) return <LoadingPage />;

  const womenProducts = products.filter(
    (p) => p.gender === "women" || p.gender === "unisex" || !p.gender
  );
  const filtered =
    activeFilter === "all"
      ? womenProducts
      : womenProducts.filter((p) => p.category === activeFilter);

  const s = {
    filterBar: {
      display: "flex",
      gap: 8,
      overflowX: "auto",
      padding: `28px ${theme.pad}px 0`,
      scrollSnapType: "x mandatory",
      background: theme.surfaceLight,
    },
    filterPill: (active) => ({
      flex: "0 0 auto",
      scrollSnapAlign: "start",
      padding: "7px 18px",
      borderRadius: 999,
      border: `1px solid ${active ? theme.accent : theme.lightGray}`,
      background: active ? theme.accent : theme.surfaceLight,
      color: active ? theme.textOnDark : theme.textOnLight,
      fontSize: 12,
      fontFamily: theme.fontBody,
      letterSpacing: "0.08em",
      cursor: "pointer",
      transition: "border-color 0.18s, color 0.18s, background 0.18s",
      whiteSpace: "nowrap",
    }),

    section: { padding: "40px 0 64px", background: theme.surfaceLight },
    head: { padding: `0 ${theme.pad}px`, marginBottom: 24 },
    title: { ...display, margin: "8px 0 0", fontSize: 34, color: theme.accent },
    countNote: {
      marginTop: 4,
      fontSize: 12,
      color: theme.textOnLightMuted,
      letterSpacing: "0.1em",
    },

    grid: {
      display: "grid",
      gridTemplateColumns: `repeat(${isDesktop ? 4 : 2}, 1fr)`,
      gap: "22px 12px",
      padding: `0 ${theme.pad}px`,
    },

    empty: {
      padding: `56px ${theme.pad}px`,
      textAlign: "center",
      color: theme.textOnLightMuted,
      fontSize: 13,
      letterSpacing: "0.12em",
    },
    errorText: { margin: "0 0 18px", color: "#c0524a", letterSpacing: "0.02em" },
    retryBtn: { ...btnGhost("light"), display: "inline-flex" },

    statement: {
      padding: `64px ${theme.pad}px 0`,
      textAlign: "center",
      background: theme.surfaceLight,
    },
    statementText: {
      ...display,
      margin: "0 auto 18px",
      fontSize: isDesktop ? 36 : 26,
      fontStyle: "italic",
      lineHeight: 1.3,
      maxWidth: isDesktop ? "20ch" : "none",
      color: theme.accent,
    },
  };

  return (
    <main id="top">
      {/* Filter bar */}
      <div style={s.filterBar} className="no-scrollbar" role="group" aria-label="Filter by category">
        {WOMEN_FILTERS.map((f) => (
          <button
            key={f.id}
            style={s.filterPill(activeFilter === f.id)}
            onClick={() => setActiveFilter(f.id)}
          >
            {f.name}
          </button>
        ))}
      </div>

      {/* Products */}
      <section style={s.section} id="products">
        <div style={s.head}>
          <span style={label("light")}>Women&rsquo;s scrubs</span>
          <h2 style={s.title}>
            {activeFilter === "all"
              ? "All pieces"
              : WOMEN_FILTERS.find((f) => f.id === activeFilter)?.name}
          </h2>
          {!error && (
            <p style={s.countNote}>
              {filtered.length} {filtered.length === 1 ? "item" : "items"}
            </p>
          )}
        </div>

        {error && (
          <div style={s.empty}>
            <p style={s.errorText}>{error}</p>
            <button style={s.retryBtn} onClick={retry}>Try again</button>
          </div>
        )}

        {!error && filtered.length > 0 && (
          <div style={s.grid}>
            {filtered.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}

        {!error && filtered.length === 0 && (
          <p style={s.empty}>No items in this category yet.</p>
        )}
      </section>

      <PulseDivider />

      {/* Brand statement */}
      <section style={s.statement}>
        <p style={s.statementText}>
          Every detail considered. Every seam placed where it needs to be.
        </p>
        <span style={label("light")}>MedTrack · Cairo</span>
      </section>

      <Footer />
    </main>
  );
}